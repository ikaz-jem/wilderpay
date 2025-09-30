import dbConnect from "@/app/lib/db";
import Staking from "@/app/models/stacking/stakingSchema";
import { headers } from "next/headers";

const compoundPercent = 5; // 5%, not 0.5

export async function POST(req) {
  const VALID_API_KEY = process.env.CRON_API_KEY;
  const apiKey = (await headers()).get("x-api-key");

  if (apiKey !== VALID_API_KEY) {
    return Response.json({ success: false, message: "Unauthorized" });
  }

  const distributed = await distributeCompound();
  console.log(distributed);

  return Response.json({ success: true, message: "Compound distributed" });
}

async function distributeCompound() {
  const today = new Date();
  await dbConnect();

  const activeStakings = await Staking.find({
    unlocksAt: { $gt: today },
    claimed: false,
  });

  const updates = [];

  for (const staking of activeStakings) {
    const compound = (Number(staking.amount) * compoundPercent) / 100;
    const newAmount = Number(staking.amount) + compound;

    updates.push({
      updateOne: {
        filter: { _id: staking._id },
        update: { $set: { amount: newAmount } },
      },
    });
  }

  if (updates.length > 0) {
    const result = await Staking.bulkWrite(updates);
    return { updated: result.modifiedCount };
  }

  return { updated: 0 };
}
