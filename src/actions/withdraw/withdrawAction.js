"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/lib/db";
import Balance from "@/app/models/balanceSchema/balanceSchema";
import UserSchema from "@/app/models/userSchema/UserSchema";
import withdrawSchema from "../../app/models/withdrawSchema/withdrawSchema";
import { withdrawUsdt } from "@/web3/transactions/withdrawUsdt.js";
import { sendWithdrawEmail } from "./sendWithdrawEmail";


const minWithdraw = 10
const maxWithdraw = 20
const minReff = 4
const minVolume = 200

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

  

 if (user.role === "leader" && user?.withdrawls?.length > 0 && user.totalVolume < minVolume) {
    return {
      success: false,
      message: "You need $200 total volume From your network to continue withdrawing",
      type: "error",
    };
  }

 if (user.role === "leader" && user?.withdrawls?.length == 0 && user.totalVolume < minVolume && amount >maxWithdraw) {
    return {
      success: false,
      message: "Max Withdraw is 20$ , you need At Least 100$ Volume To unlock unlimited Amount",
      type: "error",
    };
  }

 if (user.role === "leader" && user?.referredUsers?.length < minReff   ) {
    return {
      success: false,
      message: `You Need At Least ${minReff} Direct Referrals To Unlock Withdrawals`,
      type: "error",
    };
  }

  
  
  
  
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
     return { success: false, message: "Pass" };


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
        signature:result?.txHash,
        currency:"usdt",
        address: toAddress,
        user: user._id,
      });


      await UserSchema.findByIdAndUpdate(
        user._id,
        { $addToSet: { withdrawls: withdrawed._id } }, // avoids duplicates
        { new: true }
      );

        const emailSent = await sendWithdrawEmail(user?.email,amount,toAddress,result?.txHash)

      return { success: true, message: `withdraw of ${amount} completed ! ` };
    }else {
      
      return { success: false, message: `Something Went Wrong Please try Again later ` };
    }
  } catch (error) {
    console.error("Error importing or running transfer:", error);
  }
}
