"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/lib/db";
import Balance from "@/app/models/balanceSchema/balanceSchema";
import UserSchema from "@/app/models/userSchema/UserSchema";
import withdrawSchema from "../../app/models/withdrawSchema/withdrawSchema";
import { withdrawUsdt } from "@/web3/transactions/withdrawUsdt.js";
import { sendWithdrawEmail } from "./sendWithdrawEmail";

const minWithdraw = 10;

const minReff = 2;

const minVolume = 100;


function calculateLeader(amount, volume, withdrawCount) {
  const volumeMultiplier = volume > 500 ? 200 : 100;
  const withdraw = (Number(volume) *10) / 100;
  const requiredVolume = (Number(withdrawCount) + 1) * volumeMultiplier;
  const maxWithdraw = volume >= 1000 ? 100 : withdraw;

  if (amount > maxWithdraw) {
    return {
      success: false,
      message: `Max Withdraw For Your Level is ${maxWithdraw} USDT , Unlock More With Progress`,
    };
  }

  if (volume < requiredVolume) {
    return {
      success: false,
      message: `You Need  ${requiredVolume} USDT in Total Volume For Your Level To Unlock Next Withdraw`,
    };
  }

  return { success: true };
}

export async function withdrawAction(amount, toAddress, chain, apiKey) {
  const isValid = apiKey == process.env.NEXT_PUBLIC_SECRET;

  if (!isValid) {
    return { success: false, message: "forbiden", type: "error" };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false };
  }

  let key = process.env.WITHDRAW;

  const connection = await dbConnect();

  const user = await UserSchema.findById(session.user.id);

  if (user?.role == "demo") {
    return { success: false, message: "Not Allowed", type: "error" };
  }

  if (!user)
    return { success: false, message: "User Not Found", type: "error" };

  if (user.isRestricted)
    return {
      success: false,
      message: "Account Restricted Please contact support",
      type: "error",
    };

  if (!user.emailVerified)
    return {
      success: false,
      message: "Email Verification Required",
      type: "error",
    };

  if (user.role === "leader" && user?.referredUsers?.length < minReff) {
    return {
      success: false,
      message: `You Need At Least ${minReff} Direct Referrals To Unlock Withdrawals`,
      type: "error",
    };
  }

  if (user.role == "leader") {
    const check = calculateLeader(
      amount,
      user.totalVolume,
      user?.withdrawls?.length
    );
    console.log(check);
    if (!check.success) {
      return {
        success: false,
        message: check?.message,
        type: "error",
      };
    }
  }


  // if its admin sends email only without transaction
  if (user.role == "admin") {
    const emailSent = await sendWithdrawEmail(
      user?.email,
      amount,
      toAddress,
      "Tx Unvailable"
    );
      return { success: true, message: `withdraw of ${amount} completed ! ` };
  }

  

  //  if (user.role === "leader" && user?.withdrawls?.length == 0 && user.totalVolume < minVolume && amount >maxWithdraw) {
  //     return {
  //       success: false,
  //       message: "Max Withdraw is 20$ , you need At Least 100$ Volume To unlock unlimited Amount",
  //       type: "error",
  //     };
  //   }


  const balance = await Balance.findOne({
    user: session.user.id,
    currency: "usdt",
  });

  if (balance.amount < amount) {
    return { success: false, message: "low balance" };
  }

  if (amount < minWithdraw) {
    return { success: false, message: "Min Withdraw is 10 USDT" };
  }

  // if (user.role === "leader" && user?.referredUsers?.length ==0 ) {
  //    return {
  //      success: false,
  //      message: "You Need At Least 2 users to start withdrawing",
  //      type: "error",
  //    };
  //  }

  try {
    // adjust the path if needed

    const result = await withdrawUsdt({
      toAddress: toAddress,
      privateKey: key,
      chain: chain, // or 'bscTestnet' or 'tron'
      amount: amount,
    });

    if (result?.success) {
      balance.amount -= amount;
      await balance.save();

      const withdrawed = await withdrawSchema.create({
        amount,
        chain,
        signature: result?.txHash,
        currency: "usdt",
        address: toAddress,
        user: user._id,
      });

      await UserSchema.findByIdAndUpdate(
        user._id,
        { $addToSet: { withdrawls: withdrawed._id } }, // avoids duplicates
        { new: true }
      );

      const emailSent = await sendWithdrawEmail(
        user?.email,
        amount,
        toAddress,
        result?.txHash
      );

      return { success: true, message: `withdraw of ${amount} completed ! ` };
    } else {
      return {
        success: false,
        message: `Something Went Wrong Please try Again later `,
      };
    }
  } catch (error) {
    console.error("Error importing or running transfer:", error);
  }
}
