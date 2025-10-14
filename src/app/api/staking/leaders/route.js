import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/app/lib/db";
import Staking from "@/app/models/stacking/stakingSchema";
import User from "@/app/models/userSchema/UserSchema";
import { sendStakingEmail } from "@/actions/sendStakingEmail";


export async function POST(req) {
  const session = await getServerSession(authOptions);
  const user = session?.user?.id;
  if (!session?.user?.id)
    return Response.json({ success: false, message: "Unauthorized" });



  const staker = User.findById(user)
  if (staker.role == "demo"){
      return Response.json({
      success: false,
      message: "Demo Account Not Allowed",
    });
  }


  // if (Number(amount) <= 9)
  //   return Response.json({
  //     success: false,
  //     message: "Min Investment is 10 USDT",
  //   });
  const allowedRoles = ["leader","admin","user"]
  
  await dbConnect();
    let leader = await User.findById(user);
    let amount = leader?.balance;

if (!allowedRoles.includes(leader.role)) return Response.json({
      success: false,
      message: "Not Allowed",
    });

    if (amount == 0) {
      return Response.json({
        success: false,
        message: "low Balance ",
      });
    }

    let duration = 365
    let rate = 0.5
    let currency = 'usdt'
    let profits = ((rate  * amount)/100)* duration 

  const unlocksAt = new Date();
  unlocksAt.setDate(unlocksAt.getDate() + Number(duration));


  // checking balance availability

  leader.balance = 0;
  await leader.save();
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

//   const emailSent= await sendStakingEmail(session?.user?.email , staked)

  return Response.json({ success: true, data: staked });
}

// Define your level percentages (these must total 1 = 100% of the 10% rebate)
