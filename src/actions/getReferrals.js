"use server";

import User from "@/app/models/userSchema/UserSchema";
import dbConnect from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import depositSchema from "@/app/models/depositSchema/depositSchema";
import { headers } from "next/headers";



export async function getReferrals(userId , apiKey) {

    const request = await headers();

    const isValid = apiKey == process.env.NEXT_PUBLIC_SECRET
    

    if (!isValid) {
     return { success: false, message: "forbiden", type: "error" };
    }
  

 const session = await getServerSession(authOptions);
  if (!session?.user?.id) return 

  await dbConnect();

  const user = await User.findOne({ _id: userId })
    .select("-password")
    .populate([
      {
        path: "referredUsers",
        select: "-password",
        options: { sort: { createdAt: -1 }, limit: 5 },
        lean: true,
      },
    ])
    .populate('bonuses')
    .lean();

  const deposits = await depositSchema
    .find({
      _id: { $in: user.deposits }, // match only deposits belonging to the user
      depositType: { $in: ["rebate", "referral bonus"] }, 
      
    }).sort({ createdAt: -1 })
    .lean();

  user.deposits = deposits;

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const userData = JSON.parse(JSON.stringify(user));
  return userData;
}
