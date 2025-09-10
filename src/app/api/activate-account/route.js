import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Balance from "@/app/models/balanceSchema/balanceSchema";
import dbConnect from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import User from "@/app/models/userSchema/UserSchema";




export async function POST(req) {




  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ success: false, message: "Unauthorized" });


  
  const userCurrency = await req.json();

  await dbConnect();

  const currencyBalance = await Balance.findById(userCurrency?._id);
  if (!currencyBalance)
    return Response.json({
      success: false,
      message: "No Balance For this currency",
    });


  const neededCoins = userCurrency?.coinsNeeded


if (neededCoins == null || isNaN(neededCoins)){
    return Response.json({
      success: false,
      message: "insufficient balance",
    });
}


  if (currencyBalance?.amount < neededCoins){
      return Response.json({
      success: false,
      message: "insufficient balance",
    });
  }


  const updatedBalance = await Balance.findByIdAndUpdate(
    userCurrency?._id, // ID of the balance document to update
    { $inc: { amount: -neededCoins } }, // Increment/Decrement the 'amount' field
    { upsert: true, new: true } // Options: upsert (create if not exists), return updated doc
  );


  await User.findByIdAndUpdate(session.user.id, {
    verified:true
  });


 
  revalidatePath("/dashboard");
  return Response.json({ success: true, message: "Your Account Has Been Activated" });
}
