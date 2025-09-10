import bcrypt from "bcryptjs";
import UserSchema from "@/app/models/userSchema/UserSchema";
import dbConnect from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { headers } from "next/headers";

export async function POST(req) {

  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response("Missing required fields", { status: 400 });
    }

    await dbConnect();

    const existingUser = await UserSchema.findOne({ email });
    if (existingUser) {
      return new Response("User already exists", { status: 409 });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new UserSchema({ name, email, password: hashedPassword });
    await newUser.save();

    return new Response("User created successfully", { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(req) {

 

  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return Response.json({ success: false, message: "Unauthorized" });

  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id"); // ?tok

  if (id) {
    const user = await UserSchema.findById(id);
    if (!user)
      return Response.json(
        { success: false, message: "User Not found" },
        { status: 400 }
      );
    return Response.json({ success: true, data: user }, { status: 200 });
  }

  try {
    // get query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // calculate skip
    const skip = (page - 1) * limit;

    // fetch users with pagination
    const users = await UserSchema.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // optional: newest first
    // count total docs
    const totalUsers = await UserSchema.countDocuments();

    return Response.json({
      users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
