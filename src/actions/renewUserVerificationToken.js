"use server";
import UserSchema from "@/app/models/userSchema/UserSchema";
import dbConnect from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
//updates verification token

export async function renewUserVerificationToken(email, tokenObject) {


  const session = await getServerSession(authOptions);


  if (!session?.user?.id) {
    return {
      success: false,
      message: "Access Revoked",
    };
  }

  if (!email || !tokenObject) {
    return {
      success: false,
      message: "something Went Wrong ! Please try again or Later",
    };
  }
  const connection = await dbConnect();
  const user = await UserSchema.findOneAndUpdate(
    { email, emailVerified: false },
    {
      verificationToken: tokenObject?.token,
      verificationTokenExpires: tokenObject?.expiresAt,
    }
  );
  if (!user) {
    return { success: false, message: "Email Already Verified" };
  }

  return { success: true, message: "New Code Has Been Sent" };
}
