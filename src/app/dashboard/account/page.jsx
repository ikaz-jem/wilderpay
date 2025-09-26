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
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { IoArrowForward } from "react-icons/io5";
import { appBaseRoutes } from "@/routes"


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

        <p className=" text-xs !text-neutral">Rebates Are Paid Daily , Referral Commissions are Paid Instantly </p>

      </div>




      <div className="flex flex-col md:flex-row gap-5  ">
        <div className="flex flex-col gap-5 w-full">

          {
            loading ?
              <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded-xl relative border border-primary/10">
                <BorderEffect />
                <Loading />
              </div>
              :
              <PartnerLevel userData={userData} />

          }


          {
            loading ?
              <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded-xl relative border border-primary/10">
                <BorderEffect />
                <Loading />
              </div>
              :
              <Referrals userData={userData} user={user} />
          }

                <p className=" text-xs !text-neutral">Rebates Paid And credited  Daily </p>

      <RebateTiers/>


        </div>


        <div className="grid gap-5 w-full">
          {
            loading ?
              <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded-xl relative border border-primary/10">
                <BorderEffect />
                <Loading />
              </div>
              :
              <RankBonus userData={userData} user={user} />
          }
          {
            loading ?
              <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded-xl relative border border-primary/10">
                <BorderEffect />
                <Loading />
              </div>
              :
              <RebatesBonus userData={userData} />
          }
          {
            loading ?
              <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded-xl relative border border-primary/10">
                <BorderEffect />
                <Loading />
              </div>
              :
              <ReferralBonus userData={userData} />
          }

        </div>




      </div>
                      <p className=" text-xs !text-neutral capitalize">Referral Comissions Paid  instantly , Bonuses are claimable and withdrawable upon unlocking new Rank </p>

      <TiersTable/>
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
      {/* <div className="flex gap-3  flex-wrap">
        {
          partnerLevel.map((level, idx) => <div key={idx} className="flex flex-col items-center justify-center gap-2">
            <img src={level.badge} className={`w-18 h-18  ${currentLevel?.level - 1 == idx ? "animate-pulse" : "grayscale scale-80"}`} alt="" />
            <p className={`text-xs capitalize ${currentLevel?.level - 1 == idx && "!text-primary font-sembold !text-md"}`}>{level.name} </p>

          </div>
          )
        }
      </div> */}
      <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded-xl relative border border-primary/10">
        <BorderEffect />

        <div className="flex justify-between">

          <div className="flex flex-col justify-center gap-1">
            <h1 className="text-lg tracking-wider uppercase">Honorary Level</h1>
            <p className=" text-xs !text-neutral">Get Amazing Rewards Each Level !</p>
          </div>
          <img src={currentLevel?.badge} className={`w-16 h-16 }`} alt="" />

        </div>


        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="uppercase"> Level Progress : {formatCustomPrice(currentProgress, 2)} % </p>
            <p className="  text-xs">Next Level : {formatCustomPrice(currentLevel.max - userData?.totalVolume, 4)} $  </p>
          </div>
          <div>
            <div className="w-full bg-highlight/20 rounded-full overflow-hidden relative">
              <p className="bg-highlight  p-2  rounded-full animate-pulse" style={{ width: `${currentProgress}%` }} >  </p>

            </div>

          </div>
        </div>
        <p className=" text-xs !text-neutral">Need Help ?  <span className="!text-primary">Progression & Rewards Guide</span> </p>
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

      <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl  rounded-xl relative border border-accent/10 bg-gradient-to-r from-transparent to-accent/20">

        <div className="flex justify-between">

          <div className="flex flex-col justify-center gap-1">
            <h1 className="text-lg tracking-wider uppercase">Apex Rewards</h1>
            <p className=" text-xs !text-neutral capitalize">Get instant USDT Rewards on Each Level Unlocked</p>
          </div>
          <img src={currentLevel?.badge} className={`w-16 h-16 }`} alt="" />

        </div>


        <div className="flex flex-col  gap-2  flex-wrap w-full">
          {
            partnerLevel.map((bonus, idx) => <div key={idx} className="flex flex-col items-center justify-center gap-2 ">


              {bonus?.bonus !== 0 && <div className={` flex w-full justify-between  ${currentLevel?.level < bonus?.level && "grayscale"} `}>
                <div className="flex items-center gap-2">

                  <img src={bonus?.badge} className={`w-10 h-10`} alt="" />
                  <p className="text-xs">{bonus?.name} </p>
                </div>
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
              <div className="flex items-center gap-2">

                <img src={currentLevel?.badge} className={`w-10 h-10`} alt="" />
                <p className="text-xs">{currentLevel?.name} </p>
              </div>              <div className="flex gap-2 items-center">
                <p className="text-xs">{formatCustomPrice(currentLevel?.bonus)} USDT</p>
                <img src={coinIcon['usdt']} className={`w-5 h-5 }`} alt="" />
                {
                  isClaimed(currentLevel) ?

                    <p className="text-xs capitalize !text-accent" >claimed ✔️</p>
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
  const rebates = userData?.deposits?.filter((deposit) => deposit.depositType == "rebate")?.reduce((acc, { currency, amount }) => {
    acc[currency] = (acc[currency] || 0) + amount;
    return acc;
  }, {});

  const totalRebates = Object?.entries(rebates).map(([currency, amount]) => ({
    currency,
    amount
  }));


  return (
    <>

      <div className="p-5 mx-auto  space-y-5 w-full backdrop-blur-xl bg-card rounded-xl border border-primary/10 relative">
        <BorderEffect />

        <div className="flex flex-col justify-center gap-1">
          <div className="flex justify-between items-center">
            <h1 className="text-lg tracking-wider uppercase">Total Earned Rebates</h1>
            <a href={appBaseRoutes.transactions} className="text-xs flex gap-1 items-center !text-primary cursor-pointer hover:!text-accent transition-all">More Details  <IoArrowForward />  </a>

          </div>
          <p className=" text-xs !text-neutral">Total Earned Rebates From All Levels</p>
        </div>

        {creditedRebatesCount > 0 ? (
          <div className="space-y-3 h-max overflow-y-scroll ">
            <div className="text-sm space-y-1">
              {totalRebates && totalRebates?.map((bonus, i) => (
                <div key={i} className="bg-white/5 rounded py-3 flex justify-between items-center px-5 ">
                  <div className="flex items-center gap-2 ">
                    <IoPersonAdd className='text-neutral' />
                    <p className={`!text-xs truncate uppercase '`}>{bonus?.currency || ''}</p>
                    <div className="flex flex-col md:flex-row gap-1  ">

                      {/* <p className={`!text-xs truncate capitalize !text-orange-500/50 '`}>{formatISO(bonus?.createdAt) || ''}</p> */}
                    </div>

                  </div>

                  <div className="flex items-center gap-2">

                    <p className={`!text-sm truncate !text-highlight uppercase '`}> + {formatCustomPrice(bonus.amount, 8)} {bonus?.currency}</p>
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

  const referralsCommision = userData?.deposits?.filter((deposit) => deposit.depositType == "referral bonus")?.reduce((acc, { currency, amount }) => {
    acc[currency] = (acc[currency] || 0) + amount;
    return acc;
  }, {});

  const totalCommisions = Object?.entries(referralsCommision).map(([currency, amount]) => ({
    currency,
    amount
  }));


  return (
    <>
      <div className="p-5 mx-auto  space-y-5 w-full backdrop-blur-xl bg-card rounded-xl border border-primary/10">
        <BorderEffect />

        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center justify-between">
            <h1 className="text-lg tracking-wider  uppercase">Total Earned Commisions  </h1>
            <a href={appBaseRoutes.transactions} className="text-xs flex gap-1 items-center !text-primary cursor-pointer hover:!text-accent transition-all">More Details  <IoArrowForward />  </a>

          </div>
          <p className=" text-xs !text-neutral">Total Earned Affiliate Commission From All Levels</p>
        </div>

        {creditedRefCount > 0 ? (
          <div className="space-y-3 max-h-max overflow-y-scroll">
            <div>
              <ul className="text-sm space-y-1">
                {totalCommisions && totalCommisions?.map((bonus, i) => (
                  <li key={i} className="bg-white/5 rounded py-3 flex justify-between items-center px-5 w-full">
                    <div className="flex items-center gap-2 ">
                      <IoPersonAdd className='text-neutral' />
                      <p className={`!text-xs truncate uppercase '`}>{bonus?.currency || ''}</p>

                    </div>

                    <div className="flex items-center gap-2">

                      <p className={`!text-sm truncate !text-highlight uppercase '`}> + {formatCustomPrice(bonus.amount, 5)} {bonus?.currency}</p>
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
      <div className="p-5 mx-auto  space-y-5 w-full backdrop-blur-xl bg-card rounded-xl relative border border-primary/10">
        <BorderEffect />

        <div className="flex flex-col justify-center gap-1">
          <div className="flex justify-between items-center">
            <h1 className="text-lg tracking-wider uppercase">Affiliate Program</h1>

            <HiOutlineSpeakerphone className="text-2xl !text-primary" />
          </div>
          <p className=" text-xs !text-neutral text-wrap">Get up to 12% direct Community Comission !</p>
        </div>
        <p className=" text-xs !text-neutral">Invite Id :</p>
        <div className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
          <p className="text-sm break-all">{user?.walletIndex}</p>
          <button onClick={() => copyToClipboard(user?.walletIndex)} className="cursor-pointer hover:scale-110 hover:!text-highlight">
            <IoMdCopy className="text-lg" />
          </button>
        </div>
        <p className=" text-xs !text-neutral">Referral Link :</p>
        <div className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
          <p className="text-sm break-all">{referralLink}</p>
          <button onClick={() => copyToClipboard(referralLink)} className="cursor-pointer hover:scale-110 hover:!text-highlight">
            <IoMdCopy className="text-lg" />
          </button>
        </div>


        {/* <div className="flex items-center">
          <a
            href="https://wa.me/?text=Check%20this%20out%20https%3A%2F%2Fyourapp.com%2Fsome-page"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoWhatsapp className="text-2xl text-highlight"/>
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



        <div className="space-y-3">
          <div>
            <ul className="text-sm space-y-1">

              <li className="bg-white/5 rounded p-5 w-full space-y-2">
                <div className="flex flex-col items-center gap-2 ">
                  <p className={`!text-lg  !text-wrap  text-center'`}>Start Referring Others To Earn instant Commission up to 12%  !</p>
                  <p className={` truncate text-wrap'`}>Amazing Daily Rebates up to 10 Levels !</p>

                </div>
              </li>

            </ul>
          </div>

        </div>

      </div>
    </>
  )


}



const tiers = [
  {  name: "Unranked", levels:[2, 0.25, 0.15, 0.05, 0.01 , ] },
  {  name: "Vanguard - 5K  ", levels:[3, 0.35, 0.2, 0.1, 0.05] },
  {  name: "Pioneer - 50K", levels:[5, 0.5, 0.35, 0.15, 0.1] },
  {  name: "Master - 100K", levels:[7, 0.75, 0.5, 0.2, 0.15] },
  {  name: "Titan - 500K", levels:[9, 1, 0.75, 0.35, 0.2] },
  {  name: "Legend - 1M", levels:[12, 1.5, 1, 0.5, 0.25] },

];

function TiersTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-primary/10  shadow-sm">
      <table className="w-full divide-y divide-primary/10 backdrop-blur-xl">
        <thead className="bg-primary/10">
          <tr>

            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Tier
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Direct
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Level 2
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Level 3
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Level 4
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              level 5
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/10">
          
      
          {tiers.map((tier) => (
            <tr key={tier.name} className="">
              <td className="text-xs px-2 py-2  !text-neutral">{tier.name}  </td>
              
                {
                  tier?.levels?.map((level,idx)=><td className="px-2 py-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs !text-neutral">
                    {level} {typeof level == "number" && "%"}
                  </span>

                </div>
              </td>)
                }

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const rebatesTiers = [
  { name: "Direct", percent: 3 },
  { name: "Level 2", percent: 2 },
  { name: "level 3", percent: 1.5 },
  { name: "level 4", percent: 1 },
  { name: "level 5", percent: 0.8 },
  { name: "level 6", percent: 0.6 },
  { name: "level 7", percent: 0.4 },
  { name: "level 8", percent: 0.3 },
  { name: "level 9", percent: 0.2 },
  { name: "level 10", percent: 0.2 },
];

function RebateTiers() {
  return (
    <div className="overflow-hidden rounded-xl border border-primary/10 shadow-sm">
      <table className="w-full divide-y divide-primary/10 backdrop-blur-xl">
        <thead className="bg-primary/10">
          <tr>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Tier
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Percentage
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/10">
          {rebatesTiers.map((tier) => (
            <tr key={tier.name} className="">
              <td className="text-xs px-2 py-2 !text-neutral">{tier.name}</td>
              <td className="px-2 py-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs !text-neutral">
                    {tier.percent}%
                  </span>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
