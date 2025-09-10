import dbConnect from "@/app/lib/db";
import EarningSchema from "@/app/models/EarningSchema/EarningSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";



export async function GET(req, res) {

  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return Response.json({ success: false, message: "Access denied !" });


  await dbConnect();

  const earnings = await EarningSchema.find();


  return Response.json(earnings);
}


