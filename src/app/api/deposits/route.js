import Deposit from "@/app/models/depositSchema/depositSchema";
import { revalidatePath } from "next/cache";
import dbConnect from "@/app/lib/db";
import User from "@/app/models/userSchema/UserSchema";
import Balance from "@/app/models/balanceSchema/balanceSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {


  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return Response.json({ success: false, message: "Unauthorized" });

  const connection = await dbConnect();

  const deposits = await Deposit.find({ user: session?.user?.id });
  if (!deposits)
    return Response.jsont({
      success: true,
      message: "No available Transactions",
    });
  return Response.json(deposits);
}

export async function POST(req) {

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return;

  const deposit = await req.json();

  const { user, address, currency, amount } = deposit;

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
        return Response.json({
          status: "error",
          error: "Balance upsert failed.",
        });
      }

      await User.findByIdAndUpdate(user, {
        $addToSet: { balances: balanceDoc._id },
      });
    }

    if (updatedUser.referredBy && updatedUser.referredBy != user) {
      let percent = (7 * amount) / 100;
      const depositToRef = await Deposit.create({
        user: updatedUser.referredBy,
        forwarded: true,
        status: "credited",
        amount: percent,
        currency,
        depositType: "Referral bonus",
      });

      const refBalance = await Balance.findOneAndUpdate(
        { user: updatedUser.referredBy, currency: normalizedCurrency },
        { $inc: { amount: percent } },
        { upsert: true, new: true }
      );
      const userUpdate = await User.findByIdAndUpdate(
        updatedUser.referredBy,
        {
          $addToSet: { deposits: depositToRef._id, balances: refBalance._id },
        },
        { new: true, upsert: true }
      );

      const yieldBalance = await Balance.findOneAndUpdate(
        { user: updatedUser.referredBy, currency: "yieldium" },
        { $inc: { amount: 500 } },
        { upsert: true, new: true }
      );
    }

    console.log("✅ Deposit recorded:", deposited._id);
    revalidatePath("/dashboard/deposit");
    return Response.json({
      status: "success",
      depositId: deposited._id.toString(),
    });
  } catch (error) {
    console.error("❌ Failed to record deposit:", error);
    return Response.json({ status: "error", error });
  }
}




