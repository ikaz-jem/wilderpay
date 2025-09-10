"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { headers } from "next/headers";
import Deposit from "@/app/models/depositSchema/depositSchema";
import { revalidatePath } from "next/cache";
import dbConnect from "@/app/lib/db";
import User from "@/app/models/userSchema/UserSchema";
import Balance from "@/app/models/balanceSchema/balanceSchema";

export async function confirmWalletDeposit(transactionData) {




const session = await getServerSession(authOptions);
const user = session?.user?.id

if (!user) {
    return "Unothorized";
}




const {chain,token,amount,recipient,transactionHash,timestamp} = transactionData
if (!chain|| !token || !amount|| !recipient|| !transactionHash|| !timestamp){
    return { success: false, message: "Missing Transaction" };
}

const depositExist = await Deposit.findOne({user,signature:transactionHash})

if (depositExist){
    return { success: false, message: "Transaction Duplicated Please refresh" };
}

const deposit = {
    user,
    chain,
    amount,
    recipient,
    timestamp,
    currency:token?.toLowerCase(),
    status:'credited',
    depositType:'deposit',
    signature:transactionHash,
    walletIndex:session?.user?.walletIndex
}


try {
    await dbConnect();

    const normalizedCurrency = token.toLowerCase();

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

      if (!balanceDoc) {
        console.error("Failed to upsert balance.");
        return { status: "error", error: "Balance upsert failed." };
      }

      await User.findByIdAndUpdate(user, {
        $addToSet: { balances: balanceDoc._id },
      });
    }

  

    revalidatePath("/dashboard/deposit");
    return { success: true, message: `Deposited ${amount} ${token}`  };
  } catch (error) {
    console.error("❌ Failed to record deposit:", error);
    return { success: false, error };
  }

}



