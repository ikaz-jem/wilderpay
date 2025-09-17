"use client"
// import TodayYesterdayMeter from "../charts/TodayYesterdayMeter"
import BorderEffect from "../BorderEffect/BorderEffect"
import { formatCustomPrice } from "@/app/utils/formatPrice"
import { coinIcon } from "../../staticData"
import Loading from "../../loading"


export default function DashboardStatsCard({ userData }) {


  async function getMetter() {



    let TodayYesterdayMeter = (await import('../charts/TodayYesterdayMeter')).default
    return <TodayYesterdayMeter today={userData?.percentage?.today?.percentage} yesterday={userData?.percentage?.yesterday?.percentage} />

  }

  return (
    <div className='flex flex-col  w-full gap-3 border border-accent/10 px-5 py-3 bg-card rounded-xl backdrop-blur-xl relative overflow-hidden '>
      <BorderEffect />

      {

        <>
          <div className='flex  gap-5 items-center '>

            <div className='w-full flex justify-between'>
              <div className='flex flex-col gap-5 w-full '>
                <div className='flex justify-between w-full items-center'>

                  <div className='flex flex-col w-full'>
                    <h1 className="uppercase text-sm">yesterday's Earnings</h1>
                    <p className={`text-3xl tracking-wider font-medium !text-green-500`}>{userData?.percentage?.yesterday?.percentage} %  🔥</p>
                  </div>


                  {!userData ? <Loading /> : getMetter()}

                </div>
                <div className='flex gap-2 items-center w-full flex-wrap'>

                  {
                    userData?.staking?.map((stake, idx) => <div key={idx} className='w-max flex gap-2 '>

                      <div className='flex items-center gap-1 '>
                        <img src={coinIcon[stake?.currency]} alt="" className='w-5 h-5' />
                        <p className='text-xs tracking-wider font-light !text-green-500 uppercase'>+{formatCustomPrice(((stake.amount * userData?.percentage?.yesterday?.percentage) / 100),8)} <span className='!text-neutral'>{stake.currency} </span> </p>
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
            {/* <p className='text-xs'>{data.desc} </p> */}
          </div>
        </>

      }
    </div>
  )
}