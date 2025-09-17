"use client"
// import TodayYesterdayMeter from "../charts/TodayYesterdayMeter"
import BorderEffect from "../BorderEffect/BorderEffect"
import { formatCustomPrice } from "@/app/utils/formatPrice"
import { coinIcon } from "../../staticData"
import Loading from "../../loading"
import ButtonPrimary from "@/app/components/ButtonPrimary"
import { appBaseRoutes } from "@/routes"
import { useRouter } from "next/navigation"


export default function DashboardPackageCard({ userData }) {
  const router = useRouter()

  async function getMetter() {



    let TodayYesterdayMeter = (await import('../charts/TodayYesterdayMeter')).default
    return <TodayYesterdayMeter today={userData?.percentage?.today?.percentage} yesterday={userData?.percentage?.yesterday?.percentage} />

  }

  return (
    <div className='flex flex-col  w-full gap-3 border border-accent/30 p-5 bg-gradient-to-tl from-primary/30 to-accent/30 rounded-xl backdrop-blur-xl relative overflow-hidden '>
      <BorderEffect />

      {

        <>
          <div className='flex  gap-5 items-center '>

            <div className='w-full flex justify-between'>
              <div className='flex flex-col gap-5 w-full '>
                <div className='flex justify-between w-full items-center'>

                  <div className='flex flex-col gap-5 '>
                    <div className="flex items-center gap-2">

                    <img src="/assets/images/gift.webp" alt="" className="w-26 h-26" />
                    <p className="text-5xl font-bold !text-yellow-500 align-middle ">
                      +{userData?.balance}  <span className="text-xl  ">USDT</span>
                    </p>
                    </div>
                    <h1 className="uppercase text-sm !text-accent">You have A free Bonus Package Of  {userData.balance} USDT 🔥 </h1>
                    {/* <p className={`text-3xl tracking-wider font-medium !text-green-500`}>{userData?.percentage?.yesterday?.percentage} %  🔥</p> */}
                  </div>
                  <div className="flex flex-col gap-2 w-max items-end">

                    <ButtonPrimary onClick={() => router.push(appBaseRoutes.invest)}>
                      Claim Prize
                    </ButtonPrimary>
                  </div>


                </div>


                {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}
              </div>
              {/* {data?.icon} */}
            </div>
          </div>

          <div className="flex justify-between ">
            {/* <p className='text-xs'>{data.desc} </p> */}
          </div>
        </>

      }
    </div>
  )
}