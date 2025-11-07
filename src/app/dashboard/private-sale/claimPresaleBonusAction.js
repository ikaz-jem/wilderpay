"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/lib/db";
import User from "@/app/models/userSchema/UserSchema";
import { getServerSession } from "next-auth";
import Balance from "@/app/models/balanceSchema/balanceSchema";

export async function ClaimPresaleBonus(amount, address) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, message: "Unauthorized" };

  const user = session.user.id;

  await dbConnect();

  const userFound = await User.findById(user);
  const claimed =await User.findOne({address});

  
  if (!userFound) return { success: false, message: "User Not Found !" };

  if (claimed)
    return {
      success: false,
      message: "Bonus Alredy Claimed For this Wallet !",
    };

  const bonusAdded = await Balance.findOneAndUpdate(
    { user, currency: "wpay" },
    { $inc: { amount: amount } },
    { upsert: true, new: true }
  );

  await User.findByIdAndUpdate(user, {
    $addToSet: { balances: bonusAdded._id },
    address
  });

  return {
    success: true,
    message: `you Claimed ${amount} $WPAY!`,
  };
}
