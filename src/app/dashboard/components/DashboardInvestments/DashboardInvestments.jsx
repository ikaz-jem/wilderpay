"use client"
import { appBaseRoutes } from "@/routes";
import Link from "next/link";
import { FaLock, FaUnlock } from "react-icons/fa";
import { formatISO } from "@/app/utils/formatISO"
import BorderEffect from "../BorderEffect/BorderEffect";
import { formatCustomPrice, formatPrice } from "@/app/utils/formatPrice";
import { useState } from "react";
import { IoArrowForward } from "react-icons/io5";
import { coinIcon } from "../../staticData";



export default function DashboardInvestments({ data }) {

    const [filter, setFilter] = useState('active')

    const yesterdayPercent = data?.percentage?.yesterday?.percentage
    const todayPercent = data?.percentage?.today?.percentage

    const now = new Date();

    const contracts = data?.staking?.filter((contract) => {
        if (filter === 'active') return !contract.claimed
        if (filter === 'claimed') return contract.claimed
        if (filter === 'forced') return contract.forced
        if (filter === 'unlocked') {
            const target = new Date(contract.unlocksAt);
            const diffMs = target.getTime() - now.getTime();
            let disabled = diffMs >= 0
            if (!disabled) {
                return contract
            }
        }

    })


    return (


        <>

            {
                data?.staking?.length > 0 ?
                    <div className='flex flex-col gap-3  w-full  '>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center ">

                                <h1 className={`${filter == "active" ? "!text-accent bg-primary/10 " : "!text-neutral"}  capitalize px-3 py-1 rounded-lg  text-xs cursor-pointer hover:!text-primary `} onClick={() => setFilter('active')} >Active </h1>
                                <h1 className={`${filter == "unlocked" ? "!text-accent bg-primary/10 " : "!text-neutral"} capitalize px-3 py-1 rounded-lg   text-xs  cursor-pointer hover:!text-primary `} onClick={() => setFilter('unlocked')}>Unlocked </h1>
                                <h1 className={`${filter == "claimed" ? "!text-accent bg-primary/10 " : "!text-neutral"} capitalize px-3 py-1 rounded-lg   text-xs  cursor-pointer hover:!text-primary `} onClick={() => setFilter('claimed')}>Claimed </h1>
                            </div>
                            <Link href={appBaseRoutes.contracts} className="text-xs flex gap-1 items-center !text-primary cursor-pointer hover:!text-accent transition-all">Manage  <IoArrowForward />  </Link>
                        </div>
                        {
                            contracts?.length == 0 &&  <div  className='flex flex-col gap-2 border border-accent/10 p-5 rounded-xl relative overflow-hidden bg-card backdrop-blur-xl'>


                                <div className='flex flex-col '>
                                    <h1 className="capitalize !text-highlight">No {filter} Contracts Yet</h1>
                                    <Link href={appBaseRoutes.invest} className="flex items-center gap-2 text-xs !text-primary cursor-pointer hover:!text-accent transition-all">Create Investment Contract <IoArrowForward /></Link>
                                    {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}
                                </div>



                            </div>
                        }


                        {contracts?.map((stake, idx) => {
                            console.log(stake)
                            const target = new Date(stake.unlocksAt);
                            const diffMs = target.getTime() - now.getTime();
                            let disabled = diffMs >= 0
                            const yesterdayBonus = (stake?.amount * yesterdayPercent) / 100
                            const todayBonuse = (stake?.amount * todayPercent) / 100




                            return (


                                <div key={idx} className='flex flex-col gap-2 border border-accent/10 p-5 rounded-xl relative overflow-hidden bg-card backdrop-blur-xl'>

                                    {/* <BorderEffect /> */}
                                    <div className='flex  gap-3 items-center '>

                                        <img src={coinIcon[stake?.currency]} alt="" className='w-8 h-8' />
                                        <div className='w-full flex justify-between'>

                                            <div className='flex flex-col '>
                                                <h1 className="uppercase">{stake?.currency}</h1>
                                                <p className='text-xs !text-highlight'>{formatCustomPrice((stake?.amount))} {stake?.currency}</p>
                                                {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}

                                            </div>
                                            <div className="flex flex-col">

                                                <p className='text-xs '>Today's Estimate :<span className="uppercase text-xs   !text-highlight"> +{formatCustomPrice(todayBonuse, 4)} {stake.currency} </span>    </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between ">

                                        <p className='text-sm'>{formatISO(stake.unlocksAt)} </p>
                                        <div className="flex items-center gap-2">
                                            <p className='text-sm'>{stake.duration} days </p>

                                            {
                                                disabled ?
                                                    <FaLock className="text-yellow-500" />
                                                    :
                                                    <FaUnlock className="text-primary" />
                                            }
                                        </div>
                                    </div>
                                </div>)
                        }
                        )
                        }


                    </div>
                    :

                                <div  className='flex flex-col gap-2 border border-accent/10 p-5 rounded-xl relative overflow-hidden bg-card backdrop-blur-xl'>
                        <div className="flex items-center justify-between">

                            <h1 className="!text-neutral text-sm" >Investments</h1>
                            <Link href={appBaseRoutes.contracts} className="text-xs flex gap-1 items-center !text-primary cursor-pointer hover:!text-accent transition-all">Manage  <IoArrowForward />  </Link>
                        </div>

                        <div className='flex flex-col gap-2 border border-accent/10 p-5 rounded-xl relative overflow-hidden bg-card backdrop-blur-xl'>
                            {/* <BorderEffect /> */}

                            <div className='flex flex-col '>
                                <h1>You Have No Active Investments</h1>
                                <Link href={appBaseRoutes.invest} className="text-xs flex gap-1 items-center !text-primary cursor-pointer hover:!text-accent transition-all">Create Investment Contract  <IoArrowForward /> </Link>
                                {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}
                            </div>
                        </div>
                    </div>
            }
        </>

    )
}
