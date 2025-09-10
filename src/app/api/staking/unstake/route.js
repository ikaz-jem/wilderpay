import { authOptions } from "../../auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import Staking from "@/app/models/stacking/stakingSchema"
import Balance from "@/app/models/balanceSchema/balanceSchema"
import dbConnect from "@/app/lib/db"
import { headers } from "next/headers"


export async function POST(req) {

  const key = await req.headers.get("x-api-key");
  const isValid = key == process.env.NEXT_PUBLIC_SECRET

  if (!isValid) {
    return Response.json({ success: false, message: "Unauthorized" });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ success: false, message: "Unauthorized" });


    const data = await req.json()
    const user = session.user.id

    await dbConnect()

    const staked = await Staking.findOne({ _id: data?.id, user, claimed: false })

    if (!staked) { return Response.json({ success: false, message: 'Not found !' }) }

    if (staked.claimed) { return Response.json({ success: false, message: 'Already claimed !' }) }

    if (new Date() < staked.unlocksAt) { return NextResponse.json({ success: false, message: "Stake still locked" }); }

    let totalProfits = staked.amount + staked.profits

    const balanceDoc = await Balance.findOneAndUpdate(
        { user, currency: staked.currency },
        { $inc: { amount: staked.amount } },
        { upsert: true, new: true }
    );

    staked.claimed = true
    staked.unlocked = true
    staked.amountClaimed = totalProfits

    await staked.save()

    return Response.json({ succes: true, data: balanceDoc })


}