import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import User from "@/app/models/userSchema/UserSchema";
import Staking from "@/app/models/stacking/stakingSchema";
import Balance from "@/app/models/balanceSchema/balanceSchema";
import dbConnect from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function POST(req) {
  
  const key = await req.headers.get("x-api-key");
  const isValid = key == process.env.NEXT_PUBLIC_SECRET;

  if (!isValid) {
    return Response.json({ success: false, message: "Unauthorized" });
  }


 
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return Response.json({ success: false, message: "Unauthorized" });

  const data = await req.json();
  const user = session.user.id;

  await dbConnect();

  const investor = await User.findById(user)

  if (investor.role == "leader" || investor.role == "admin") {

   Response.json({ success: false, message: "Not Allowed To perform this Action" });


  }

  const staked = await Staking.findOne({
    _id: data?.id,
    user,
    claimed: false,
    isLocked: true,
  });

  if (!staked) {
    return Response.json({ success: false, message: "Not found !" });
  }

  if (staked.claimed) {
    return Response.json({ success: false, message: "Already claimed !" });
  }

  const percent = (staked.amount * 25) / 100;
  const newCredit = staked.amount - percent;

  const balanceDoc = await Balance.findOneAndUpdate(
    { user, currency: staked.currency },
    { $inc: { amount: newCredit } },
    { upsert: true, new: true }
  );

  staked.claimed = true;
  staked.forced = true;
  staked.isLocked = false;
  staked.amountClaimed = newCredit;

  await staked.save();
  revalidatePath("/dashboard/contracts");
  return Response.json({ succes: true, data: balanceDoc });
}
