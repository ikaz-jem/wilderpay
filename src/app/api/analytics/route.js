import bcrypt from "bcryptjs";
import User from "@/app/models/userSchema/UserSchema";
import dbConnect from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Balance from "@/app/models/balanceSchema/balanceSchema";
import Deposit from "@/app/models/depositSchema/depositSchema";
import Staking from "@/app/models/stacking/stakingSchema";
import { headers } from "next/headers";

export async function POST(req) {
  
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response("Missing required fields", { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response("User already exists", { status: 409 });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return new Response("User created successfully", { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(req) {

  

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ success: false, message: "Unauthorized" });



  const { searchParams } = new URL(req.url);

  const id = session.user.id; // ?tok

  
    const user = await User.findById(id);

    if (!user)
      return Response.json(
        { success: false, message: "User Not found" },
        { status: 400 }
      );

         if (user.role !=="admin"){
        
             return Response.json({ success: false, massage:'not admin'}, { status: 200 });
  }
 



  const results = await Balance.aggregate([
    {
      $facet: {
        balancesByCurrency: [
          {
            $group: {
              _id: "$currency",
              totalAmount: { $sum: "$amount" },
              holders: { $addToSet: "$user" },
            },
          },
          {
            $project: {
              _id: 0,
              currency: "$_id",
              totalAmount: 1,
              holdersCount: { $size: "$holders" },
            },
          },
        ],
        totalUsers: [
          {
            $group: {
              _id: "$user",
            },
          },
          {
            $count: "userCount",
          },
        ],
      },
    },
  ]);

  const txStats = await Deposit.countDocuments();
  const usersCount = await User.countDocuments();
  const stakingCount = await Staking.countDocuments();

  const stakings = await Staking.aggregate([
    {
      $facet: {
        totalStakedByCurrency: [
          // Step 1: Compute dailyPayment, daysPassed, remainingDays, claimedProfitToDate, 30-day forecast
          {
            $addFields: {
              dailyPayment: { $divide: ["$profits", "$duration"] },
              daysPassed: {
                $ceil: {
                  $divide: [
                    { $subtract: [new Date(), "$createdAt"] },
                    1000 * 60 * 60 * 24,
                  ],
                },
              },
            },
          },
          {
            $addFields: {
              daysPassed: {
                $cond: [
                  { $gt: ["$daysPassed", "$duration"] },
                  "$duration",
                  "$daysPassed",
                ],
              },
              remainingDays: { $subtract: ["$duration", "$daysPassed"] },
              claimedProfitToDate: {
                $multiply: ["$dailyPayment", "$daysPassed"],
              },
              forecast30Days: {
                $multiply: ["$dailyPayment", { $min: ["$remainingDays", 30] }],
              },
            },
          },
          // Step 2: Group by currency
          {
            $group: {
              _id: "$currency",
              totalStaked: { $sum: "$amount" },
              holders: { $addToSet: "$user" },
              totalProfits: { $sum: "$profits" },
              avgDuration: { $avg: "$duration" },
              avgDailyPayment: { $avg: "$dailyPayment" },
              avgClaimedProfitToDate: { $avg: "$claimedProfitToDate" },
              vaultForecast30Days: { $sum: "$forecast30Days" },
            },
          },
          // Step 3: Project final fields
          {
            $project: {
              _id: 0,
              currency: "$_id",
              totalStaked: 1,
              holdersCount: { $size: "$holders" },
              totalProfits: 1,
              avgDuration: 1,
              avgDailyPayment: 1,
              avgClaimedProfitToDate: 1,
              vaultForecast30Days: 1,
            },
          },
        ],

        lockedUnlockedStats: [
          {
            $group: {
              _id: "$claimed",
              count: { $sum: 1 },
              totalAmount: { $sum: "$amount" },
            },
          },
        ],

        claimedStakes: [
          { $match: { claimed: true } }, // only claimed stakes
          {
            $group: {
              _id: null,
              totalClaimedAmount: { $sum: "$amount" },
              totalClaimedProfits: { $sum: "$profits" },
              totalClaimed: { $sum: { $add: ["$amount", "$profits"] } },
            },
          },
          {
            $project: {
              _id: 0,
              totalClaimedAmount: 1,
              totalClaimedProfits: 1,
              totalClaimed: 1,
            },
          },
        ],
      },
    },
  ]);

  return Response.json({
    balances: results[0]?.balancesByCurrency,
    txCount: txStats,
    staking: stakings[0].totalStakedByCurrency,
    totalStakings: stakingCount,
    lockedUnlockedStats: stakings[0].lockedUnlockedStats,
    totalUsers: usersCount,
  });
}
