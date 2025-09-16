"use client"

import { FaLevelDownAlt } from "react-icons/fa";
import BorderEffect from "../../components/BorderEffect/BorderEffect";
import { IoPersonAdd } from 'react-icons/io5';
import { FaChevronDown } from "react-icons/fa";

import clsx from 'clsx'


import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { coinIcon } from "../../staticData";
import { useEffect, useState, useTransition } from "react";
import axios from "axios";
import Loading from "../../loading";
import { formatCustomPrice } from "@/app/utils/formatPrice";
import { formatISO } from "@/app/utils/formatISO";

export default function TransactionHistory() {
    const [transactions, setTransaction] = useState(null)
    const [query, setQeury] = useState("")
    const [isPending, startTransition] = useTransition()


    async function getTransactions() {

        startTransition(async () => {

            try {
                const res = await axios.get(`/api/account/transactions${query}`).then((res) => res.data)
                setTransaction(res?.transactions)
            } catch (err) {
                console.log(err)
            }
        })
    }


    useEffect(() => {
        getTransactions()
    }, [query])


    function handleQuery(e) {
        if (e == query) return
        setQeury(e)
    }





    function Filter() {



        return (
            <div className="w-full max-w-md px-4">
                <Listbox value={query} onChange={handleQuery}>
                    <ListboxButton
                        className={clsx(
                            'relative flex gap-2 items-center w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white uppercase ',
                        )}
                    >

                        {query?.split('=')?.[1] || "All Transactions"}

                        <FaChevronDown
                            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                            aria-hidden="true"
                        />


                    </ListboxButton>
                    <ListboxOptions
                        anchor="bottom"
                        transition
                        className={clsx(
                            'w-(--button-width) backdrop-blur z-5 rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)] ',
                            'transition duration-100 ease-in data-leave:data-closed:opacity-0'
                        )}
                    >

                        <ListboxOption
                            value=''
                            className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                        >
                            <div className="text-sm/6 text-white uppercase">All</div>
                        </ListboxOption>
                        <ListboxOption
                            value='?type=rebate'
                            className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                        >
                            <div className="text-sm/6 text-white uppercase">Rebates</div>
                        </ListboxOption>
                        <ListboxOption
                            value='?type=referral bonus'
                            className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                        >
                            <div className="text-sm/6 text-white uppercase">Referral Bonus</div>
                        </ListboxOption>
                        <ListboxOption
                            value='?type=deposit'
                            className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                        >
                            <div className="text-sm/6 text-white uppercase">Account Deposit</div>
                        </ListboxOption>
                        <ListboxOption
                            value='?type=withdrawals'
                            className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                        >
                            <div className="text-sm/6 text-white uppercase">withdrawals</div>
                        </ListboxOption>

                    </ListboxOptions>
                </Listbox>
            </div>
        )
    }




    return (
        <>

            <div className="p-5 mx-auto  space-y-5 w-full backdrop-blur-xl bg-card rounded border border-primary/10 relative">
                <BorderEffect />

                <div className="flex flex-col justify-center gap-5">
                    <h1 className="text-lg tracking-wider uppercase">Transaction History : </h1>

                    <div className="flex items-center gap-2">

                        <p className=" text-xs !text-neutral w-full">Filter By :</p>

                        <Filter />

                    </div>

                </div>



                {isPending || !transactions ? <Loading /> :
                    <>

                        {transactions && transactions?.length > 0 ? (
                            <div className="space-y-3 h-80 overflow-y-scroll ">
                                <div className="text-sm space-y-1">
                                    {transactions?.map((transaction, i) => (

                                        <div key={i} className="bg-white/5 rounded py-3 flex justify-between items-center px-5 ">
                                            <div className="flex items-center gap-2 justify-between w-full ">
                                                <div className="flex gap-2 items-center ">
                                                    <img src={coinIcon[transaction.currency]} className="w-5 h-5" alt="" />
                                                    {/* <p className={`!text-xs truncate uppercase '`}>{transaction?.currency || ''}</p> */}

                                                    <div className="flex flex-col md:flex-row md:items-center gap-1">
                                                        <p className={`!text-xs truncate capitalize !text-green-500 '`}>{transaction?.depositType || ''}</p>


                                                        {transaction?.signature && <p className={`!text-xs truncate capitalize max-w-40 '`}>{transaction?.signature || ''}</p> }
                                                       
                                                        <p className={`!text-xs truncate capitalize !text-orange-500/50`}>{formatISO(transaction?.createdAt) || ''}</p>
                                                    </div>

                                                    {/* <p className={`!text-xs truncate capitalize !text-orange-500/50 '`}>{formatISO(user?.createdAt) || ''}</p> */}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p className={`!text-xs truncate capitalize hidden`}>{transaction?.status || ''}</p>
                                                    <p className={`!text-xs truncate uppercase !text-green-500`}>{formatCustomPrice(transaction?.amount, 8) || ''} {transaction?.currency || ''}</p>
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
                    </>}
            </div>

        </>
    )

}


