"use client"
// import TodayYesterdayMeter from "../charts/TodayYesterdayMeter"
import BorderEffect from "../BorderEffect/BorderEffect"

import ButtonPrimary from "@/app/components/ButtonPrimary"
import { appBaseRoutes } from "@/routes"
import { useRouter } from "next/navigation"


export default function TokenSaleCard({ userData }) {
  const router = useRouter()


  return (
    <div className='flex flex-col  w-full gap-3 border border-yellow-500/10 p-5 bg-gradient-to-tl from-black to-yellow-500/30 rounded-xl backdrop-blur-xl relative overflow-hidden '>
      <BorderEffect />

      {

        <>
          <div className='flex  gap-5 items-center '>

            <div className='w-full flex justify-between'>
              <div className='flex flex-col gap-5 w-full '>
                <div className='flex justify-between w-full items-center'>

                  <div className='flex flex-col gap-5 '>
                    <div className="flex items-center gap-2">

                      <img src="/assets/images/token.webp" alt="" className="w-26 h-26" />
                      <div className="grid">

                      <p className="text-xl font-bold !text-yellow-500 align-middle ">
                        WilderPay Token $WPAY
                      </p>
                      <p className="uppercase text-xs !text-accent ">$WPAY Ownnership Renounced 🔥🔐 </p>
                      </div>
                    </div>

                    <div className="grid">

                      <p className="uppercase text-xs ">🚀 WilderPay Token Private Sale is Available For Users </p>
                      <p className="uppercase text-xs "> 🎁 exclusively for WilderPay Users an Extra 10% Token Bonus </p>
                    </div>
                    {/* <p className={`text-3xl tracking-wider font-medium !text-green-500`}>{userData?.percentage?.yesterday?.percentage} %  🔥</p> */}
                  </div>
                  <div className="flex flex-col gap-2 w-max items-end">

                    <ButtonPrimary className='!w-max px-5' onClick={() => router.push(appBaseRoutes.presale)}>
                      Get $WPAY Now 🚀
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