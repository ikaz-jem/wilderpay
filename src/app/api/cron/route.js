import dbConnect from '@/app/lib/db';
import UserSchema from '@/app/models/userSchema/UserSchema';
import { NextResponse } from 'next/server';

export async function GET() {
const connection = await dbConnect()
const user = await UserSchema.findOne({email:"echchebabzakariae@gmail.com" })
user.balance +=1
await user.save()
  return NextResponse.json({ ok: true ,message:'cron updated'});
}