
import { getServerSession } from 'next-auth';
import dbConnect from '../lib/db';
import HeaderMobile from './components/HeaderMobile/HeaderMobile';
import { authOptions } from '../api/auth/[...nextauth]/route';
import User from '../models/userSchema/UserSchema';
import axios from 'axios';
import AssetsBalance from './components/AssetsBalance/AssetsBalance';


import { Suspense } from 'react';
import AssetDistributionChart from './components/charts/AssetsDistribution';
import DashboardInvestments from './components/DashboardInvestments/DashboardInvestments';
import { symbols } from './staticData';

import Loading from '../components/Loading';
import { partnerLevel } from './staticData';
import BorderEffect from './components/BorderEffect/BorderEffect';
import { formatCustomPrice } from '../utils/formatPrice';
import { IoArrowForward } from "react-icons/io5";
import { appBaseRoutes } from '@/routes';
import ActivateAccount from './components/ActivateAccount/ActivateAccount';
import DashboardStatsCard from './components/DashboardStatsCard/DashboardStatsCard';
import DashboardPackageCard from './components/DashboardPackageCard/DashboardPackageCard';
import EarningsOverTimeChart from './components/charts/EarningsOverTimeChart';
import { MdEmail } from "react-icons/md";



const tickers = [symbols.sol, symbols.btc, symbols.eth, symbols.bnb, symbols.matic, symbols.xrp, symbols.avax]

export async function getPrices(tickers) {
  let symbols = JSON.stringify(tickers);
  let endpoint = `https://api.binance.com/api/v3/ticker/price?symbols=${symbols}`;
  let prices = await axios.get(endpoint).then((res) => res.data);
  return prices;
}



