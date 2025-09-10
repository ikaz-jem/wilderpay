"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/lib/db";
import User from "@/app/models/userSchema/UserSchema";
import Balance from "@/app/models/balanceSchema/balanceSchema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function transferAction(email, amount, currency,apiKey) {
 
  const request = await headers();
  const isValid = apiKey == process.env.NEXT_PUBLIC_SECRET;


  if (!isValid) {
    return { success: false, message: "forbiden", type: "error" };
  }


  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false };
  }

  const connection = await dbConnect();
  const normalizedEmail = email.toLowerCase();

  // Find the recipient user by email
  const toUser = await User.findOne({ email: normalizedEmail });
  if (!toUser)
    return { success: false, message: "User Not Found", type: "error" };

  // Create or update the balance entry for the recipient
  const toUserBalance = await Balance.findOneAndUpdate(
    { user: toUser._id, currency: currency }, // Ensure we are checking by user and currency
    { $inc: { amount: amount } }, // Increment the amount of USDT
    { upsert: true, new: true } // If no document exists, create it
  );

  // Now push the balance object ID to the recipient's balances array if it's not there
  if (!toUser.balances.includes(toUserBalance._id)) {
    toUser.balances.push(toUserBalance._id);
    await toUser.save(); // Save the updated user
  }

  // Find the sender (the one who initiated the transfer)
  const sender = await User.findById(session.user.id);
  const senderBalance = await Balance.findOne({
    user: sender._id,
    currency: currency,
  });

  if (!senderBalance || senderBalance.amount < amount) {
    return {
      success: false,
      message: "Insufficient funds in sender account",
      type: "error",
    };
  }

  // Deduct the amount from the sender's balance
  senderBalance.amount -= amount;
  await senderBalance.save(); // Save the updated sender balance
  revalidatePath("/dashboard/transfer");
  return { success: true, message: "funds transfered Succesfully !" };
}
