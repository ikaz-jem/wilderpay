import User from "../models/userSchema/UserSchema";
import Staking from "../models/stacking/stakingSchema";
import Deposit from "../models/depositSchema/depositSchema";
import { depositRebateRewards } from "@/actions/deposits/depositRebateRewards";

const MAX_LEVELS = 10; // Max referral levels

// Define the percentage distribution for each level
const REBATE_PERCENTAGES = [0.03, 0.02, 0.015, 0.012, 0.009, 0.008, 0.007, 0.006, 0.006, 0.005]; // Example percentages for each level (3%, 2%, 1.5%, etc.)

export const distributeDailyRebates = async () => {
  const today = new Date();

  // Fetch all active staking records that are still locked and unclaimed
  const activeStakings = await Staking.find({
    unlocksAt: { $gt: today },
    claimed: false,  // Only consider unclaimed stakings
  }).populate('user');  // Populate user to get referrer's information

  for (const staking of activeStakings) {
    const { user, amount, profits, duration, rate, unlocksAt,currency } = staking;

    // Step 1: Calculate 10% of the total profits for rebate distribution
    const totalRebateAmount = profits * 0.1;  // 10% of the staking profits

    // Step 2: Distribute the rebate directly across levels
    let currentUser = user;
    let level = 0;

    while (currentUser && level < MAX_LEVELS) {
      // Get the referrer for this level
      const referrer = await User.findById(currentUser.referredBy);
      if (!referrer) break;  // If no referrer, stop the loop

      // Step 3: Calculate the rebate for this level
      const rebatePercentage = REBATE_PERCENTAGES[level] || 0;  // Default to 0% if level exceeds array length
      const rebateForThisLevel = totalRebateAmount * rebatePercentage;  // Rebate for this level

      // Step 4: Calculate the daily rebate for this level
      const dailyRebateForLevel = rebateForThisLevel / duration;  // Daily reward for this level

      // Add the daily rebate to the referrer's balance
 

    const data = await depositRebateRewards({user:referrer._id,depositType:"rebate",currency:currency,amount:dailyRebateForLevel})

      // Move to the next referrer (next level)
      currentUser = referrer;
      level++;
    }
  }
};
