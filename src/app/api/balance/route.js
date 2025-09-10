import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

import dbConnect from "@/app/lib/db";
import Balance from "@/app/models/balanceSchema/balanceSchema";
import { headers } from "next/headers";


export async function GET(req) {

  const request = await headers();



  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ success: false, message: "Unauthorized" });

  
  const { searchParams } = new URL(req.url);
  const currency = searchParams.get('currency');// 👈 Automatically parsed by Next.js
  await dbConnect()

  if (!currency) {

    const currencyBalance = await Balance.find({ user: session.user.id })
    return Response.json({ success: true, message: 'currency not found ' , currencyBalance })
  } 



  const currencyBalance = await Balance.findOne({ user: session.user.id, currency: currency })
  if (!currencyBalance) return Response.json({ success: false, message: 'No balance for this currency ' })
  return Response.json({ success: true, message: 'User Balance ', currencyBalance })
}