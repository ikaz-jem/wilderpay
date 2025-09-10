import bcrypt from 'bcryptjs';
import UserSchema from '@/app/models/userSchema/UserSchema';
import dbConnect from '@/app/lib/db';

export async function CreateUser(req) {
  try {
    const {email, password } = req;

    if (!email || !password) {
      return Response.json('Missing required fields', { status: 400 });
    }

    await dbConnect();

    const existingUser = await UserSchema.findOne({ email });
    if (existingUser) {
      return Response.json({success:false,message:'account already exists'}, { status: 200 });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new UserSchema({ email, password: hashedPassword });
    await newUser.save();

    return Response.json({succes:true , message:'account created !'}, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json('Internal Server Error', { status: 500 });
  }
}
