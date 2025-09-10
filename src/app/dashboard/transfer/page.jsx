"use client"

//   const binancePrice = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT').then(res => res.data);
//   console.log({ binancePrice })

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import clsx from 'clsx'
import { useEffect, useState, useTransition } from 'react'
import { FaChevronDown } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { RiBnbFill } from "react-icons/ri";
import ButtonPrimary from '@/app/components/ButtonPrimary';
import { IoMdCopy } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import {
    ClipLoader
} from 'react-spinners'
import { currencies } from './data';

import { FaRightLeft } from "react-icons/fa6";


import { signIn, useSession } from 'next-auth/react';

import axios from 'axios';
import { toast } from 'sonner';
import ButtonSecondary from '@/app/components/ButtonSecondary';
import BorderEffect from '../components/BorderEffect/BorderEffect';
import { withdrawAction } from '@/actions/withdraw/withdrawAction';
import { transferAction } from '@/actions/transfer/transferAction';
import { formatCustomPrice } from '@/app/utils/formatPrice';
import Loading from '@/app/components/Loading';
import { coinIcon,symbols } from '../staticData';





function CryptoPayment() {
    const session = useSession()
    const user = session?.data?.user

    const [selected, setSelected] = useState(currencies[0])
    const [amount, setAmount] = useState("")
    const [email, setEmail] = useState("")
    const [isPending, startTransition] = useTransition()
    const [selectedCoin, setSelectedCoin] = useState([])
    const [loadingData, setLoadingData] = useState(true)
    const [coins, setCoins] = useState([])
    const [noBalance, setNoBalance] = useState(false)




    useEffect(() => {

        getBalances()



    }, [session?.user?.walletIndex, session?.status]);

    function validateEmail(email) {
        // Regex pattern to validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Test the email against the regex
        return emailRegex.test(email);
    }
    const handleSelect = async (e) => {
        const coin = coins.filter((coin) => coin.currency == e)
        setSelectedCoin(...coin)
    }






    async function getBalances() {
        const balance = await axios.get('/api/balance').then((res)=>res.data)
        if (balance.success) {
            if (balance.currencyBalance.length == 0) {
                setNoBalance(true)
                return
            }
            setCoins(balance.currencyBalance)
            setSelectedCoin(balance.currencyBalance[0])
            setLoadingData(false)
        }
    }















    const TransferFunds = async (e) => {

        const isValidEmail = validateEmail(email)
        if (!isValidEmail) {
            return toast.error('invalid Email')
        }

        startTransition(async () => {
            const data = await transferAction(email, amount,selectedCoin?.currency,process.env.NEXT_PUBLIC_SECRET)
            if (data.success) {
                toast.success(data.message)
            }
            if (!data.success) {
                toast.error(data.message)
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



    if (noBalance) return (
        <div className="mx-auto space-y-5 w-full p-5 relative overflow-hidden">
            <p className='text-sm font-semibold capitalize'>no coins yet to transfer ...</p>

        </div>

    )


    function disableButton () {

        if (amount == 0) {
            return true
        }
        if (Number(amount) >selectedCoin?.amount){
            return true
        }
        return false
    }


    return (

        <div className="mx-auto space-y-5 w-full p-5 relative overflow-hidden">
            {
                loadingData ? <Loading /> :



                    <>


                        <div className='flex justify-between items-center'>

                            <div className='flex gap-2 items-end  '>
                                <img src={coinIcon[selectedCoin?.currency]} className='w-10 h-10' alt="" />
                                <div className='flex flex-col '>
                                    <p className='text-xs  !text-primary'>Balance</p>
                                    <p className='text-xl  font-semibold uppercase'>{formatCustomPrice(selectedCoin?.amount)} {selectedCoin?.currency}</p>
                                </div>
                            </div>

                            {/* <div className='flex flex-col gap-1 items-end'>
                                <AutoCompoundSwitch enabled={auto} setEnabled={setAuto} />
                                <p className={clsx('  text-[10px] bg-green-500/20 rounded border  w-max p-1', auto ? "!text-green-500 border-green-500 bg-green-500/20 " : "border-red-500 bg-red-500/20 !text-red-500")}>+0.5 % auto Compound {auto ? "ON" : "OFF"} </p>
                                </div> */}

                        </div>

                        {
                            isPending && <div className='absolute top-0 left-0 backdrop-blur w-full h-full flex items-center justify-center z-10'>
                                <ClipLoader className='text-xl' color='var(--title)' size={30} />

                            </div>
                        }
                        <p className='text-sm font-semibold'>Select Currency</p>

                        <Listbox value={selectedCoin} onChange={handleSelect}>
                            <ListboxButton
                                className={clsx(
                                    'relative flex gap-2 items-center w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white ',
                                )}
                            >
                                <img src={coinIcon[selectedCoin?.currency]} alt="" className='w-5 h-5' />
                                {selectedCoin.currency}

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
                                {coins.map((coin) => (
                                    <ListboxOption
                                        key={coin._id}
                                        value={coin.currency}
                                        className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                                    >
                                        <img src={coinIcon[coin.currency]} alt="" className='w-5 h-5' />
                                        <div className="text-sm/6 text-white uppercase">{coin.currency}</div>
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
                                        <p className='text-sm'>{formatCustomPrice(selectedCoin.amount) || 0}</p>
                                        <p className='text-sm'>{(selectedCoin.currencty)?.toUpperCase()}</p>
                                        <img src={coinIcon[selectedCoin.currency]} alt="" className='w-5 h-5' />

                                    </div>
                                </div>
                                <div className='bg-white/10 rounded flex justify-between  items-center'>

                                    <input
                                        className=' aria-selected:bg-none auto text-white rounded h-full w-full p-3 text-sm outline-none  disabled:cursor-not-allowed disabled:bg-transparent'
                                        name="amount"
                                        type="number"
                                        placeholder={`${selectedCoin?.currency?.toUpperCase()} Amount`}
                                        onChange={amountChange}
                                        value={amount}
                                        min={0.01}
                                        step={0.01}
                                        max={selectedCoin?.amount}
                                        required
                                        disabled={false}
                                    />
                                    <div className='flex flex-col gap-1'>
                                        <ButtonSecondary disabled={false} onClick={(e) => setAmount(selectedCoin?.amount)} >Max</ButtonSecondary>
                                    </div>
                                </div>


                                <p className='text-sm font-semibold'>Email Address</p>


                                <div className='bg-white/10 rounded flex justify-between  items-center'>

                                    <input
                                        className=' aria-selected:bg-none auto text-white rounded h-full w-full p-3 text-sm outline-none  disabled:cursor-not-allowed disabled:bg-transparent'
                                        name="email"
                                        type="text"
                                        placeholder={`user Email`}
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        required
                                        disabled={false}
                                    />

                                </div>
                            </div>


                            {

                                <div className='w-full space-y-5 flex items-center justify-center flex-col'>
                                    {selectedCoin.amount == 0 && <p className='text-sm !text-red-500 '>insuffisant balance</p>}

                                    <ButtonPrimary disabled={disableButton()} onClick={(e) => TransferFunds(e)} className={'w-max px-4'}>Withdraw</ButtonPrimary>
                                </div>
                            }
                        </div>
                        <div className='flex justify-between items-center'>

                            <p className='text-xs '>+1 USDT Processing Fees</p>
                            {Number(amount) >= 50 && <p className='text-xs '>will recieve : {amount - 1} USDT</p>}
                        </div>
                    </>

            }
        </div>
    )
}



export default function page() {


    function DeopsitTypes() {
        return (
            <div className="flex  w-full justify-center  pt-5">
                <div className="w-full ">
                    <TabGroup>
                        {/* <TabList className="flex gap-4">
                            <Tab
                                className="rounded-full flex gap-2 items-center px-3 py-1 text-sm/6 font-semibold text-white   data-hover:bg-white/5 data-selected:bg-white/10 data-selected:data-hover:bg-white/10">
                                <RiBnbFill className='text-lg' />
                                <p className='text-white'>Transfer Between Accounts</p>
                            </Tab>
                        </TabList> */}
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
            </div>

        </>
    )
}