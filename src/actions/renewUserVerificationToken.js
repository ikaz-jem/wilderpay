"use server"
import UserSchema from "@/app/models/userSchema/UserSchema"
import dbConnect from "@/app/lib/db"
import { headers } from "next/headers";
//updates verification token 


export async function renewUserVerificationToken (email,tokenObject) {
    const allowedOrigin = process.env.ORIGINS;
    // Check Origin or Referer header to verify request source
    const origin = await headers().get("host");
    console.log(origin)
    // If origin/referer exists and is not allowed, block the request
    if (  !allowedOrigin.includes(origin)) {
      return Response.json({success:false,message:'forbidden'});
    }



    if (!email || !tokenObject){
        return {success:false,message:"something Went Wrong ! Please try again or Later"}
    }
const connection = await dbConnect()
const user = await UserSchema.findOneAndUpdate({email , emailVerified:false},{
    verificationToken:tokenObject?.token,
    verificationTokenExpires:tokenObject?.expiresAt
},)
if (!user){
return {success:false, message:'Email Already Verified'} 
}


return {success:true, message:'New Code Has Been Sent'}
}

