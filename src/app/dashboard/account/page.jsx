'use client'

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { IoMdCopy } from "react-icons/io"
import { toast } from "sonner"
import { getReferrals } from "@/actions/getReferrals"
import { IoPersonAdd } from "react-icons/io5";
import BorderEffect from "../components/BorderEffect/BorderEffect"
import { formatCustomPrice, formatPrice } from "@/app/utils/formatPrice"
import axios from "axios"
import { coinIcon } from "../staticData"

import Loading from "../loading"
import TiersModal from "./TiersModal"

import { partnerLevel } from "../staticData"
import { formatISO } from "@/app/utils/formatISO"
import { useRouter } from "next/navigation"


export default function ReferralPage() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  const user = session?.user
  const userId = session?.user?.id


  async function getData() {
    let data = await getReferrals(userId, process.env.NEXT_PUBLIC_SECRET)
    setUserData(data)
    setLoading(false)
  }
  async function getRef() {
    let data = await axios.get('/api/account/referrals').then((res) => res.data)
  }

  useEffect(() => {
    if (userId) {
      getData()
      getRef()
    }
  }, [userId])





  const creditedRefCount = userData?.deposits?.filter((deposit) => deposit.depositType == "referral bonus").length || 0
  const creditedRebatesCount = userData?.deposits?.filter((deposit) => deposit.depositType == "rebate").length || 0


const linkClass = "text-xs flex gap-1 items-center !text-primary cursor-pointer hover:!text-accent transition-all"

  return (

    <div className="grid w-full space-y-5 ">


      <div className="flex items-center gap-2">

        <p className=" text-xs !text-neutral">Need Help ? checkout our  </p>

        <TiersModal text={'Tiers and Levels Section'} />
      </div>


      

      <div className="flex flex-col md:flex-row gap-5  ">
        <div className="flex flex-col gap-5 w-full">



          {
            loading ?
              <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded relative border border-primary/10">
                <BorderEffect />
                <Loading />
              </div>
              :
              <PartnerLevel userData={userData} />

          }

          {
            loading ?
              <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded relative border border-primary/10">
                <BorderEffect />
                <Loading />
              </div>
              :
              <Referrals userData={userData} user={user} />
          }

        </div>


        <div className="grid gap-5 w-full">
          {
            loading ?
              <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded relative border border-primary/10">
                <BorderEffect />
                <Loading />
              </div>
              :
              <RankBonus userData={userData} user={user} />
          }
          {
            loading ?
              <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded relative border border-primary/10">
                <BorderEffect />
                <Loading />
              </div>
              :
              <RebatesBonus userData={userData} />
          }
          {
            loading ?
              <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded relative border border-primary/10">
                <BorderEffect />
                <Loading />
              </div>
              :
              <ReferralBonus userData={userData} />
          }
        </div>
      </div>
    </div>
  )
}



