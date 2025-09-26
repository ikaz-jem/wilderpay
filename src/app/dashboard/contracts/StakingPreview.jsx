"use client"

import { FaLock } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";
import { formatISO } from "@/app/utils/formatISO";
import { timeLeft } from "@/app/utils/timeLeft";
import BorderEffect from "../components/BorderEffect/BorderEffect";
import { useState } from "react";
import Link from "next/link";
import { appBaseRoutes } from "@/routes";
import { FaCheck } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { timeAgo } from "@/app/utils/timeAgo";
import Unlock from "./Unlock";
import { formatCustomPrice, formatPrice } from "@/app/utils/formatPrice";
import { coinIcon } from "../staticData";
import ForceUnlockModal from "./ForceUnlockModal";



export default function StakingPreview({ contracts, percentage ,role }) {
    const [filter, setFilter] = useState('active')

    const filteredContracts = contracts.filter((contract) => {
        if (filter === 'active') return !contract.claimed
        if (filter === 'claimed') return contract.claimed
        // if (filter === 'forced') return contract.forced
    })
    const allowedToForce = role !== 'admin' && role !=="leader" 

    function ComponentFilter() {
        if (filter == "active") return <Active setFilter={setFilter} contracts={filteredContracts} percentage={percentage} forceUnlock ={allowedToForce} />
        if (filter == "claimed") return <Claimed setFilter={setFilter} contracts={filteredContracts} />
        // if (filter == "forced") return <Forced setFilter={setFilter} contracts={filteredContracts} />
    }


    return (
        <div className="grid gap-5">
            <div className="w-full flex gap-2">
                <p className={`!text-white rounded  backdrop-blur px-5 py-1 border-primary/10 border cursor-pointer hover:bg-primary/40 !text-sm ${filter == "active" && "!bg-primary/40"}`} onClick={() => setFilter('active')}>Active Investments</p>
                <p className={`!text-white rounded  backdrop-blur px-5 py-1 border-primary/10 border cursor-pointer hover:bg-primary/40 !text-sm ${filter == "claimed" && "!bg-primary/40"}`} onClick={() => setFilter('claimed')}>Claimed</p>
                {/* <p className={`!text-white rounded  backdrop-blur px-5 py-1 border-primary/10 border cursor-pointer hover:bg-primary/40 !text-sm ${filter == "forced" && "!bg-primary/40"}`} onClick={() => setFilter('forced')}>Forced</p> */}
            </div>
            <ComponentFilter />
        </div>
    )
}



function calculateYieldiumTokenPercent(stake) {
    if (stake.duration == 720) {
        return 0.05
    }
    if (stake.duration == 360) {

        return 0.025
    }
    return false
}







