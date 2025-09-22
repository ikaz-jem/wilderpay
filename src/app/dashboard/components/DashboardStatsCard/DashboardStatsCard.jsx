"use client"
// import TodayYesterdayMeter from "../charts/TodayYesterdayMeter"
import BorderEffect from "../BorderEffect/BorderEffect"
import { formatCustomPrice } from "@/app/utils/formatPrice"
import { coinIcon } from "../../staticData"
import Loading from "../../loading"
import ButtonSecondary from "@/app/components/ButtonSecondary"
import { useRouter } from "next/navigation"
import { appBaseRoutes } from "@/routes"
import ActivateAccount from "../ActivateAccount/ActivateAccount"


export default function DashboardStatsCard({ userData }) {

  const router = useRouter()

  const today = userData?.percentage?.today?.percentage
  const yesterday = userData?.percentage?.yesterday?.percentage


  async function getMetter() {



    let TodayYesterdayMeter = (await import('../charts/TodayYesterdayMeter')).default
    return <TodayYesterdayMeter today={today} yesterday={yesterday} />

  }





  return (
    <div className='flex flex-col gap-3  w-full border border-accent/10 px-5 py-3 bg-card rounded-xl backdrop-blur-xl relative overflow-hidden '>
      {/* <BorderEffect /> */}






      <div className='flex  gap-5 items-center '>

        <div className='w-full flex justify-between'>
          <div className='flex flex-col gap-5 w-full '>
            <div className='flex justify-between w-full items-center'>

              <div className='flex flex-col w-full'>
                <h1 className="uppercase text-sm">yesterday's Earnings</h1>
                <p className={`text-3xl tracking-wider font-medium !text-highlight`}>{yesterday} %  </p>


                <div className="w-full capitalize space-y-1 py-2">
                  <p className="!text-highlight">
                    participants : {userData?.totalUsers}
                  </p>
                  <div className="flex items-center">
                    <img src={coinIcon["usdt"]} alt="" className="w-6 h-6" />
                    <img src={coinIcon["bnb"]} alt="" className="w-6 h-6 -ml-2" />
                    <img src={coinIcon["xrp"]} alt="" className="w-6 h-6 -ml-2" />
                    <img src={coinIcon["avax"]} alt="" className="w-6 h-6 -ml-2" />
                    <img src={coinIcon["usdc"]} alt="" className="w-6 h-6 -ml-2" />
                    <img src={coinIcon["eth"]} alt="" className="w-6 h-6 -ml-2" />
                    <img src={coinIcon["sol"]} alt="" className="w-6 h-6 -ml-2 rounded-full bg-background" />
                  </div>

                </div>

              </div>


              {!userData ? <Loading /> : getMetter()}

            </div>
            <div className='flex gap-2 items-center w-full flex-wrap'>

              {
                userData?.staking?.map((stake, idx) => <div key={idx} className='w-max flex gap-2 '>

                  <div className='flex items-center gap-1 '>
                    <img src={coinIcon[stake?.currency]} alt="" className='w-5 h-5' />
                    <p className='text-xs tracking-wider font-light !text-highlight uppercase'>+{formatCustomPrice(((stake.amount *  yesterday) / 100), 8)} <span className='!text-neutral'>{stake.currency} </span> </p>
                  </div>


                </div>)
              }
            </div>

            {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}
          </div>
          {/* {data?.icon} */}
        </div>


      </div>

      <div className="flex justify-between ">
        {userData?.verified ? <ButtonSecondary onClick={() => router.push(appBaseRoutes?.invest)} className="w-full" >Participate</ButtonSecondary>
          :
          <ActivateAccount userData={userData} />
        }
      </div>

    </div>
  )
}