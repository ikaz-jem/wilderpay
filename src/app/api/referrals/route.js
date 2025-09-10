import mongoose from "mongoose";
import User from "@/app/models/userSchema/UserSchema";
import dbConnect from "@/app/lib/db";
// import { origins } from "../origins";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { headers } from "next/headers";

export async function GET(req, res) {

  const site = await req.headers.get("sec-fetch-site");
  if (site !=="same-origin") {
 return  Response.json({ success: false, message: "Forbiden 403" });  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ success: false, message: "Unauthorized" });



  let headers = await req.headers
  // let origin = await headers.get('origin')
  // if (!origins.includes(origin)) {
  //   await mongoose.disconnect()
  //   return Response.json({ succes: true, message: 'origin Blocked from the server' }, { status: 401 })
  // }

  let apiKey = process.env.API_KEY
  const uiKey = await headers.get('authorization')
  if (apiKey !== uiKey) {
    await mongoose.disconnect()
    return Response.json({ succes: true, message: 'unauthorized' }, { status: 200 })
  }

  await dbConnect();
  const address = await headers.get('address');
  const queryWallet = await req.nextUrl.searchParams.get('address')
  if (address) {
    const user = await User.findOne({ address }).select("referredUsers").populate("referredUsers");
    if (!user) return Response.json({ error: "User not found" });
    await mongoose.disconnect()
    return Response.json({ success: true, data: user });
  }
  if (queryWallet) {
    const user = await User.findOne({ address: queryWallet }).select("referredUsers").populate("referredUsers");
    if (!user) return Response.json({ error: "User not found" });
    await mongoose.disconnect()
    return Response.json({ success: true, data: user });
  }


}


