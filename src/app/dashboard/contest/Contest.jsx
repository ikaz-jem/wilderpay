"use client"
import React, { use } from 'react'
import { useQuery } from "@tanstack/react-query"



import { RiFundsBoxFill } from "react-icons/ri";
import { RiDiscountPercentFill } from "react-icons/ri";
import { FaCoins } from "react-icons/fa";


import { IoArrowForward } from "react-icons/io5";
import { appBaseRoutes } from "@/routes"
import Link from "next/link"

import BorderEffect from "../components/BorderEffect/BorderEffect";
import { ClipLoader } from "react-spinners";
import SaleCountdown from './SaleCountdown';
import { toast } from 'sonner';
import { formatCustomPrice, formatPrice } from '@/app/utils/formatPrice';
import Loading from '../loading';
import RulesModal from './RulesModal';
import PrizesModal from './PrizesModal';

const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link)
    toast.success("copied!")
}




function StatsCard({ data, loadingData }) {


    return (
        <div className='flex flex-col  w-full gap-3 border border-primary/10 p-5  rounded-xl backdrop-blur-xl relative overflow-hidden bg-card '>
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



export default function Contest({ urlParams }) {

    const { data: userData, isLoading, error } = useQuery({
        queryKey: ["contest", 1], // caching key
        queryFn: async () => {
            const res = await fetch(`/api/contest`)
            if (!res.ok) throw new Error("Failed to fetch")
            return res.json()
        },
        enabled: !!urlParams, // only run when params exist
    })




    const cardData = [
        {
            title: 'Your Rank',
            value: `#${userData?.user?.rank}`,
            icon: <FaCoins className="text-neutral text-3xl" />,
            desc: 'Your Current Rank ',
            cta: null
        },
        {
            title: 'Progress',
            value: `${userData?.user?.progress}%`,
            icon: <RiDiscountPercentFill className="text-neutral text-3xl" />,
            desc: 'Progress For Eligibility',
            cta: null
        },
        {
            title: 'Current Score',
            value: `${userData?.user?.combinedScore}USDT`,
            icon: <RiFundsBoxFill className="text-neutral text-3xl" />,
            desc: 'Total Score from Investments and Referrals',
            cta: null
        },
    ]



    function Top50({ data }) {
        if (!data?.leaderboard?.length)
            return <p className="text-white text-sm">No users yet.</p>;

        return (
            <div className="overflow-x-auto w-full">

                <h2 className='text-xl font-semibold'>Top 50</h2>

                <table className="min-w-full text-left border-collapse border border-primary/20 rounded-lg overflow-hidden w-max">
                    <thead className="bg-black/50 backdrop-blur-md border-b border-primary/20">
                        <tr>
                            <th className="px-4 py-3 text-sm font-medium text-white">#</th>
                            <th className="px-4 py-3 text-sm font-medium text-white">Email</th>
                            <th className="px-4 py-3 text-sm font-medium text-white">Total Volume -USDT</th>
                            <th className="px-4 py-3 text-sm font-medium text-white">Investments - USDT</th>
                            <th className="px-4 py-3 text-sm font-medium text-white">Total Score - USDT</th>
                            <th className="px-4 py-3 text-sm font-medium text-white">Progress</th>
                            <th className="px-4 py-3 text-sm font-medium text-white">User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.leaderboard.map((user, idx) => (
                            <tr
                                key={user._id || idx}
                                className={`border-b border-primary/20 ${idx % 2 === 0 ? "bg-black/30" : "bg-black/20"
                                    }`}
                            >
                                <td className="px-4 py-2 text-sm text-primary">{idx + 1}</td>
                                <td className="px-4 py-2 text-sm text-primary break-all">{user.email}</td>
                                <td className="px-4 py-2 text-sm text-primary">{formatCustomPrice(user.totalVolume)} </td>
                                <td className="px-4 py-2 text-sm text-primary">{formatCustomPrice(user.stakingTotal)} </td>
                                <td className="px-4 py-2 text-sm text-primary">{formatCustomPrice(user.combinedScore)} </td>
                                <td className="px-4 py-2 text-sm text-primary">
                                    <div className="w-full bg-white/10 rounded-full h-3 relative">
                                        <div
                                            className="bg-accent h-3 rounded-full"
                                            style={{ width: `${user.progress}%` }}
                                        ></div>
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-sm text-primary">{user.walletIndex}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
    function EligibleUsers({ data }) {
        if (!data?.top10?.length)
            return <p className="text-white text-sm">No users yet.</p>;

        return (
            <div className="overflow-x-auto w-full">

                <h2 className='text-xl font-semibold'>Eligible Users</h2>

                <table className="min-w-full text-left border-collapse border border-primary/20 rounded-lg overflow-hidden w-max">
                    <thead className="bg-black/50 backdrop-blur-md border-b border-primary/20">
                        <tr>
                            <th className="px-4 py-3 text-sm font-medium text-white">#</th>
                            <th className="px-4 py-3 text-sm font-medium text-white">Email</th>
                            <th className="px-4 py-3 text-sm font-medium text-white">Total Volume -USDT</th>
                            <th className="px-4 py-3 text-sm font-medium text-white">Investments - USDT</th>
                            <th className="px-4 py-3 text-sm font-medium text-white">Total Score - USDT</th>
                            <th className="px-4 py-3 text-sm font-medium text-white">Progress</th>
                            <th className="px-4 py-3 text-sm font-medium text-white">User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.top10.map((user, idx) => (
                            <tr
                                key={user._id || idx}
                                className={`border-b border-primary/20 ${idx % 2 === 0 ? "bg-black/30" : "bg-black/20"
                                    }`}
                            >
                                <td className="px-4 py-2 text-sm text-primary">{idx + 1}</td>
                                <td className="px-4 py-2 text-sm text-primary break-all">{user.email}</td>
                                <td className="px-4 py-2 text-sm text-primary">{formatCustomPrice(user.totalVolume)} </td>
                                <td className="px-4 py-2 text-sm text-primary">{formatCustomPrice(user.stakingTotal)} </td>
                                <td className="px-4 py-2 text-sm text-primary">{formatCustomPrice(user.combinedScore)} </td>
                                <td className="px-4 py-2 text-sm text-primary">
                                    <div className="w-full bg-white/10 rounded-full h-3 relative">
                                        <div
                                            className="bg-accent h-3 rounded-full"
                                            style={{ width: `${user.progress}%` }}
                                        ></div>
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-sm text-primary">{user.walletIndex}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }


    if (isLoading) return <Loading />

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5    w-full '>
                {
                    cardData.map((card, idx) => <StatsCard key={idx} data={card} userData={userData?.user} loadingData={isLoading} />)
                }
            </div>

            {/* <div className=" rounded-lg flex gap-5 items-center">
                <a className=" break-all !text-neutral hover:!text-accent text-sm" href={`https://bscscan.com/tx/0xbdf23e608901bdbc2bae9c197fe59573c973a65e135857a93752dad2f9b183d9`} target='_blank' >📜 Ownership Renounced : 0xbdf23e608901bdbc2bae9c197fe59573c973a65e135857a93752dad2f9b183d9 🔥🚀</a>
                <button onClick={() => copyToClipboard('addresses.token')} className="cursor-pointer hover:scale-110 hover:!text-green-500">
                    <IoMdCopy className="text-lg" />
                </button>
            </div> */}


            <div className='flex gap-5 md:flex-row-reverse md:flex-nowrap flex-wrap w-full'>

                <div className='grid w-full gap-3 h-max'>
                  <div className='flex  flex-col md:flex-row gap-5 '>

                    <div className='flex gap-5 items-center justify-center flex-col md:flex-row'>

                        <Jackpot />
                        <Phone />
                    </div>
                    <div className=' w-full h-max items-center justify-center border border-primary/10 p-5  rounded-xl backdrop-blur-xl relative overflow-hidden  bg-black/50'>
                        <BorderEffect />
                        <SaleCountdown />

                    </div>
                  </div>
                    <div className=' w-full h-max space-y-5 items-center justify-center border border-primary/10 p-5  rounded-xl backdrop-blur-xl relative overflow-hidden  bg-black/50'>
                        <BorderEffect />
                        <EligibleUsers data={userData} />
                        <Top50 data={userData} />
                    </div>


                    {/* <div className=' w-full justify-between border border-primary/10 p-5  rounded-xl backdrop-blur-xl relative overflow-hidden space-y-5 bg-card '>
                        <BorderEffect />
                        
                        <p className='text-sm'>Or Send BNB Directly To the Private Sale Contract Address</p>
                        
                        <div className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
                        <a className="text-sm break-all hover:!text-accent" href={`https://bscscan.com/address/${'CONTRACT_ADDRESS'}`} target='_blank' >{'CONTRACT_ADDRESS'}</a>
                        <button onClick={() => copyToClipboard('CONTRACT_ADDRESS')} className="cursor-pointer hover:scale-110 hover:!text-green-500">
                        <IoMdCopy className="text-lg" />
                        </button>
                        </div>
                        </div> */}
                </div>

            </div>
        </>
    )
}



function Jackpot() {

    return (

        <div className='flex flex-col items-center gap-1 p-5 bg-gradient-to-bl from-yellow-600 to-yellow-300 rounded  h-80 w-80'>

            <p className='text-2xl font-bold !text-red-500 text-center uppercase'>Biggest Prize !!</p>

            <img src="/assets/images/car.webp" className='w-60' alt="" />
            <p className='text-xl font-bold !text-red-500 text-center'>mercedes benz GLE 350 Coupe</p>
            <p className='text-xl font-bold !text-red-500 text-center'>1 Winner - 100K Score</p>
            <div className='flex gap-2 items-center '>

                <RulesModal />
                <PrizesModal />
            </div>
        </div>

    )

}
function Phone() {

    return (

        <div className='flex flex-col items-center gap-1 p-5 bg-gradient-to-bl from-yellow-600 to-yellow-300 rounded  h-80 w-80'>


            <img src="/assets/images/phone.webp" className='w-40' alt="" />
            <p className='text-xl font-bold !text-red-500 text-center'>IPHONE 17 Pro Max</p>
            <p className='text-xl font-bold !text-red-500 text-center'>10 Winners</p>
            <div className='flex gap-2 items-center'>

                <RulesModal />
                <PrizesModal />
            </div>
        </div>

    )

}