function PartnerLevel({ userData }) {

  function exctractCurrentLevel(currentVolume) {
    return partnerLevel.find((level, idx) => {

      if (level.level == 6 && currentVolume >= level.min) {
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

    <>
      <div className="flex gap-3  flex-wrap">
        {
          partnerLevel.map((level, idx) => <div key={idx} className="flex flex-col items-center justify-center gap-2">
            <img src={level.badge} className={`w-18 h-18  ${currentLevel?.level - 1 == idx ? "animate-pulse" : "grayscale scale-80"}`} alt="" />
            <p className={`text-xs capitalize ${currentLevel?.level - 1 == idx && "!text-primary font-sembold !text-md"}`}>{level.name} </p>

          </div>
          )
        }
      </div>
      <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded relative border border-primary/10">
        <BorderEffect />

        <div className="flex justify-between">

          <div className="flex flex-col justify-center gap-1">
            <h1 className="text-lg tracking-wider uppercase">Partner Level</h1>
            <p className=" text-xs !text-neutral">Get Amazing Rewards Each Level !</p>
          </div>
          <img src={currentLevel?.badge} className={`w-10 h-10 }`} alt="" />

        </div>


        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="uppercase"> Level Progress : {formatCustomPrice(currentProgress, 2)} % </p>
            <p className="  text-xs">Next Level : {formatCustomPrice(currentLevel.max - userData?.totalVolume, 4)} $  </p>
          </div>
          <div>
            <div className="w-full bg-primary/20 rounded-full overflow-hidden relative">
              <p className="bg-primary/80  p-2  rounded-full animate-pulse" style={{ width: `${currentProgress}%` }} >  </p>

            </div>

          </div>
        </div>
        <p className=" text-xs !text-neutral">Need Help ? checkout our  <span className="!text-primary">Tiers and Levels Section</span> </p>
      </div>

    </>
  )
}
function RankBonus({ userData }) {
  const [claiming, setIsClaiming] = useState(false)


const router = useRouter()


  function exctractCurrentLevel(currentVolume) {
    return partnerLevel.find((level, idx) => {

      if (level.level == 6 && currentVolume >= level.min) {
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

  async function ClaimBonus(bonus) {
    if (claiming) {
      return
    }
    toast('Claiming Your Bonus Please Wait ...')
    setIsClaiming(true)
    const response = await axios.post('/api/claim-rank-bonus', bonus, {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_SECRET
      }
    }).then((res) => res.data)
    toast(response.message)
    setIsClaiming(false)
    router.refresh()
  }


  const bonusCount = userData?.bonuses?.length || 0


  function isClaimed(level) {

    const found = userData?.bonuses?.find((bonus) => bonus.level == level?.level)
    if (found?.claimed) {
      return true
    }
    return false
  }

  return (

    <>

      <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded relative border border-primary/10">
        <BorderEffect />

        <div className="flex justify-between">

          <div className="flex flex-col justify-center gap-1">
            <h1 className="text-lg tracking-wider uppercase">Rank Bonuses</h1>
            <p className=" text-xs !text-neutral capitalize">Get instant USDT Rewards on Each Level Unlocked</p>
          </div>
          <img src={currentLevel?.badge} className={`w-10 h-10 }`} alt="" />

        </div>


        <div className="flex flex-col  gap-3  flex-wrap w-full">
          {
            partnerLevel.map((bonus, idx) => <div key={idx} className="flex flex-col items-center justify-center gap-2 grayscale">


              {bonus?.bonus !== 0 && <div className={` flex w-full justify-between  `}>
                <p className="text-xs">{bonus?.name} </p>
                <div className="flex gap-2 items-center">
                  <p className="text-xs">{formatCustomPrice(bonus?.bonus)} USDT</p>
                  <img src={coinIcon['usdt']} className={`w-5 h-5 }`} alt="" />
                </div>
              </div>}

            </div>
            )
          }


          {
            currentLevel?.bonus !== 0
            && <div className={` flex w-full justify-between p-2  border border-primary/40 bg-primary/20 `}>
              <p className="text-xs">{currentLevel?.name} </p>
              <div className="flex gap-2 items-center">
                <p className="text-xs">{formatCustomPrice(currentLevel?.bonus)} USDT</p>
                <img src={coinIcon['usdt']} className={`w-5 h-5 }`} alt="" />
                {
                  isClaimed(currentLevel) ?

                    <p className="text-xs capitalize" >claimed</p>
                    :
                    <button className="!text-primary text-xs cursor-pointer capitalize" onClick={() => ClaimBonus(currentLevel)} >claim</button>
                }
              </div>


            </div>
          }


        </div>




        {/* <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="uppercase"> Level Progress : {formatCustomPrice(currentProgress, 2)} % </p>
            <p className="  text-xs">Next Level : {formatCustomPrice(currentLevel.max - userData?.totalVolume, 4)} $  </p>
          </div>
          <div>
            <div className="w-full bg-primary/20 rounded-full overflow-hidden relative">
              <p className="bg-primary/80  p-2  rounded-full animate-pulse" style={{ width: `${currentProgress}%` }} >  </p>

            </div>

          </div>
        </div> */}
      </div>

    </>
  )
}




function RebatesBonus({ userData }) {

  const creditedRebatesCount = userData?.deposits?.filter((deposit) => deposit.depositType == "rebate").length || 0


  return (
    <>

      <div className="p-5 mx-auto  space-y-5 w-full backdrop-blur-xl bg-card rounded border border-primary/10 relative">
        <BorderEffect />

        <div className="flex flex-col justify-center gap-1">
          <h1 className="text-lg tracking-wider uppercase">Rebates History</h1>
          <p className=" text-xs !text-neutral">Rebates Are credited Automatically Daily to yieldium Wallet</p>
        </div>

        {creditedRebatesCount > 0 ? (
          <div className="space-y-3 h-80 overflow-y-scroll ">
            <div className="text-sm space-y-1">
              {userData?.deposits?.filter((deposit) => deposit.depositType == "rebate").map((bonus, i) => (
                <div key={i} className="bg-white/5 rounded py-3 flex justify-between items-center px-5 ">
                  <div className="flex items-center gap-2 ">
                    <IoPersonAdd className='text-neutral' />
                    <div className="flex flex-col md:flex-row gap-1  ">

                      <p className={`!text-xs truncate capitalize '`}>{bonus?.signature || ''}</p>
                      <p className={`!text-xs truncate capitalize !text-orange-500/50 '`}>{formatISO(bonus?.createdAt) || ''}</p>
                    </div>

                  </div>

                  <div className="flex items-center gap-2">

                    <p className={`!text-sm truncate !text-green-500 uppercase '`}> + {formatCustomPrice(bonus.amount, 8)} {bonus?.currency}</p>
                    <img src={coinIcon[bonus?.currency]} alt="" className="h-5 w-5 opacity-50" />
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


function ReferralBonus({ userData }) {

  const creditedRefCount = userData?.deposits?.filter((deposit) => deposit.depositType == "referral bonus").length || 0

  return (
    <>
      <div className="p-5 mx-auto  space-y-5 w-full backdrop-blur-xl bg-card rounded border border-primary/10">
        <BorderEffect />

        <div className="flex flex-col justify-center gap-1">
          <h1 className="text-lg tracking-wider  uppercase">Bonus History : {creditedRefCount} </h1>
          <p className=" text-xs !text-neutral">Profits Are credited Automatically to yieldium Wallet</p>
        </div>

        {creditedRefCount > 0 ? (
          <div className="space-y-3 max-h-80 overflow-y-scroll">
            <div>
              <ul className="text-sm space-y-1">
                {userData?.deposits?.filter((deposit) => deposit.depositType == "referral bonus").map((bonus, i) => (
                  <li key={i} className="bg-white/5 rounded py-3 flex justify-between items-center px-5 w-full">
                    <div className="flex items-center gap-2 ">
                      <IoPersonAdd className='text-neutral' />
                      <p className={`!text-xs truncate capitalize '`}>{bonus?.signature || ''}</p>
                      <p className={`!text-xs truncate capitalize '`}>({bonus?.status || ''})</p>

                    </div>

                    <div className="flex items-center gap-2">

                      <p className={`!text-sm truncate !text-green-500 uppercase '`}> + {formatCustomPrice(bonus.amount)} {bonus?.currency}</p>
                      <img src={coinIcon[bonus?.currency]} alt="" className="h-5 w-5 opacity-50" />
                    </div>

                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
          :

          (<div className="space-y-3">
            <div>
              <ul className="text-sm space-y-1">

                <li className="bg-white/5 rounded p-5 w-full space-y-2">
                  <div className="flex items-center gap-2 ">
                    <p className={` truncate '`}>Nothing Yet !</p>
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

function Referrals({ userData, user }) {

  const referralLink = typeof window !== "undefined" && user?.id ? `${window.location.origin}/register?id=${user?.walletIndex}` : ""
  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link)
    toast.success("copied!")
  }

  return (
    <>
      <div className="p-5 mx-auto  space-y-5 w-full backdrop-blur-xl bg-card rounded relative border border-primary/10">
        <BorderEffect />

        <div className="flex flex-col justify-center gap-1">
          <h1 className="text-lg tracking-wider uppercase">Community Program</h1>
          <p className=" text-xs !text-neutral">Get 10% direct Community Comission !</p>
        </div>
        <p className=" text-xs !text-neutral">Invite Id :</p>
        <div className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
          <p className="text-sm break-all">{user?.walletIndex}</p>
          <button onClick={() => copyToClipboard(user?.walletIndex)} className="cursor-pointer hover:scale-110 hover:!text-green-500">
            <IoMdCopy className="text-lg" />
          </button>
        </div>
        <p className=" text-xs !text-neutral">Referral Link :</p>
        <div className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
          <p className="text-sm break-all">{referralLink}</p>
          <button onClick={() => copyToClipboard(referralLink)} className="cursor-pointer hover:scale-110 hover:!text-green-500">
            <IoMdCopy className="text-lg" />
          </button>
        </div>


        {/* <div className="flex items-center">
          <a
            href="https://wa.me/?text=Check%20this%20out%20https%3A%2F%2Fyourapp.com%2Fsome-page"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoWhatsapp className="text-2xl text-green-500"/>
          </a>
          <a
            href="https://twitter.com/intent/tweet?url=https://yourapp.com/some-page&text=Check%20this%20out!"
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on Twitter
          </a>

          <a
            href="https://www.facebook.com/sharer/sharer.php?u=https://yourapp.com/some-page"
            target="_blank"
            rel="noopener noreferrer"
          ></a>

          <a
            href="https://t.me/share/url?url=https://yourapp.com/some-page&text=Check%20this%20out!"
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on Telegram
          </a>
        </div> */}

        {userData?.referredUsers.length > 0 ? (
          <div className="space-y-3">
            <p className="uppercase"> Referrals</p>
            <div>
              <ul className="text-sm space-y-1">
                {userData?.referredUsers.map((user, i) => (
                  <li key={i} className="bg-white/5 rounded p-5">• {user.email.slice(0, 4, user.email.length)} *** @{user.email.split('@')[1]}</li>
                ))}
              </ul>
            </div>
          </div>
        ) :

          <div className="space-y-3">
            <div>
              <ul className="text-sm space-y-1">

                <li className="bg-white/5 rounded p-5 w-full space-y-2">
                  <div className="flex flex-col items-center gap-2 ">
                    <p className={`!text-lg truncate text-wrap'`}>Start Referring Others To Earn instant 10%  !</p>
                    <p className={` truncate text-wrap'`}>Amazing Daily Rebates up to 10 Levels !</p>

                  </div>
                </li>

              </ul>
            </div>

          </div>


        }
      </div>
    </>
  )


}



// function StatsCard({data}) {


//   return (



//     <div className='flex flex-col max-w-md w-full gap-2 border border-primary/10 p-5 bg-card rounded backdrop-blur-xl relative overflow-hidden '>
//       <BorderEffect />

//       <div className='flex  gap-5 items-center '>

//         <img src={""} alt="" className='w-8 h-8' />
//         <div className='w-full flex justify-between'>
//           <div className='flex flex-col '>
//             <h1 className="uppercase">{data.title}</h1>
//             <p className='text-xs'>xxxxx   <span className="uppercase">xxx </span> </p>
//             {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}
//           </div>
//           <p className='text-sm !text-green-500'>xxxxxx <span className="uppercase">xxxxxxx </span></p>
//         </div>
//       </div>

//       <div className="flex justify-between ">
//         <p className='text-sm'>zzz </p>
//       </div>


//       <div className="flex justify-between ">

//         <p className='text-sm'>zzz </p>
//         <div className="flex items-center gap-2">
//           <p className='text-sm'>zzzz days </p>



//         </div>
//       </div>


//       <div className="flex gap-2">
//         {/* {disabled && <ForceUnlockModal contract={contract} />} */}
//       </div>

//     </div>

//   )

// }




