import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserSchema from "@/app/models/userSchema/UserSchema";
import { getServerSession } from "next-auth";

import { IoArrowForward } from "react-icons/io5";
import { appBaseRoutes } from "@/routes"
import Link from "next/link"
import { formatPrice } from "@/app/utils/formatPrice"
import { BsFillPeopleFill } from "react-icons/bs";
import { FaChartArea } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import BorderEffect from "../components/BorderEffect/BorderEffect";
import ReferralNav from "./ReferralNav";

import { unstable_cache } from "next/cache";
import { headers } from 'next/headers';
import dbConnect from "@/app/lib/db";

// app/referrals/page.tsx (or layout.tsx if it applies to all subpages)

export const metadata = {
  title: "Referrals",
  description: "Build a better financial future",
  openGraph: {
    title: "Referrals",
    description: "Build a better financial future",
    images: [
      {
        url: "https://yourdomain.com/images/referral-banner.png", // must be absolute URL
        width: 1200,
        height: 630,
        alt: "Referral Program Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Referrals",
    description: "Build a better financial future",
    images: ["https://yourdomain.com/images/referral-banner.png"],
  },
};

async function getUserData() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false }
  }

  const connection = await dbConnect()

  const userData = await UserSchema.findById(session.user.id).lean()
  if (!userData) {
    return
  }
  return userData
}





export default async function TransferLayout({ children }) {


  const userData = await getUserData()



  const totalTransactions = userData?.deposits?.length || 0

  const cardData = [
    {
      title: 'Total Referrals',
      value: userData?.referredUsers?.length,
      icon: <BsFillPeopleFill className="text-neutral text-3xl" />,
      desc: 'Total Direct Referrals ',
      cta: null
    },
    {
      title: 'Total Volume',
      value: formatPrice.format(userData?.totalVolume || 0),
      icon: <FaChartArea className="text-neutral text-3xl" />,
      desc: 'Total Volume By Referrals All Levels ',
      cta: null
    },
    {
      title: 'Total Transactions',
      value: totalTransactions,
      icon: <GrTransaction className="text-neutral text-3xl" />,
      desc: 'Total Credited Transactions',
      cta: null
    },
  ]

const linkClass = "text-xs flex gap-1 items-center !text-primary cursor-pointer hover:!text-accent transition-all"


  return (
    <>
      <div className="grid w-full space-y-5 ">

        <div className='grid grid-cols-1 md:grid-cols-3 gap-5    w-full '>
          {
            cardData.map((card, idx) => <StatsCard key={idx} data={card} loadingData={userData ? false : true} />)
          }
        </div>
        <div className='flex gap-3 items-center    w-full '>

          <ReferralNav/>
  

        </div>


        {children}
      </div>
    </>
  )


}



function StatsCard({ data, loadingData }) {


  return (
    <div className='flex flex-col  w-full gap-5 border border-primary/10 p-5 bg-card rounded backdrop-blur-xl relative overflow-hidden '>
      <BorderEffect />
      {
        !loadingData ?
          <>
            <div className='flex  gap-5 items-center '>

              <div className='w-full flex justify-between'>
                <div className='flex flex-col gap-5 '>
                  <h1 className="uppercase text-sm">{data.title}</h1>
                  <p className='text-3xl tracking-wider font-light !text-primary'>{data.value}</p>
                  {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}
                </div>
                {data?.icon}
              </div>
            </div>

            <div className="flex justify-between ">
              <p className='text-xs'>{data.desc} </p>
              {
                data?.cta && <Link href={appBaseRoutes.contracts} className="text-xs flex gap-1 items-center !text-primary cursor-pointer hover:!text-accent transition-all">{data.cta}  <IoArrowForward />  </Link>

              }
            </div>
          </>
          :
          <div className="w-full h-20 flex items-center justify-center">

            <ClipLoader className='text-xs' color='var(--title)' size={25} />
          </div>
      }
    </div>
  )
}
