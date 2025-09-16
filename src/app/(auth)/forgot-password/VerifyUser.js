"use server";

import dbConnect from "@/app/lib/db";
import UserSchema from "@/app/models/userSchema/UserSchema";
import bcrypt from "bcryptjs";
import { oneTimePasswordEmail } from "./oneTimePasswordEmail";

export async function VerifyUser(email) {
  await dbConnect();

  const user = await UserSchema.findOne({ email: email });

  if (!user) {
    return {
      success: true,
      message: "Email with Instructions has been sent !",
    };
  }

  let userData = await JSON.parse(JSON.stringify(user))

  const randomNumber = Math.floor(Math.random() * 1000) + 1;
  const password = userData?._id.slice(0, 5) + randomNumber;

  const hashedPassword = bcrypt.hashSync(password, 10);

  user.password = hashedPassword;
  await user.save();
  const mailSent = await oneTimePasswordEmail(email,password)

  return { success: true, message: "Email with Instructions has been sent !" };
}
