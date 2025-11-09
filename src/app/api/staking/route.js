import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/app/lib/db";
import Staking from "@/app/models/stacking/stakingSchema";
import Balance from "@/app/models/balanceSchema/balanceSchema";
import User from "@/app/models/userSchema/UserSchema";
import Deposit from "@/app/models/depositSchema/depositSchema";
import { sendStakingEmail } from "@/actions/sendStakingEmail";
import { partnerLevel } from "@/app/dashboard/staticData";



  function exctractCurrentLevel(currentVolume) {
    return partnerLevel.find((level, idx) => {

      if (level.level == 6 && currentVolume >= level.min) {
        return level
      }
      return currentVolume >= level.min && currentVolume <= level.max

    })
  }





export async function GET(req) {
 
  const key = await req.headers.get("x-api-key");
  const isValid = key == process.env.NEXT_PUBLIC_SECRET

  if (!isValid) {
    return Response.json({ success: false, message: "Unauthorized" });
  }
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return Response.json({ success: false, message: "Unauthorized" });

  await dbConnect();

  const stakes = await Staking.find({ user: session.user.id }).sort({
    createdAt: -1,
  });

  if (!stakes) {
    return Response.json({
      success: false,
      message: "No available Investments",
    });
  }

  return Response.json({ succes: true, data: stakes });
}

export async function POST(req) {

  

  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return Response.json({ success: false, message: "Unauthorized" });

  const { duration, amount, profits, rate, currency, price } = await req.json();

  // if (Number(amount) <= 9)
  //   return Response.json({
  //     success: false,
  //     message: "Min Investment is 10 USDT",
  //   });

  
  const user = session.user.id;


  const staker = User.findById(user)
  if (staker.role == "demo" ){
      return Response.json({
      success: false,
      message: "Demo Account Not Allowed",
    });
  }

  const unlocksAt = new Date();
  unlocksAt.setDate(unlocksAt.getDate() + Number(duration));

  await dbConnect();

  // checking balance availability
  const currentBalance = await Balance.findOne({ user, currency: currency });
  if (!currentBalance || currentBalance.amount < amount) {
    return Response.json({
      success: false,
      message: "low Balance Deposit or convert",
    });
  }

  // deduct balance
  const balanceDoc = await Balance.findOneAndUpdate(
    { user, currency: currency },
    { $inc: { amount: -amount } },
    { upsert: true, new: true }
  );

  // creating stake
  const staked = await Staking.create({
    user,
    amount,
    duration,
    profits,
    rate,
    unlocksAt,
    currency,
  });

  // adding stake to user document
  const userUpdated = await User.findByIdAndUpdate(
    user,
    { $addToSet: { staking: staked._id } },
    { new: true, upsert: false }
  );

  if (!staked) {
    return Response.json({
      success: false,
      message: "Could Not Invest please try again",
    });
  }

  const emailSent = await sendStakingEmail(session?.user?.email , staked)

  if (userUpdated?.referredBy) {
const referrer = await User.findByIdAndUpdate(userUpdated.referredBy, {
  $inc: {
    totalVolume: currency == "usdt" || currency == "usdc" ? staked.amount  : price * amount,
    // fullVolume: currency == "usdt" || currency == "usdc" ? staked.amount  : price * amount,
  },
});

    // if (currency == "usdt") {
    //   referrer.totalVolume += staked.amount;
    //   await referrer.save();
    // } else {
    //   referrer.totalVolume += price * amount;
    //   await referrer.save();
    // }
    await createReferralRebates(staked);
  }

  return Response.json({ success: true, data: staked });
}

// Define your level percentages (these must total 1 = 100% of the 10% rebate)

const createReferralRebates = async (staking) => {


  
  const levelsPercentages = {
    1:[2, 0.25, 0.15, 0.05, 0.01],
    2:[3, 0.35, 0.2, 0.1, 0.05],
    3:[5, 0.5, 0.35, 0.15, 0.1],
    4:[7, 0.75, 0.5, 0.2, 0.15],
    5:[9, 1, 0.75, 0.35, 0.2],
    6:[12, 1.5, 1, 0.5, 0.25],
  }
  let REBATE_LEVEL_PERCENTAGES = levelsPercentages[1] 


  console.log("------------------createReferralRebates-----------------------");
  const { user, amount } = staking;
  console.log({ staking });
  await dbConnect();

  const totalRebate = amount * 0.1; // 10% of profits
  let currentUser = await User.findById(user);
  let level = 0;

  while (currentUser?.referredBy && level < REBATE_LEVEL_PERCENTAGES?.length) {
    const referrer = await User.findById(currentUser.referredBy);

    if (!referrer) break;

    if (level ==0) {  
      REBATE_LEVEL_PERCENTAGES = exctractCurrentLevel(referrer?.totalVolume)
    }

    // restricted users will not recieve the bonus
      if (!referrer?.isRestricted){
        console.log({ currentLevelUser: referrer });
        const percentage = REBATE_LEVEL_PERCENTAGES[level];
        const levelRebate = (amount * percentage) / 100;
    
        const deposited = await Deposit.create({
          user: referrer._id,
          amount: levelRebate,
          currency: staking.currency,
          depositType: "referral bonus",
          status: "credited",
          forwarded: true,
          timestamp:  new Date().toISOString() ,
          signature: level == 0 ? "Direct Referral" : `Indirect Level ${level} `,
        });
    
        if (!deposited) {
          console.error("Failed to upsert deposit.");
          break;
        }
    
        const bonusBalance = await Balance.findOneAndUpdate(
          { user: referrer._id, currency: staking.currency },
          { $inc: { amount: levelRebate } },
          { upsert: true, new: true }
        );
    
        const updatedUser = await User.findByIdAndUpdate(
          referrer._id,
          {
            $addToSet: { deposits: deposited._id },
          },
          { new: true }
        );
    
        const updateBalance = await User.findByIdAndUpdate(
          referrer._id,
          {
            $addToSet: { balances: bonusBalance._id },
          },
          { new: true }
        );

      }


    currentUser = referrer;
    level++;
  }
  console.log("---------------- rebates distributed -------------");
};