async function getUserData() {
  "use server"


  const session = await getServerSession(authOptions)

  console.log({ session })

  if (!session?.user?.id) return null;

  await dbConnect()

  const userDoc = await User.findById({ _id: session.user.id })
    .populate('deposits') // or pass second arg to populate specific fields
    .populate({
      path: 'balances',
    })
    .populate('referredUsers')
    .populate(({
      path: 'staking',
      options: { sort: { createdAt: -1 }, limit: 5 }  // Sort staking documents by unlocksAt descending
    }))


  const EarningSchema = (await import('@/app/models/EarningSchema/EarningSchema')).default


  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  // Get the one record created today
  const today = await EarningSchema.findOne({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  const startOfYesterday = new Date();
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  startOfYesterday.setHours(0, 0, 0, 0);

  // Yesterday's end
  const endOfYesterday = new Date();
  endOfYesterday.setDate(endOfYesterday.getDate() - 1);
  endOfYesterday.setHours(23, 59, 59, 999);

  // Find the one record created yesterday
  const yesterday = await EarningSchema.findOne({
    createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
  });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);  // Get the date for 7 days ago

  const allTime = await EarningSchema.find({
    createdAt: { $gte: sevenDaysAgo },  // Find documents created in the last 7 days
  });


  const userData = await JSON.parse(JSON.stringify(userDoc))

  const prices = await getPrices(tickers)

  let totalValue = 0 + userData?.balance
  userData.balances = await Promise.all(
    userData?.balances?.map(async (balance) => {
      if (balance?.currency == "yieldium") {
        totalValue += (balance.amount * 0.01)
        return {
          ...balance.toObject?.() ?? balance, // if it's a Mongoose doc
          convertedAmount: balance.amount * 0.01,
        };
      }


      if (balance?.currency !== "usdt" && balance?.currency !== "yieldium" && balance?.currency !== "usdc") {

        try {
          // const price = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbols[balance?.currency]}`).then((res) => Number(res.data?.price))
          const price = Number(prices?.filter((coin) => coin.symbol == symbols[balance?.currency])?.[0]?.price)
          totalValue += (balance.amount * price)
          return {
            ...balance.toObject?.() ?? balance, // if it's a Mongoose do
            convertedAmount: balance.amount * price,
          };

        } catch (err) {
          console.log(err)
          return {
            ...balance.toObject?.() ?? balance, // if it's a Mongoose doc
            convertedAmount: 0,
          };
        }
      }
      if (balance?.currency == "usdt" || balance?.currency == "usdc") {
        totalValue += balance.amount
        return {
          ...balance.toObject?.() ?? balance, // if it's a Mongoose doc
          convertedAmount: balance.amount,
        };
      }
    })
  );


  const percentages = {
    yesterday: await JSON.parse(JSON.stringify(yesterday)),
    today: await JSON.parse(JSON.stringify(today)),
  }

  userData.balances.sort((a, b) => b.convertedAmount - a.convertedAmount);
  userData.totalValue = totalValue
  userData.percentage = percentages
  userData.allTimeStats = await JSON.parse(JSON.stringify(allTime))
  return userData
}



export default async function MobileDashboard() {

  const data = await getUserData()


  return (
    <div className='w-full  space-y-0   '  >

      {/* <HeaderMobile userData={data || {}} /> */}
      <div className='flex flex-col w-full gap-5'>


        <div className='w-full z-0  flex flex-col gap-5 md:flex-row'>

          <div className='flex flex-col  gap-3 w-full'>
            <HeaderMobile userData={data || {}} />


            <Suspense fallback={<Loading />} >
              {
                <AssetDistributionChart user={data} />
              }
            </Suspense>

            
            <Suspense fallback={<Loading />} >
              <DashboardPackageCard userData={data} />
            </Suspense>


          </div>

          <div className='flex flex-col gap-2 w-full'>
            {
              !data?.emailVerified &&
              <VerifyEmail userData={data} />
            }
            {
              !data?.verified &&
              <ActivateAccount userData={data} />
            }

            <Suspense fallback={<Loading />} >
              <DashboardStatsCard userData={data} />
            </Suspense>




            <PartnerLevel userData={data} />

            <Suspense fallback={<Loading />} >
              <EarningsOverTimeChart earningsData={data?.allTimeStats} />
            </Suspense>
          </div>

        </div>
        <div className='w-full z-0  flex flex-col gap-5 md:flex-row'>
          <Suspense fallback={<Loading />} >
            <AssetsBalance data={data} />
          </Suspense>
          <Suspense fallback={<Loading />} >
            <DashboardInvestments data={data} />
          </Suspense>

        </div>
      </div>
    </div>
  )
}




function PartnerLevel({ userData }) {

  function exctractCurrentLevel(currentVolume) {
    return partnerLevel.find((level, idx) => {

      if (level.level == 5 && currentVolume >= level.min) {
        return level
      }
      return currentVolume >= level.min && currentVolume <= level.max

    })
  }

  function getProgress(userValue, level = { min: 0, max: 0 }) {
    const { min, max } = level;
    if (userValue >= max) {
      return 100
    }
    return ((userValue - min) / (max - min)) * 100;
  }


  const testLevelFunds = userData?.totalVolume
  const currentLevel = exctractCurrentLevel(testLevelFunds)
  const currentProgress = getProgress(testLevelFunds, currentLevel)



  return (

    <div className='flex flex-col gap-2 w-full'>

      <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded relative border border-accent/10">
        <BorderEffect />

        <div className="flex justify-between">

          <div className="flex flex-col justify-center gap-1">
            <h1 className="text-lg tracking-wider uppercase">Partner Level</h1>
            <p className=" text-xs !text-neutral">Get Amazing Rewards Each Level !</p>
          </div>
          <img src={currentLevel?.badge} className={`w-10 h-10 }`} alt="" />

        </div>


        <div className="space-y-3">
          <p className="uppercase"> Level Progress : {formatCustomPrice(currentProgress, 2)} % </p>
          <div>
            <div className="w-full bg-highlight/20 rounded-full overflow-hidden">
              <p className="bg-highlight/80  p-2  rounded-full animate-pulse" style={{ width: `${currentProgress}%` }} ></p>
            </div>

          </div>
        </div>
        <a href={appBaseRoutes.referrals} className="text-xs flex gap-1 items-center !text-primary cursor-pointer hover:!text-accent transition-all">View More  <IoArrowForward />  </a>
      </div>

    </div>
  )
}



function VerifyEmail({ userData }) {



  return (

    <div className='flex flex-col gap-2 w-full relative'>

      <div className="p-5 mx-auto space-y-3 w-full backdrop-blur-xl bg-accent/10 rounded relative border border-accent/20 h-full">

        <div className="flex justify-between">

          <div className="flex flex-col justify-center gap-1 w-full">
            <div className='flex justify-between items-center w-full'>
              <h1 className="text-lg tracking-wider uppercase !text-accent">Verify Your Account !</h1>
              <MdEmail className='text-accent text-xl' />
            </div>
            <p className=" text-xs !text-neutral">Unock All Features and Access , Lift All Limits With Email Verification</p>
          </div>

        </div>


        <div className="space-y-3">

        </div>
        <a href={appBaseRoutes.verification} className="text-xs flex gap-1 items-center !text-primary cursor-pointer hover:!text-accent transition-all">Verify Now  <IoArrowForward />  </a>
      </div>

    </div>
  )
}


