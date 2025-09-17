import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import BorderEffect from '../../components/BorderEffect/BorderEffect'
import { getServerSession } from 'next-auth';
import dbConnect from '@/app/lib/db';
import Balance from '@/app/models/balanceSchema/balanceSchema';
import Staking from '@/app/models/stacking/stakingSchema';
import UserSchema from '@/app/models/userSchema/UserSchema';
import { IoPersonAdd } from 'react-icons/io5';
import { FaLevelDownAlt } from "react-icons/fa";
import TransactionHistory from './TransactionHistory';
import axios from 'axios';




export default async function page() {
 
  return (
    <>

      <div className="flex flex-col md:flex-row gap-5  ">

        <TransactionHistory />
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
      <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded-xl relative border border-primary/10">
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

      <div className="p-5 mx-auto  space-y-5 w-full backdrop-blur-xl bg-card rounded border border-primary/10 relative">
        <BorderEffect />

        <div className="flex flex-col justify-center gap-1">
          <h1 className="text-lg tracking-wider uppercase">Direct Referrals : {userData.length} </h1>
          <p className=" text-xs !text-neutral">Rebates Are credited Automatically Daily to yieldium Wallet</p>
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


