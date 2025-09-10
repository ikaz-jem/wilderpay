import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Balance from "@/app/models/balanceSchema/balanceSchema";
import dbConnect from "@/app/lib/db";
import axios from "axios";
import { revalidatePath } from "next/cache";
import User from "@/app/models/userSchema/UserSchema";


export async function POST(req) {
   
  
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ success: false, message: "Unauthorized" });



  const { from, to, amount, minus, pair } = await req.json()

  await dbConnect()

  const currencyBalance = await Balance.findOne({ user: session.user.id, currency: from.toLowerCase() })


  if (!currencyBalance ) return Response.json({ success: false, message: 'No Balance For this currency' })
  if (currencyBalance.amount < amount) return Response.json({ success: false, message: 'insuffisant balance For this Swap' })
    const price = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${pair}`).then((res) => Number(res.data?.price))
  
    if (!price) return Response.json({ success: false, message: 'High Swap Volume Please Try Again in Few Minutes' })
  
  const usdt = Math.floor(amount * price)
  const percent = (usdt * 0.25) / 100
  const usdtCredit = usdt - percent

  const converted = await Balance.findOneAndUpdate(
    { user: session.user.id, currency: from },
    { $inc: { amount: -amount } },
    { upsert: true, new: true }
  );



  const newCurrency = await Balance.findOneAndUpdate(
    { user: session.user.id, currency: to },
    { $inc: { amount: usdtCredit } },
    { upsert: true, new: true }
  );


   await User.findByIdAndUpdate(session.user.id, {
        $addToSet: { balances: newCurrency._id }
      });

  revalidatePath('/dashboard/convert')
  return Response.json({ success: true, message: 'Converted' })




}