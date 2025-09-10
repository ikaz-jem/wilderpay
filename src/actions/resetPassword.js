"use server"

import dbConnect from "@/app/lib/db"
import { generateVerificationToken } from "@/app/lib/tokens"
import UserSchema from "@/app/models/userSchema/UserSchema"
import { resetPasswordEmail } from "./resetPasswordEmail"
import { headers } from "next/headers"
export async function ResetPasswordVerification (email){

    const allowedOrigin = process.env.ORIGINS;
    // Check Origin or Referer header to verify request source
    const origin = await headers().get("host");
    console.log(origin)
    // If origin/referer exists and is not allowed, block the request
    if (  !allowedOrigin.includes(origin)) {
      return Response.json({success:false,message:'forbidden'});
    }


await dbConnect()

const user = UserSchema.findOne({email})

if (user){
    const newCode = generateVerificationToken()
    const data = await resetPasswordEmail(email,newCode)
if (data){
    return {success:true,message:"An Email Has Been Sent"}
}

}else {
 return
}

}