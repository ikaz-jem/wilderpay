"use client"

//   const binancePrice = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT').then(res => res.data);
//   console.log({ binancePrice })

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import clsx from 'clsx'
import { useEffect, useState, useTransition } from 'react'
import { FaChevronDown } from "react-icons/fa";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { RiBnbFill } from "react-icons/ri";
import ButtonPrimary from '@/app/components/ButtonPrimary';

import { currencies } from './data';



import {  useSession } from 'next-auth/react';

import axios from 'axios';
import { toast } from 'sonner';
import ButtonSecondary from '@/app/components/ButtonSecondary';
import BorderEffect from '../components/BorderEffect/BorderEffect';
import { withdrawAction } from '@/actions/withdraw/withdrawAction';
import { isAddress } from 'viem';
import Loading from '../loading';


function CryptoPayment() {
    const session = useSession()

    const [selected, setSelected] = useState(currencies[0])
    const [amount, setAmount] = useState("")
    const [address, setAddress] = useState("")
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        if (!selected?.address) {
            handleSelect(currencies[0])
        }
    }, [session?.user?.walletIndex, session?.status]);


    
    const handleSelect = async (e) => {
        startTransition(async () => {
            const balance = await axios.get(`/api/balance?currency=${e?.symbol}`).then((res) => res.data)
            const data = {
                ...e,
                balance: balance?.success ? Number(balance?.currencyBalance?.amount) : 0,
                disabled: balance?.success && Number(balance?.currencyBalance?.amount) > 0 ? false : true
            }
            setSelected(data)
        })
    }


    const withdrawFunds = async (e) => {
        
        startTransition(async () => {
            if (selected?.balance < 10 || Number(amount) < 10) {
                return toast.warning('Min Withdraw is 10 USDT')
            }
            const validAddress = isAddress(address)
            if (!validAddress) return toast.error('Wallet Address Is invalid')
             toast.info('Withdraw is Processing ! Please Wait ...')
            const data = await withdrawAction(Number(amount), address, selected.chain , process.env.NEXT_PUBLIC_SECRET)
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.warning(data.message)
            }
        })

        e.preventDefault()
    }

    const amountChange = async (e) => {
        e.preventDefault()
        if (e.target.value >= selected.balance) {
            setAmount(parseFloat(selected?.balance.toFixed(2)))

        } else {
            setAmount(e.target.value)
        }
    }





    return (

        <div className="mx-auto space-y-5 w-full p-5 relative overflow-hidden">

            {
                isPending && <div className='absolute top-0 left-0 backdrop-blur w-full h-full flex items-center justify-center z-10'>
                    <Loading />

                </div>
            }
            <p className='text-sm font-semibold'>Select Currency</p>

            <Listbox value={selected} onChange={handleSelect}>
                <ListboxButton
                    className={clsx(
                        'relative flex gap-2 items-center w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white ',
                    )}
                >
                    <img src={selected?.icon} alt="" className='w-5 h-5' />
                    {selected.name}

                    <FaChevronDown
                        className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                        aria-hidden="true"
                    />
                    <p className='text-sm font-semibold'>{(selected?.price)?.toFixed(2)}</p>


                </ListboxButton>
                <ListboxOptions
                    anchor="bottom"
                    transition
                    className={clsx(
                        'w-(--button-width) backdrop-blur z-5 rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)] ',
                        'transition duration-100 ease-in data-leave:data-closed:opacity-0'
                    )}
                >
                    {currencies.map((person) => (
                        <ListboxOption
                            key={person.name}
                            value={person}
                            className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                        >
                            <img src={person?.icon} alt="" className='w-5 h-5' />
                            <div className="text-sm/6 text-white">{person.name}</div>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </Listbox>

            <div className=' gap-5 grid space-y-5 relative'>
                <div className='grid gap-3'>
                    <div className='flex justify-between'>

                        <p className='text-sm font-semibold'>Amount</p>
                        <div className='flex items-center gap-2 justify-center'>
                            <p className='text-sm'>Available :</p>
                            <p className='text-sm'>{parseFloat(selected.balance?.toFixed(2)) || 0}</p>
                            <p className='text-sm'>{(selected.symbol)?.toUpperCase()}</p>
                            <img src={selected?.icon} alt="" className='w-5 h-5' />

                        </div>
                    </div>
                    <div className='bg-white/10 rounded flex justify-between  items-center'>

                        <input
                            className=' aria-selected:bg-none auto text-white rounded h-full w-full p-3 text-sm outline-none  disabled:cursor-not-allowed disabled:bg-transparent'
                            name="amount"
                            type="number"
                            placeholder={`${selected?.symbol?.toUpperCase()} Amount`}
                            onChange={amountChange}
                            value={amount}
                            min={0.01}
                            step={0.01}
                            max={selected?.balance}
                            required
                            disabled={selected?.disabled}
                        />
                        <div className='flex flex-col gap-1'>
                            <ButtonSecondary disabled={selected?.disabled} onClick={(e) => setAmount(selected?.balance)} >Max</ButtonSecondary>
                        </div>
                    </div>


                    <p className='text-sm font-semibold'>Wallet Address</p>


                    <div className='bg-white/10 rounded flex justify-between  items-center'>

                        <input
                            className=' aria-selected:bg-none auto text-white rounded h-full w-full p-3 text-sm outline-none  disabled:cursor-not-allowed disabled:bg-transparent'
                            name="address"
                            type="text"
                            placeholder={`Wallet Public Key`}
                            onChange={(e) => setAddress(e.target.value)}
                            value={address}
                            required
                            disabled={selected?.disabled}
                        />

                    </div>
                </div>


                {

                    <div className='w-full space-y-5 flex items-center justify-center flex-col'>
                        {selected.balance == 0 && <p className='text-sm !text-red-500 '>insuffisant balance</p>}

                        <ButtonPrimary disabled={selected?.disabled || amount == 0} onClick={(e) => withdrawFunds(e)} className={'w-max px-4'}>Withdraw</ButtonPrimary>
                    </div>
                }
            </div>
            {/* <div className='flex justify-between items-center'>

                <p className='text-xs '>+1 USDT Processing Fees</p>
                {Number(amount) >= 50 && <p className='text-xs '>will recieve : {amount - 1} USDT</p>}
            </div> */}
        </div>
    )
}



export default function page() {


    function DeopsitTypes() {
        return (
            <div className="flex  w-full justify-center  pt-5">
                <div className="w-full ">
                    <TabGroup>
                        <TabList className="flex gap-4">
                            <Tab
                                className="rounded-full flex gap-2 items-center px-3 py-1 text-sm/6 font-semibold text-white   data-hover:bg-white/5 data-selected:bg-white/10 data-selected:data-hover:bg-white/10">
                                <RiBnbFill className='text-lg' />
                                <p className='text-white'>Withdraw Earnings</p>
                            </Tab>
                        </TabList>
                        <TabPanels className="mt-3">
                            <TabPanel className="rounded-xl bg-card backdrop-blur-xl relative ">
                                <BorderEffect />
                                <CryptoPayment />
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </div>
            </div>
        )
    }



    return (
        <>
            <div className='max-w-lg mx-auto'>


                <DeopsitTypes />
                    <p className=' p-5'>0% Withdraw Fees</p>

            </div>

        </>
    )
}