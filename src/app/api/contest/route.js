import mongoose from "mongoose";
import User from "@/app/models/userSchema/UserSchema";
import dbConnect from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
export async function GET(req) {
    const session = await getServerSession(authOptions);
    
    
    
    if (!session?.user?.id) {
        return Response.json({ success: false, message: "Unauthorized" });
    }
    
    
    const userId = session.user.id;
    
    
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 50;
    const skip = (page - 1) * limit;
    
    try {
      await dbConnect();
    // -----------------------------------
    // 1️⃣ Get logged-in user stats
    // -----------------------------------
    const userStatsRaw = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "stakings",
          localField: "_id",
          foreignField: "user",
          as: "stakings",
        },
      },
      {
        $addFields: {
          usdtStakings: {
            $filter: {
              input: "$stakings",
              as: "s",
              cond: { $eq: ["$$s.currency", "usdt"] },
            },
          },
        },
      },
      { $addFields: { stakingTotal: { $sum: "$usdtStakings.amount" } } },
      {
        $addFields: {
          combinedScore: { $add: ["$stakingTotal", "$totalVolume"] },
        },
      },
      {
        $addFields: {
          progress: {
            $cond: [
              { $gte: ["$combinedScore", 5000] },
              100,
              { $multiply: [{ $divide: ["$combinedScore", 5000] }, 100] },
            ],
          },
        },
      },
    ]);

    if (!userStatsRaw[0])
      return Response.json({
        success: false,
        message: "User stats not found",
      });

    const userStats = userStatsRaw[0];

    // -----------------------------------
    // 2️⃣ Calculate user rank
    // -----------------------------------
    const userRankRaw = await User.aggregate([
      {
        $lookup: {
          from: "stakings",
          localField: "_id",
          foreignField: "user",
          as: "stakings",
        },
      },
      {
        $addFields: {
          usdtStakings: {
            $filter: {
              input: "$stakings",
              as: "s",
              cond: { $eq: ["$$s.currency", "usdt"] },
            },
          },
        },
      },
      { $addFields: { stakingTotal: { $sum: "$usdtStakings.amount" } } },
      {
        $addFields: {
          combinedScore: { $add: ["$stakingTotal", "$totalVolume"] },
        },
      },
      { $match: { combinedScore: { $gt: userStats.combinedScore } } },
      { $count: "rankAbove" },
    ]);

    const userRank = (userRankRaw[0]?.rankAbove || 0) + 1;

    // -----------------------------------
    // 3️⃣ GLOBAL LEADERBOARD (paginated)
    // -----------------------------------
    const leaderboard = await User.aggregate([
      {
        $lookup: {
          from: "stakings",
          localField: "_id",
          foreignField: "user",
          as: "stakings",
        },
      },
      {
        $addFields: {
          usdtStakings: {
            $filter: {
              input: "$stakings",
              as: "s",
              cond: { $eq: ["$$s.currency", "usdt"] },
            },
          },
        },
      },
      { $addFields: { stakingTotal: { $sum: "$usdtStakings.amount" } } },
      {
        $addFields: {
          combinedScore: { $add: ["$stakingTotal", "$totalVolume"] },
        },
      },
      {
        $addFields: {
          progress: {
            $cond: [
              { $gte: ["$combinedScore", 5000] },
              100,
              { $multiply: [{ $divide: ["$combinedScore", 5000] }, 100] },
            ],
          },
        },
      },
      { $sort: { combinedScore: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          name: 1,
          // Mask email: show first 2 chars + '****' + domain
          email: {
            $concat: [
              { $substrCP: ["$email", 0, 2] },
              "****",
              { $substrCP: [
                  "$email",
                  { $indexOfCP: ["$email", "@"] },
                  { $subtract: [ { $strLenCP: "$email" }, { $indexOfCP: ["$email", "@"] } ] }
                ]
              }
            ]
          },
          image: 1,
          totalVolume: 1,
          stakingTotal: 1,
          combinedScore: 1,
          progress: 1,
          walletIndex: 1,
        },
      },
    ]);

    const totalUsers = await User.countDocuments();

    // -----------------------------------
    // 4️⃣ TOP 10 USERS WHO REACHED 5K
    // -----------------------------------
    const top10 = await User.aggregate([
      {
        $lookup: {
          from: "stakings",
          localField: "_id",
          foreignField: "user",
          as: "stakings",
        },
      },
      {
        $addFields: {
          usdtStakings: {
            $filter: {
              input: "$stakings",
              as: "s",
              cond: { $eq: ["$$s.currency", "usdt"] },
            },
          },
        },
      },
      { $addFields: { stakingTotal: { $sum: "$usdtStakings.amount" } } },
      { $addFields: { combinedScore: { $add: ["$stakingTotal", "$totalVolume"] } } },
      { $match: { combinedScore: { $gte: 5000 } } },
      { $sort: { combinedScore: -1 } },
      { $limit: 10 },
      {
        $project: {
          name: 1,
          email: {
            $concat: [
              { $substrCP: ["$email", 0, 2] },
              "****",
              { $substrCP: [
                  "$email",
                  { $indexOfCP: ["$email", "@"] },
                  { $subtract: [ { $strLenCP: "$email" }, { $indexOfCP: ["$email", "@"] } ] }
                ]
              }
            ]
          },
          image: 1,
          totalVolume: 1,
          stakingTotal: 1,
          combinedScore: 1,
          walletIndex: 1,
        },
      },
    ]);


    return Response.json({
      success: true,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
      leaderboard,
      top10,
      user: {
        rank: userRank,
        totalVolume: userStats.totalVolume,
        stakingTotal: userStats.stakingTotal,
        combinedScore: userStats.combinedScore,
        progress: userStats.progress,
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Error fetching leaderboard" },
      { status: 500 }
    );
  }
}
