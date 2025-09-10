"use server"
import dbConnect from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";



export async function GetUserDeposits (id){
    
    const session = getServerSession({authOptions})
    console.log(session)
    if (!id) return

await dbConnect()

// const deposits = await Deposit.find({user:id})
//     return deposits



}  