import User from "../models/userSchema/UserSchema";
import Staking from "../models/stacking/stakingSchema";
import Deposit from "../models/depositSchema/depositSchema";

import RebateDistribution from "@/models/RebateDistribution";

// Define your level percentages (these must total 1 = 100% of the 10% rebate)
const REBATE_LEVEL_PERCENTAGES = [0.1, 0.05, 0.03, 0.02, 0.01]; // 10%, 5%, etc.

export const createReferralRebates = async (staking) => {
  const { user, profits, duration, _id: stakingId } = staking;

  const totalRebate = profits * 0.1; // 10% of profits
  let currentUser = await User.findById(user);
  let level = 0;

  while (currentUser?.referredBy && level < REBATE_LEVEL_PERCENTAGES.length) {
    const referrer = await User.findById(currentUser.referredBy);
    if (!referrer) break;

    const percentage = REBATE_LEVEL_PERCENTAGES[level];
    const levelRebate = totalRebate * percentage;
    const dailyRebate = levelRebate / duration;

    await RebateDistribution.create({
      staking: stakingId,
      referrer: referrer._id,
      level: level + 1,
      totalRebate: levelRebate,
      dailyRebate,
      duration,
    });

    currentUser = referrer;
    level++;
  }
};
