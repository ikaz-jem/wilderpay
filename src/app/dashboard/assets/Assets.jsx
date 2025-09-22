
import { getServerSession } from 'next-auth';
import dbConnect from '@/app/lib/db';
import HeaderMobile from '../components/HeaderMobile/HeaderMobile';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '../../models/userSchema/UserSchema';
import axios from 'axios';
import AssetsBalance from '../components/AssetsBalance/AssetsBalance';


import { Suspense } from 'react';
import AssetDistributionChart from '../components/charts/AssetsDistribution';
import { coinIcon, symbols } from '../staticData';

import Loading from '../loading';

import { IoArrowForward } from "react-icons/io5";
import { appBaseRoutes } from '@/routes';
import { MdEmail } from "react-icons/md";
import { formatCustomPrice } from '@/app/utils/formatPrice';

const tickers = [symbols.sol, symbols.btc, symbols.eth, symbols.bnb, symbols.matic, symbols.xrp, symbols.avax]

export async function getPrices(tickers) {
  let symbols = JSON.stringify(tickers);
  let endpoint = `https://api.binance.com/api/v3/ticker/price?symbols=${symbols}`;
  let prices = await axios.get(endpoint).then((res) => res.data);
  return prices;
}


const token = "yieldium"


async function getUserData() {

  "use server"


  const session = await getServerSession(authOptions)

  console.log({ session })

  if (!session?.user?.id) return null;

  await dbConnect()

  const userDoc = await User.findById({ _id: session.user.id })
    .populate({
      path: "deposits",
      options: { sort: { createdAt: -1 }, limit: 6 }
    }) // or pass second arg to populate specific fields
    .populate({
      path: "withdrawls",
      options: { sort: { createdAt: -1 }, limit: 6 }
    }) // or pass second arg to populate specific fields
    .populate({
      path: 'balances',
    })



  const userData = await JSON.parse(JSON.stringify(userDoc))

  const prices = await getPrices(tickers)

  let totalValue = 0 + userData?.balance
  userData.balances = await Promise.all(
    userData?.balances?.map(async (balance) => {
      if (balance?.currency == token) {
        totalValue += (balance?.amount * 0.01)
        return {
          ...balance?.toObject?.() ?? balance, // if it's a Mongoose doc
          convertedAmount: balance?.amount * 0.01,
        };
      }


      if (balance?.currency !== "usdt" && balance?.currency !== token && balance?.currency !== "usdc") {

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



  userData.balances.sort((a, b) => b.convertedAmount - a.convertedAmount);
  userData.totalValue = totalValue
  return userData
}



export default async function Assets() {

  const data = await getUserData()


  return (
    <div className='w-full  space-y-0   '  >

      {/* <HeaderMobile userData={data || {}} /> */}
      <div className='flex flex-col w-full gap-5'>

        <HeaderMobile userData={data || {}} />

        <div className='w-full z-0  flex flex-col gap-5 md:flex-row'>

          <div className='flex flex-col  gap-3 w-full'>


            <Suspense fallback={<Loading />} >
              {
                <AssetDistributionChart user={data} />
              }
            </Suspense>
            <Suspense fallback={<Loading />} >
              <AssetsBalance data={data} />
            </Suspense>







          </div>

          <div className='flex flex-col gap-2 w-full'>
            {
              !data?.emailVerified &&
              <VerifyEmail userData={data} />
            }
            {/* {
              !data?.verified &&
              <ActivateAccount userData={data} />
            } */}

            <LastTransactions data={data} />
            <LastWithdrawals data={data} />




          </div>

        </div>
        <div className='w-full z-0  flex flex-col gap-5 md:flex-row'>
          {/* <Suspense fallback={<Loading />} >
            <AssetsBalance data={data} />
          </Suspense>
         */}

        </div>
      </div>
    </div>
  )
}






function VerifyEmail({ userData }) {



  return (

    <div className='flex flex-col gap-2 w-full relative'>

      <div className="p-5 mx-auto space-y-3 w-full backdrop-blur-xl bg-accent/10 rounded-xl relative border border-accent/20 h-full">

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





function LastTransactions({ data }) {


  return (
    <div className='flex flex-col gap-2 w-full  '>

      <div className="flex items-center justify-between">

        <h1 className="!text-neutral text-sm" >Last Transactions</h1>
        <a href={appBaseRoutes.transactions} className="text-xs flex items-center gap-2 !text-primary cursor-pointer hover:!text-accent transition-all">View All   <IoArrowForward /></a>
      </div>
      {
        data?.deposits?.length > 0
        ?
        data?.deposits?.map((balance, idx) => <div key={idx} className='flex px-5 py-3  gap-3 items-center border border-accent/10 bg-card rounded-xl relative overflow-hidden backdrop-blur-xl'>

          {/* <BorderEffect/> */}

          <img src={coinIcon[balance?.currency]} alt="" className='w-8 h-8' />
          <div className='w-full flex justify-between items-center'>

            <div className='flex flex-col '>
              <h1>{balance?.currency.toUpperCase()}</h1>
              <p className='text-xs'> {balance?.depositType}</p>
              {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}

            </div>
            <div className='flex flex-col items-end '>
              <p className='text-sm !text-primary'>{balance?.signature}</p>
              <p className='text-sm !text-accent/80'>{formatCustomPrice(balance?.amount, 8)} {balance?.currency.toUpperCase()}</p>
              {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}

            </div>
          </div>
        </div>
        )
        :

         <div  className='flex px-5 py-3  gap-3 items-center border border-accent/10 bg-card rounded-xl relative overflow-hidden backdrop-blur-xl'>
          <div className='w-full flex justify-between items-center'>
            <p>No Transactions Yet</p>
          </div>
        </div>
      }
    </div>)
}

function LastWithdrawals({ data }) {

  console.log(data)

  return (
    <div className='flex flex-col gap-2 w-full  '>

      <div className="flex items-center justify-between">

        <h1 className="!text-neutral text-sm" >Last Withdrawals</h1>
        <a href={appBaseRoutes.transactions} className="text-xs flex items-center gap-2 !text-primary cursor-pointer hover:!text-accent transition-all">View All   <IoArrowForward /></a>
      </div>
      {
   data?.withdrawls?.length >0 ?    
    data?.withdrawls?.map((balance, idx) => <div key={idx} className='flex px-5 py-3  gap-3 items-center border border-accent/10 bg-card rounded-xl relative overflow-hidden backdrop-blur-xl'>

          {/* <BorderEffect/> */}

          <img src={coinIcon[balance?.currency]} alt="" className='w-8 h-8' />
          <div className='w-full flex justify-between items-center'>

            <div className='flex flex-col '>
              <h1>{balance?.currency.toUpperCase()}</h1>
              <p className='text-xs'> {balance?.depositType}</p>
              {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}

            </div>
            <div className='flex flex-col items-end '>
              <p className='text-sm !text-primary'>{balance?.signature}</p>
              <p className='text-sm !text-accent/80'>{formatCustomPrice(balance?.amount, 8)} {balance?.currency.toUpperCase()}</p>
              {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}

            </div>
          </div>
        </div>
        )

        :


        <div  className='flex px-5 py-3  gap-3 items-center border border-accent/10 bg-card rounded-xl relative overflow-hidden backdrop-blur-xl'>
          <div className='w-full flex justify-between items-center'>
            <p>No withdrawals Yet</p>
          </div>
        </div>

      }
    </div>)
}
