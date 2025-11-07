import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/app/lib/db";
import User from "@/app/models/userSchema/UserSchema";
import { getServerSession } from "next-auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return Response.json({ success: false, message: "Unauthorized" });

  const user = session.user.id;

  await dbConnect();

  const userFound = await User.findById(user);
  const { amount } = await req.json();

  if (!userFound)
    return Response.json({ success: false, message: "User Not Found !" });

  const bonus = userFound.nextBonus;

  if (bonus > 0) {
    return Response.json({
      success: false,
      message: "Bonus Already Claimed !",
    });
  }

    const bonusAdded = await Balance.findOneAndUpdate(
      { user, currency: "wpay" },
      { $inc: { amount: amount } },
      { upsert: true, new: true }
    );

  userFound.nextBonus += amount;
  await userFound.save();

  return Response.json({ success: false, message: "Claimed a Bonus !" });
}
