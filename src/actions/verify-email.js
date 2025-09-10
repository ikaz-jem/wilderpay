"use server"

import dbConnect from "@/app/lib/db"
import UserSchema from "@/app/models/userSchema/UserSchema"
import { isUuid } from "uuidv4";
import { headers } from "next/headers";

export async function verifyEmailByToken(token) {

  await dbConnect();

  if (!token) {
    return { success: false, message: 'verification Code Required.' }
  }

  const validId = isUuid(token)
  if (!validId){
    return { success: false, message: 'Invalid verification token.' };
  }
  const user = await UserSchema.findOne({ verificationToken: token , emailVerified:false });


  if (!user) {
    return { success: false, message: 'Invalid or Expired verification token.' };
  }

  const isExpired = user.verificationTokenExpires < new Date();
  if (isExpired) {
    return {
      success: false,
      message: 'Verification Code Expired',
      resent: true,
      email:user.email || true
    };
  } else {
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    return { success: true, message: 'Email verified successfully ! ' };
  }
}