import dbConnect from "@/app/lib/db";

import User from "@/app/models/userSchema/UserSchema";
import Deposit from "@/app/models/depositSchema/depositSchema";
import Staking from "@/app/models/stacking/stakingSchema";
import Balance from '@/app/models/balanceSchema/balanceSchema';
import EarningSchema from "@/app/models/EarningSchema/EarningSchema";
import { headers } from "next/headers";

export async function depositRebateRewards(deposit) {

  const { user, currency, amount,depositType ,timestamp } = deposit;




  try {

    await dbConnect();
    const normalizedCurrency = currency;
    const deposited = await Deposit.create(deposit);

    if (!deposited) {
      console.error('Failed to upsert deposit.');
      return { status: 'error', error: 'Deposit upsert failed.' };
    }

    const updatedUser = await User.findByIdAndUpdate(user, {
      $addToSet: { deposits: deposited._id },
    }, { new: true }
    );

    if (deposited.status === 'credited') {
      const balanceDoc = await Balance.findOneAndUpdate(
        { user, currency: normalizedCurrency },
        { $inc: { amount } },
        { upsert: true, new: true }
      );

      if (!balanceDoc) {
        console.error('Failed to upsert balance.');
        return { status: 'error', error: 'Balance upsert failed.' };
      }

      await User.findByIdAndUpdate(user, {
        $addToSet: { balances: balanceDoc._id }
      });
    }
    
    return { status: true, depositId: deposited._id.toString() };
  } catch (error) {
    console.error('❌ Failed to record deposit:', error);
    return { status: 'error', error };
  }
}



const MAX_LEVELS = 10; // Max referral levels

// Define the percentage distribution for each level
const REBATE_PERCENTAGES = [
  0.03,   // Level 1: 3.00%
  0.02,   // Level 2: 2.00%
  0.015,  // Level 3: 1.50%
  0.01,   // Level 4: 1.00%
  0.008,  // Level 5: 0.80%
  0.006,  // Level 6: 0.60%
  0.004,  // Level 7: 0.40%
  0.003,  // Level 8: 0.30%
  0.002,  // Level 9: 0.20%
  0.002,  // Level 10: 0.20%
];


export async function POST (req) {


   const VALID_API_KEY = process.env.CRON_API_KEY;
  const apiKey = (await headers()).get('x-api-key'); // Read API key from header

  if (apiKey !== VALID_API_KEY) {
    return Response.json({ success: false, message: "Unauthorized" });
  }


  
    const distributed = await distributeCompound()

    console.log(distributed)

  return Response.json('success')

}




  async function distributeCompound ()  {

    
    const today = new Date();

    await dbConnect()
  // Fetch all active staking records that are still locked and unclaimed
  const activeStakings = await Staking.find({
    unlocksAt: { $gt: today },
    claimed: false,  // Only consider unclaimed stakings
  }).populate('user');  // Populate user to get referrer's information


 const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  // Get the one record created today
  const todaysPercent = await EarningSchema.findOne({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });



const todayPercent = todaysPercent?.percentage

  for (const staking of activeStakings) {
    const { user, amount, profits, duration, rate, unlocksAt,currency } = staking;

    const totalDynamicProfits = ((amount * todayPercent )/100)
    // Step 1: Calculate 10% of the total profits for rebate distribution
    const totalRebateAmount = totalDynamicProfits * 0.1;  // 10% of the staking profits

    // Step 2: Distribute the rebate directly across levels
    let currentUser = user;
    let level = 0;

    while (currentUser && level < MAX_LEVELS) {
      // Get the referrer for this level
      
      const referrer = await User.findById(currentUser.referredBy);
      if (!referrer) break;  // If no referrer, stop the loop

      if (!referrer?.isRestricted){
        const rebatePercentage = REBATE_PERCENTAGES[level] || 0;  // Default to 0% if level exceeds array length
        const rebateForThisLevel = totalRebateAmount * rebatePercentage;  // Rebate for this level
  
        // Step 4: Calculate the daily rebate for this level
        const dailyRebateForLevel = rebateForThisLevel / duration;  // Daily reward for this level
  
        // Add the daily rebate to the referrer's balance
      const data = await depositRebateRewards({user:referrer._id,depositType:"rebate",  timestamp:  new Date().toISOString() ,   currency:currency,amount:dailyRebateForLevel,signature: level == 0 ? "Direct Rebate" : `Level ${level+1} Rebate`, status:"credited"} )

      }
      // Step 3: Calculate the rebate for this level

      // Move to the next referrer (next level)
      currentUser = referrer;
      level++;
    }
  }
};
