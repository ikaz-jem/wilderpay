
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/app/lib/db";
import Staking from "@/app/models/stacking/stakingSchema";
import Balance from "@/app/models/balanceSchema/balanceSchema";
import User from "@/app/models/userSchema/UserSchema";
import Deposit from "@/app/models/depositSchema/depositSchema";
import BonusSchema from "@/app/models/BonusSchema/BonusSchema";
import { partnerLevel } from "@/app/dashboard/staticData";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";

function exctractCurrentLevel(currentVolume) {

  return partnerLevel.find((level, idx) => {
    if (level.level == 6 && currentVolume >= level.min) {
      return level;
    }
    return currentVolume >= level.min && currentVolume <= level.max;
  });
}

export async function POST(req) {


  


  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ success: false, message: "Unauthorized" });


  const { name, level, bonus }  = await req.json()

  const user = session.user.id;

  await dbConnect();

  const userFound = await User.findById(user);
  if (!userFound)
    return Response.json({ success: false, message: "User Not Found !" });

  const currentLevel = exctractCurrentLevel(userFound?.totalVolume);

  if (currentLevel.level < level || currentLevel.bonus < bonus) { return Response.json({
      success: false,
      message: "Bonus Already Claimed !",
    });
}
  const claimed = await BonusSchema.findOne({
    user,
    name,
    level,
    amount: bonus,
  });
  if (claimed)
    return Response.json({
      success: false,
      message: "Bonus Already Claimed !",
    });

  const bonusCreated = await BonusSchema.create({
    user,
    name,
    level,
    amount: bonus,
    claimed: true,
    currency: "usdt",
  });

  const bonusAdded = await Balance.findOneAndUpdate(
    { user, currency: "usdt" },
    { $inc: { amount: bonus } },
    { upsert: true, new: true }
  );

  const updatedUser = await User.findByIdAndUpdate(user, {
    $addToSet: {
      bonuses: bonusCreated._id,
      balances: bonusAdded._id,
    },
  });


    return Response.json({ success: false, message: "Claimed a Bonus !" });
}

