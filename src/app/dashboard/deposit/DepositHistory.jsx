


import axios from 'axios'
import React, { useEffect, useState, useTransition } from 'react'
import {ClipLoader} from 'react-spinners'
import { FaCheck } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";


export default function DepositHistory() {
    const [deposits, setDeposits] = useState(null)
    const [isPending, startTransition] = useTransition()

    async function getDeposits() {
        startTransition(async () => {
            const deposits = await axios.get('/api/deposits').then((res) => res.data)
            setDeposits(deposits)
        })
    }

    useEffect(() => {
        getDeposits()
    }, [])


    function extractClassName(status) {
        if (status == "pending") {
            return "!text-yellow-400 border border-yellow-500 bg-yellow-500/10"
        }
        if (status == "credited") {
            return "!text-green-400 border border-green-500 bg-green-500/10"
        }
        if (status == "canceled") {
            return "!text-red-400 border border-red-500 bg-red-500/10"
        }
        if (status == "error") {
            return "!text-red-400 border border-red-500 bg-red-500/10"
        }
    }


    function DepositCard({ deposit }) {
        return (
            <div className='w-full border-primary/50  rounded  p-2  backdrop-blur-xl bg-card'>
                <div className='flex items-basline gap-2'>
                    <FaCheck className='text-4xl text-green-500 bg-green-500/10 border-green-500/50 rounded-full p-2' />
                    <div className='flex flex-col gap-1   w-full'>
                        <div className='flex w-full justify-between'>

                            <h1 className='text-white '>{deposit?.amount} {deposit?.currency} <span className='text-xs capitalize'> {deposit?.chain}</span> </h1>
                            <p className={` ${extractClassName(deposit?.status)} rounded px-2 p-1 !text-[12px] w-max '`}>{deposit?.status}</p>
                        </div>
                        <p className={`   !text-xs w-40 truncate '`}>{deposit?.signature}</p>
                         {  deposit?.depositType &&   <div className='flex items-center gap-2'>
                        <IoPersonAdd className='text-neutral'/>
                        <p className={`   !text-xs w-40 truncate '`}>{deposit?.depositType || ''}</p>
                        </div>}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='pb-20 space-y-5'>
            <h1 className='text-2xl text-white '>
                Deposit History
            </h1>
            {
                isPending ?
                    <div className='w-full space-y-5 flex items-center justify-center  h-40'>
                        <ClipLoader className='text-xs' color='var(--title)' size={25} />
                    </div>
                    :
                    <div className='w-full  flex flex-col gap-5'>
                        {
                            deposits?.length > 0 && deposits?.map((deposit) => <DepositCard key={deposit?._id} deposit={deposit} />)
                        }
                    </div>
            }
        </div>
    )
}
