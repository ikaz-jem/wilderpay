import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/app/lib/db";
import UserSchema from "@/app/models/userSchema/UserSchema";
import bcrypt from 'bcryptjs';
import { headers } from "next/headers";

export async function POST(req) {

const request = await headers()


  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ success: false, message: "Unauthorized" });


    const userId = session?.user?.id


    const { password, oldPassword, name } = await req.json()

    await dbConnect()

    const dbUser = await UserSchema.findById(userId)

    if (!dbUser.password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        dbUser.name = name
        dbUser.password = hashedPassword
        await dbUser.save()
        return Response.json({ success: false, message: 'Info Updated !' })
    }



    const isCorrect = bcrypt.compareSync(oldPassword, dbUser.password)
    if (!isCorrect) {
        return Response.json({ success: false, message: 'Incorrect Password !' })
    } 
     const hashedPassword = bcrypt.hashSync(password, 10);

    dbUser.name = name
        dbUser.password = hashedPassword
        await dbUser.save()
    
        return Response.json({ success: false, message: 'Info Updated !' })
    




}