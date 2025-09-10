"use server";

import Deposit from "@/app/models/depositSchema/depositSchema";
import { revalidatePath } from "next/cache";
import dbConnect from "@/app/lib/db";
import User from "@/app/models/userSchema/UserSchema";
import Balance from "@/app/models/balanceSchema/balanceSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {  headers } from "next/headers";

export async function depositFunds(deposit, dataCheck, apiKey) {

  const key = process.env.CHECK_KEY;

  if (key !== dataCheck) {
    return { success: false, message: "forbiden", type: "error" };
  }

  const isValid = apiKey == process.env.NEXT_PUBLIC_SECRET;
 

  if (!isValid) {
    return { success: false, message: "forbiden", type: "error" };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return;

  const { user, address, currency, amount , signature } = deposit;

  const depositExists = await Deposit.findOne({user,signature})

  if (depositExists) {
        return { success: false, message: "forbiden", type: "error" };
  }


    deposit.depositType = "deposit"

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

    ///

    if (deposited.status === "credited") {
      const balanceDoc = await Balance.findOneAndUpdate(
        { user, currency: normalizedCurrency },
        { $inc: { amount } },
        { upsert: true, new: true }
      );

      const yieldBalance = await Balance.findOneAndUpdate(
        { user, currency: "yieldium" },
        { $inc: { amount: 500 } },
        { upsert: true, new: true }
      );

      if (!balanceDoc) {
        console.error("Failed to upsert balance.");
        return { status: "error", error: "Balance upsert failed." };
      }

      await User.findByIdAndUpdate(user, {
        $addToSet: { balances: balanceDoc._id },
      });
    }

    // if (updatedUser.referredBy && updatedUser.referredBy != user) {
    //   let percent = (7 * amount) / 100;
    //   const depositToRef = await Deposit.create({
    //     user: updatedUser.referredBy,
    //     forwarded: true,
    //     status: "credited",
    //     amount: percent,
    //     currency,
    //     depositType: "Referral bonus",
    //   });

    //   const refBalance = await Balance.findOneAndUpdate(
    //     { user: updatedUser.referredBy, currency: normalizedCurrency },
    //     { $inc: { amount: percent } },
    //     { upsert: true, new: true }
    //   );
    //   const userUpdate = await User.findByIdAndUpdate(
    //     updatedUser.referredBy,
    //     {
    //       $addToSet: { deposits: depositToRef._id, balances: refBalance._id },
    //     },
    //     { new: true, upsert: true }
    //   );

    //   const yieldBalance = await Balance.findOneAndUpdate(
    //     { user: updatedUser.referredBy, currency: "yieldium" },
    //     { $inc: { amount: 500 } },
    //     { upsert: true, new: true }
    //   );
    // }

    console.log("✅ Deposit recorded:", deposited._id);
    revalidatePath("/dashboard/deposit");
    return { status: "success", depositId: deposited._id.toString() };
  } catch (error) {
    console.error("❌ Failed to record deposit:", error);
    return { status: "error", error };
  }
}
