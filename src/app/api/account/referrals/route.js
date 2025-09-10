import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

import UserSchema from "@/app/models/userSchema/UserSchema";
import Balance from "@/app/models/balanceSchema/balanceSchema";
import Staking from "@/app/models/stacking/stakingSchema";
import dbConnect from "@/app/lib/db";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json(
      { success: false, message: "Not Authorized" },
      { status: 400 }
    );
  }

  await dbConnect();

  const { searchParams } = new URL(req.url);
  const userId = session?.user?.id || searchParams.get("id");

  const maxDepth = 5;

  if (!userId) {
    return Response.json(
      { success: false, message: "Missing user ID" },
      { status: 400 }
    );
  }

  try {
    const user = await UserSchema.findById(userId);

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Recursive function to gather referral data up to maxDepth
    const getReferralStats = async (
      userId,
      currentLevel = 1,
      maxDepth = 5,
      levelStats = {}
    ) => {
      if (currentLevel > maxDepth) return levelStats;

      const referrals = await UserSchema.find({ referredBy: userId });

      if (!levelStats[currentLevel]) {
        levelStats[currentLevel] = {
          count: 0,
          balancesByCurrency: {},
          stakingsByCurrency: {},
          users: [],
        };
      }

      for (const referral of referrals) {
        levelStats[currentLevel].count++;

        // --- Aggregate balances by currency ---
        const balances = await Balance.find({ user: referral._id });
        const balanceByCurrency = {};
        for (const b of balances) {
          const currency = b.currency.toLowerCase();
          balanceByCurrency[currency] =
            (balanceByCurrency[currency] || 0) + (b.amount || 0);

          // Add to level total
          levelStats[currentLevel].balancesByCurrency[currency] =
            (levelStats[currentLevel].balancesByCurrency[currency] || 0) +
            (b.amount || 0);
        }

        // --- Aggregate staking by currency ---
        const stakings = await Staking.find({ user: referral._id });
        const stakingByCurrency = {};
        for (const s of stakings) {
          const currency = s.currency.toLowerCase();
          stakingByCurrency[currency] =
            (stakingByCurrency[currency] || 0) + (s.amount || 0);

          // Add to level total
          levelStats[currentLevel].stakingsByCurrency[currency] =
            (levelStats[currentLevel].stakingsByCurrency[currency] || 0) +
            (s.amount || 0);
        }

        // Add referral user details
        levelStats[currentLevel].users.push({
          _id: referral._id,
          name: referral.name,
          email: referral.email,
          balance: balanceByCurrency,
          staking: stakingByCurrency,
        });

        // Recurse to next level
        levelStats = await getReferralStats(
          referral._id,
          currentLevel + 1,
          maxDepth,
          levelStats
        );
      }

      return levelStats;
    };

    const referralStats = await getReferralStats(user._id, 1, maxDepth);

    const directReferrals = referralStats[1]?.users || [];

    return Response.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      referralStats,
      directReferrals,
    });
  } catch (error) {
    console.error("[ERROR] Referral Stats:", error);
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
