import bcrypt from "bcryptjs";
import UserSchema from "@/app/models/userSchema/UserSchema";
import dbConnect from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
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
  const id = searchParams.get("id"); // ?id
  const maxDepth = 10; // Set max depth for referral levels

  if (id) {
    const user = await UserSchema.findById(id);
    if (!user)
      return Response.json({ success: false, message: "User Not found" }, { status: 400 });
    return Response.json({ success: true, data: user }, { status: 200 });
  }

  try {
    // Get query params for pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Fetch users with pagination and roles "admin" and "leader"
    const users = await UserSchema.find({ role: { $in: ['admin', 'leader'] } })
      .populate("balances")
      .populate("withdrawls")
      .populate("staking")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // optional: newest first

    // Count total users with the specified roles
    const totalUsers = await UserSchema.countDocuments({ role: { $in: ['admin', 'leader'] } });

    // Recursive function to fetch referrals up to maxDepth for each user and count by levels
    const getReferralCounts = async (userId, currentLevel = 1, maxDepth = 10, levelCounts = {}) => {
      if (currentLevel > maxDepth) return levelCounts;

      // Get referrals of the current user at the given level (referrals are stored in referredUsers array)
      const referrals = await UserSchema.find({ referredBy: userId });

      // Count referrals at the current level
      levelCounts[currentLevel] = referrals.length;

      // Recursively get referrals at the next level for each referral
      for (let referral of referrals) {
        levelCounts = await getReferralCounts(referral._id, currentLevel + 1, maxDepth, levelCounts);
      }

      return levelCounts;
    };

    // For each user, get referral counts up to 10 levels
    const usersWithReferralCounts = await Promise.all(
      users.map(async (user) => {
        const referralCounts = await getReferralCounts(user._id, 1, maxDepth);
        return {
          ...user.toObject(),
          referralCounts, // Adding referral counts for each level
        };
      })
    );

    return Response.json({
      users: usersWithReferralCounts,
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