function Active({ contracts, percentage ,forceUnlock}) {



    const now = new Date();

    if (contracts.length == 0) return (
        <div className='flex flex-col  w-full gap-2 border border-primary/10 p-5  rounded-2xl backdrop-blur-xl relative overflow-hidden '>
            <BorderEffect />
            <h1 className="text-white">
                No Contract is Available !
            </h1>
            <Link href={appBaseRoutes.invest} className={`!text-white w-max rounded backdrop-blur px-5 py-1 border-primary/10 border cursor-pointer hover:bg-primary/40 !text-sm `}>Get Started</Link>

        </div>
    )

    return (
        <div className="grid gap-5">


            <div className="flex items-center justify-between">

                <h1 className="!text-neutral text-sm" >Investments</h1>
            </div>
            <div className='flex gap-5 flex-wrap   w-full '>
                {contracts?.map((contract, idx) => {

                    const target = new Date(contract.unlocksAt);
                    const diffMs = target.getTime() - now.getTime();
                    const bonus = calculateYieldiumTokenPercent(contract)
                    const yesterdayEarning = (contract.amount * percentage?.yesterday?.percentage) / 100
                    const todayEarning = (contract.amount * percentage?.today?.percentage) / 100
                    let disabled = diffMs >= 0
                    return (
                        <div key={idx} className='flex flex-col max-w-xl w-full gap-2 border border-primary/10 p-5  rounded-2xl backdrop-blur-xl relative overflow-hidden '>
                            <BorderEffect />

                            <div className='flex  gap-5 items-center '>

                                <img src={coinIcon[contract?.currency]} alt="" className='w-8 h-8' />
                                <div className='w-full flex justify-between'>
                                    <div className='flex flex-col '>
                                        <h1 className="uppercase">{contract?.currency}</h1>
                                        <p className='text-xs'>{formatCustomPrice(contract?.amount,4)}   <span className="uppercase">{contract?.currency} </span> </p>
                                        {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}
                                    </div>
                                    <div className="flex flex-col gap-1 items-end">

                                        <p className='text-sm !text-highlight uppercase'><span className=" !text-neutral !capitalize text-xs"> Today's Estimate : </span> +{formatCustomPrice(todayEarning,4)} {contract?.currency}  </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between ">
                                <p className='text-sm'>{timeLeft(contract.unlocksAt)} </p>

                                {/* {
                                    bonus && <>
                                        <div className="flex items-center gap-2">
                                            <img src='/assets/images/logo.webp' className="w-5 h-5" alt="" />
                                            <p className="uppercase text-xs">{`${bonus} % Bonus Daily `}</p>
                                        </div>

                                    </>
                                } */}

                            </div>


                            <div className="flex justify-between ">

                                <p className='text-sm'>{formatISO(contract.unlocksAt)} </p>

                                <div className="flex items-center gap-2">
                                    <p className='text-sm'>{contract.duration} days </p>

                                    {
                                        disabled ?
                                            <FaLock className="text-yellow-500" />
                                            :
                                            <FaUnlock className="text-primary" />
                                    }

                                </div>

                            </div>

                            <p className='text-sm !text-highlight uppercase flex items-center gap-2'><span className=" !text-neutral !capitalize text-xs"> Yesterday's Earnings : </span> +{formatCustomPrice(yesterdayEarning,4)} {contract?.currency}  </p>

                            <div className="flex gap-2 pt-5">
                                <Unlock contract={contract} />
                                {disabled && forceUnlock && <ForceUnlockModal contract={contract} />}
                            </div>

                        </div>)
                }
                )
                }


            </div>
            {/* <p className='text-sm'>Using Force Unlock to Withdraw Before Time will Apply 25% Fees instead Of 1 USDT </p> */}
        </div>
    )
}
function Claimed({ contracts }) {


    if (contracts.length == 0) return (
        <div className='flex flex-col  w-full gap-2 border border-primary/10 p-5  rounded-2xl backdrop-blur-xl relative overflow-hidden '>
            <BorderEffect />
            <h1 className="text-white">
                No Contract Was Claimed Yet !
            </h1>
        </div>
    )

    return (
        <div className="grid gap-5">


            <div className="flex items-center justify-between">

                <h1 className="!text-neutral text-sm" >Investments</h1>
            </div>
            <div className='flex gap-5 flex-wrap   w-full '>
                {contracts?.map((contract, idx) =>
                    <div key={idx} className='flex flex-col max-w-xl w-full gap-2 border border-primary/10 p-5  rounded-2xl backdrop-blur-xl relative overflow-hidden '>
                        <BorderEffect />

                        <div className='flex  gap-5 items-center '>

                            <img src={coinIcon[contract?.currency]} alt="" className='w-8 h-8' />
                            <div className='w-full flex justify-between'>
                                <div className='flex flex-col '>
                                    <h1>{contract?.currency}</h1>
                                    <p className='text-xs uppercase'>{parseFloat((contract?.amount).toFixed(2))} {contract?.currency}</p>
                                    {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}
                                </div>
                                <p className='text-sm !text-highlight uppercase'>{formatCustomPrice(contract?.profits,4)} {contract?.currency}</p>
                            </div>
                        </div>

                        <div className="flex justify-between ">
                            <p className='text-sm'>Status :</p>
                            <p className='text-xs !text-highlight flex items-center gap-1 '> Claimed  <FaCheck /> </p>
                        </div>


                        <div className="flex justify-between ">

                            <p className='text-sm'>Claimed At :</p>
                            <div className="flex items-center gap-2">
                                <p className='text-xs'>{timeAgo(contract.updatedAt)}  </p>

                                {
                                    contract?.isLocked ?
                                        <FaLock className="text-yellow-500" />
                                        :
                                        <FaUnlock className="text-primary" />
                                }

                            </div>
                        </div>

                        <div className="flex justify-between ">
                            <p className='text-sm'>Total Claimed : </p>
                            <p className=' !text-highlight'>{parseFloat((contract?.amountClaimed)?.toFixed(2)) + ' $'} </p>
                        </div>
                    </div>
                )
                }


            </div>
            <p className='text-sm'>Using Force Unlock to Withdraw Before Time will Apply 25% Fees instead Of 1 USDT </p>
        </div>
    )
}





function Forced({ contracts }) {

    if (contracts.length == 0) return (
        <div className='flex flex-col  w-full gap-2 border border-primary/10 p-5  rounded backdrop-blur-xl relative overflow-hidden '>
            <BorderEffect />
            <h1 className="text-white">
                No Contract Was Forced Yet !
            </h1>
        </div>
    )

    return (
        <div className="grid gap-5">


            <div className="flex items-center justify-between">

                <h1 className="!text-neutral text-sm" >Investments</h1>
            </div>
            <div className='flex gap-5 flex-wrap   w-full '>
                {contracts?.map((contract, idx) =>
                    <div key={idx} className='flex flex-col max-w-xl w-full gap-2 border border-primary/10 p-5  rounded backdrop-blur-xl relative overflow-hidden '>
                        <BorderEffect />

                        <div className='flex  gap-5 items-center '>

                            <img src='/assets/images/crypto/usdt.svg' alt="" className='w-8 h-8' />
                            <div className='w-full flex justify-between'>
                                <div className='flex flex-col '>
                                    <h1>Tether</h1>
                                    <p className='text-xs'>{parseFloat((contract?.amount).toFixed(2))} USDT</p>
                                    {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}
                                </div>
                                <p className='text-sm !text-highlight'>{formatPrice.format(contract?.profits)} </p>
                            </div>
                        </div>

                        <div className="flex justify-between ">
                            <p className='text-sm'>Status :</p>
                            <p className='text-xs !text-accent flex items-center gap-1 '> Force Claim  <IoIosWarning /> </p>
                        </div>


                        <div className="flex justify-between ">

                            <p className='text-sm'>Claimed At :</p>
                            <div className="flex items-center gap-2">
                                <p className='text-xs'>{timeAgo(contract.updatedAt)}  </p>

                                {
                                    contract?.isLocked ?
                                        <FaLock className="text-yellow-500" />
                                        :
                                        <FaUnlock className="text-primary" />
                                }

                            </div>
                        </div>

                        <div className="flex justify-between ">
                            <p className='text-sm'>Total Claimed : </p>
                            <p className=' !text-highlight'>{parseFloat((contract?.amountClaimed)?.toFixed(2)) + ' $'} </p>
                        </div>

                    </div>
                )
                }
            </div>
        </div>

    )
}