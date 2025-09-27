import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import BorderEffect from '../../components/BorderEffect/BorderEffect'
import { getServerSession } from 'next-auth';
import dbConnect from '@/app/lib/db';
import Balance from '@/app/models/balanceSchema/balanceSchema';
import Staking from '@/app/models/stacking/stakingSchema';
import UserSchema from '@/app/models/userSchema/UserSchema';
import { IoPersonAdd } from 'react-icons/io5';
import { FaLevelDownAlt } from "react-icons/fa";
import IndirectReferrals from './IndirectReferrals';


export async function getData() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Not Authorized",
      status: 400,
      };
  }

  await dbConnect();

  const userId = session.user.id;
  const maxDepth = 5;

  if (!userId) {
    return {
      success: false,
      message: "Missing user ID",
      status: 400,
    };
  }

  try {
    const user = await UserSchema.findById(userId);

    if (!user) {
      return {
        success: false,
        message: "User not found",
        status: 404,
      };
    }

    // Recursive referral stat function with per-currency grouping
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

        // Aggregate balances by currency
        const balances = await Balance.find({ user: referral._id });
        const balanceByCurrency = {};
        for (const b of balances) {
          const currency = b.currency.toLowerCase();
          balanceByCurrency[currency] =
            (balanceByCurrency[currency] || 0) + (b.amount || 0);

          levelStats[currentLevel].balancesByCurrency[currency] =
            (levelStats[currentLevel].balancesByCurrency[currency] || 0) +
            (b.amount || 0);
        }

        // Aggregate staking by currency
        const stakings = await Staking.find({ user: referral._id });
        const stakingByCurrency = {};
        for (const s of stakings) {
          const currency = s.currency.toLowerCase();
          stakingByCurrency[currency] =
            (stakingByCurrency[currency] || 0) + (s.amount || 0);

          levelStats[currentLevel].stakingsByCurrency[currency] =
            (levelStats[currentLevel].stakingsByCurrency[currency] || 0) +
            (s.amount || 0);
        }

        // Add referral user
        levelStats[currentLevel].users.push({
          _id: referral._id,
          name: referral.name,
          email: `${referral.email.slice(0, 3)}...@${referral.email.split('@')?.[1]}`,
          totalVolume: referral.totalVolume,
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

    return {
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      referralStats,
      directReferrals,
    };
  } catch (error) {
    console.error("[ERROR] Referral Stats:", error);
    return {
      success: false,
      message: "Something went wrong",
      status: 500,
    };
  }
}


export default async function page() {
  const data = await getData()
  const directReferralsCount = data?.directReferrals?.length
  
  return (
    <>

      <div className="flex flex-col md:flex-row gap-5  ">

        <DirectReferrals userData={data?.directReferrals} />
        <IndirectReferrals userData={data?.referralStats} />
        {/* <PartnerLevel /> */}
      </div>
    </>
  )
}


async function PartnerLevel({ userData }) {

  return (

    <>
      <div className="flex gap-3  flex-wrap">
        {/* {
          partnerLevel.map((level, idx) => <div key={idx} className="flex flex-col items-center justify-center gap-2">
            <img src={level.badge} className={`w-18 h-18  ${currentLevel?.level - 1 == idx ? "animate-pulse" : "grayscale scale-80"}`} alt="" />
            <p className={`text-xs capitalize ${currentLevel?.level - 1 == idx && "!text-primary font-sembold !text-md"}`}>{level.name} </p>

          </div>
          )
        } */}
      </div>
      <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded relative border border-primary/10">
        <BorderEffect />

        <div className="flex justify-between">

          <div className="flex flex-col justify-center gap-1">
            <h1 className="text-lg tracking-wider uppercase">Partner Level</h1>
            <p className=" text-xs !text-neutral">Get Amazing Rewards Each Level !</p>
          </div>
          {/* <img src={currentLevel?.badge} className={`w-10 h-10 }`} alt="" /> */}

        </div>


        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="uppercase"> Level Progress : 45 % </p>
            <p className="  text-xs">Next Level : 65 $  </p>
          </div>
          <div>
            <div className="w-full bg-primary/20 rounded-full overflow-hidden relative">
              <p className="bg-primary/80  p-2  rounded-full animate-pulse" style={{ width: `${15}%` }} >  </p>

            </div>

          </div>
        </div>
        <p className=" text-xs !text-neutral">Need Help ? checkout our  <span className="!text-primary">Tiers and Levels Section</span> </p>
      </div>

    </>
  )
}



function DirectReferrals({ userData }) {

  

  return (
    <>

      <div className="p-5 mx-auto  space-y-5 w-full backdrop-blur-xl bg-card rounded-xl overflow-hidden border border-primary/10 relative">
        <BorderEffect />

        <div className="flex flex-col justify-center gap-1">
          <h1 className="text-lg tracking-wider uppercase">Direct Referrals : {userData.length} </h1>
          <p className=" text-xs !text-neutral">Rebates Are credited Automatically Daily to Wilderpay Wallet</p>
        </div>

        {userData.length > 0 ? (
          <div className="space-y-3 h-80 overflow-y-scroll ">
            <div className="text-sm space-y-1">
              {userData?.map((user, i) => (
                <div key={i} className="bg-white/5 rounded py-3 flex justify-between items-center px-5 ">
                  <div className="flex items-center gap-2 ">
                    <IoPersonAdd className='text-neutral' />
                    <div className="flex flex-col md:flex-row gap-1  ">

                      <p className={`!text-xs truncate capitalize '`}>{user?.email || ''}</p>
                      {/* <p className={`!text-xs truncate capitalize !text-orange-500/50 '`}>{formatISO(user?.createdAt) || ''}</p> */}
                    </div>

                  </div>

                  <div className="flex items-center gap-2">

                    {/* <p className={`!text-sm truncate !text-green-500 uppercase '`}> + {formatCustomPrice(user.amount, 8)} {user?.currency}</p> */}
                    {/* <img src={coinIcon[user?.currency]} alt="" className="h-5 w-5 opacity-50" /> */}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )
          :

          (<div className="space-y-3">
            <div>
              <ul className="text-sm space-y-1">

                <li className="bg-white/5 rounded p-5 w-full space-y-2">
                  <div className="flex items-center gap-2 ">
                    <p className={`truncate '`}>Nothing Yet !</p>
                  </div>
                </li>

              </ul>
            </div>
          </div>)

        }
      </div>

    </>
  )

}


