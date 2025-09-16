import dbConnect from "@/app/lib/db";

import User from "@/app/models/userSchema/UserSchema";
import Deposit from "@/app/models/depositSchema/depositSchema";

import Balance from "@/app/models/balanceSchema/balanceSchema";
import Staking from "@/app/models/stacking/stakingSchema";
import axios from "axios";
import { symbols } from "@/app/dashboard/staticData";
import EarningSchema from "@/app/models/EarningSchema/EarningSchema";
import { headers } from "next/headers";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const YIELDIUM_PERCENT = 0.05;

export async function depositDailyRewards(deposit) {
  const { user, currency, amount, depositType } = deposit;

  try {
    await dbConnect();
    const normalizedCurrency = currency.toLowerCase();
    const deposited = await Deposit.create(deposit);

    if (!deposited) {
      console.error("Failed to upsert deposit.");
      return { status: "error", error: "Deposit upsert failed." };
    }

    const updatedUser = await User.findByIdAndUpdate(
      user,
      {
        $addToSet: { deposits: deposited._id },
      },
      { new: true }
    );

    const balanceDoc = await Balance.findOneAndUpdate(
      { user, currency: normalizedCurrency },
      { $inc: { amount } },
      { upsert: true, new: true }
    );

    if (!balanceDoc) {
      console.error("Failed to upsert balance.");
      return { status: "error", error: "Balance upsert failed." };
    }

    await User.findByIdAndUpdate(user, {
      $addToSet: { balances: balanceDoc._id },
    });

    return { status: true, depositId: deposited._id.toString() };
  } catch (error) {
    console.error("❌ Failed to record deposit:", error);
    return { status: "error", error };
  }
}

export async function POST(req) {
  const VALID_API_KEY = process.env.CRON_API_KEY;
  const apiKey = (await headers()).get("x-api-key"); // Read API key from header

  if (apiKey !== VALID_API_KEY) {
    return Response.json({ success: false, message: "Unauthorized" });
  }

  const distributed = await distributeDailyRewards();

  return Response.json("Success");
}

export const distributeDailyRewards = async () => {
  const today = new Date();

  let prices = {};
  let percent = null;
  await dbConnect();

  if (!percent) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    // Get the one record created today
    const todayPercent = await EarningSchema.findOne({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    percent = Number(todayPercent?.percentage);
  }

  const activeStakings = await Staking.find({
    unlocksAt: { $gt: today },
    claimed: false, // Only consider unclaimed stakings
  }); // Populate user to get referrer's information

  for (const staking of activeStakings) {
    const { user, amount, profits, duration, rate, unlocksAt, currency } =
      staking;
    // Step 4: Calculate the daily rebate for this level
    const dailyReward = (amount * percent) / 100; // Daily reward for this level

    if (duration >= 360) {
      if (!prices[currency]) {
        if (currency == "usdt" || currency == "usdc") {
          prices[currency] = 1;
        } else if (currency == "yieldium") {
          prices[currency] = 0.01;
        } else {
          const coinPrice = await getPrice(symbols[currency]);
          prices[currency] = coinPrice;
          await delay(1000);
        }
      }

      let yieldiumBonus = await calculateYieldiumTokenPercent(staking, prices);

      const bonus = await depositDailyRewards({
        user: user,
        depositType: "daily rewards",
        currency: "yieldium",
        amount: Number(yieldiumBonus),
        timestamp: new Date().toISOString(),
      });
    }

    const reward = await depositDailyRewards({
      user: user,
      depositType: "daily rewards",
      status: "credited",
      currency: currency,
      amount: Number(dailyReward),
      timestamp: new Date().toISOString(),
    });
  }
};

async function calculateYieldiumTokenPercent(staking, currencies) {
  const { user, duration, currency, amount } = staking;

  if (currency == "usdt" || currency == "usdc") {
    if (duration == 720) {
      const percent = (amount * YIELDIUM_PERCENT) / 100;
      const bonus = percent / 0.01;

      return parseFloat(bonus.toFixed(2));
    }
    if (duration == 360) {
      const percent = (amount * (YIELDIUM_PERCENT / 2)) / 100;
      const bonus = percent / 0.01;

      return parseFloat(bonus.toFixed(2));
    }
  }

  if (duration == 720) {
    const totalPrice = currencies[currency] * amount;
    const percent = (totalPrice * YIELDIUM_PERCENT) / 100;
    const bonus = percent / 0.01;

    return parseFloat(bonus.toFixed(2));
  }
  if (duration == 360) {
    const totalPrice = currencies[currency] * amount;
    const percent = (totalPrice * (YIELDIUM_PERCENT / 2)) / 100;
    const bonus = percent / 0.01;

    return parseFloat(bonus.toFixed(2));
  }
  return 0;
}

async function getPrice(currency) {
  const res = await axios
    .get(`https://api.binance.com/api/v3/ticker/price?symbol=${currency}`)
    .then((res) => Number(res.data?.price));
  return res;
}
