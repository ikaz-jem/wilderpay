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


import { useSession } from 'next-auth/react';

import axios from 'axios';
import { toast } from 'sonner';
import ButtonSecondary from '@/app/components/ButtonSecondary';
import BorderEffect from '../components/BorderEffect/BorderEffect';
import { useRouter } from 'next/navigation';
import { getPrices } from '../invest/getPrices';
import Loading from '@/app/components/Loading';
import { formatCustomPrice } from '@/app/utils/formatPrice';
import { coinIcon,symbols } from '../staticData';





function CryptoPayment() {
    const session = useSession()
    const router = useRouter()
    const user = session?.data?.user

    const [selected, setSelected] = useState(currencies[0])
    const [amount, setAmount] = useState("")
    const [isPending, startTransition] = useTransition()

    const [coins, setCoins] = useState([])
    const [selectedCoin, setSelectedCoin] = useState([])
    const [loadingData, setLoadingData] = useState(true)
    const [noBalance, setNoBalance] = useState(false)




    useEffect(() => {
        getBalances()
        // getBalance()
    }, [session?.user?.walletIndex, session?.status]);



    // async function getBalance() {
    //     const balance = await axios.get('/api/balance?currency=usdt').then((res) => res.data)
    //     if (balance.success) {
    //         if (balance.currencyBalance?.amount > 0) {
    //             setBalance(balance.currencyBalance.amount)
    //         }
    //     }
    // }

    async function getBalances() {
        const balance = await axios.get('/api/balance').then((res) => {
            const curr = res.data.currencyBalance.filter((coin) =>  coin.currency !== "usdt")
            res.data.currencyBalance = curr
            return res.data
        })
        if (balance.currencyBalance.length == 0) {
            setLoadingData(false)
            setNoBalance(true)
            return
        }

        let prices
        let tickers = []
        for (let i = 0; i < balance.currencyBalance.length; i++) {
            if (balance.currencyBalance[i].currency == "yieldium" || balance.currencyBalance[i].currency == "usdt" ||  balance.currencyBalance[i].currency == "usdc" ) {
                continue
            }
            tickers.push(symbols[balance.currencyBalance[i].currency])
        }
                        if (tickers.length >0) {
                        prices = await getPrices(tickers)
                        }
                 
          
                  for (let i = 0; i < balance.currencyBalance.length; i++) {
                      if (balance.currencyBalance[i].currency == "yieldium") {
                          balance.currencyBalance[i].price = 0.01
                          continue
                      }
                      if (balance.currencyBalance[i].currency == "usdt" || balance.currencyBalance[i].currency == "usdc") {
                          balance.currencyBalance[i].price = 1
                          continue
                      }
                      balance.currencyBalance[i].price = Number(prices?.filter((coin) => coin.symbol == symbols[balance.currencyBalance[i].currency])?.[0].price)
                  }
    


        if (balance.success) {

            setCoins(balance.currencyBalance)
            setSelectedCoin(balance.currencyBalance[0])
            setLoadingData(false)
        }
    }

    const handleSelect = async (e) => {

        const coin = coins.filter((coin) => coin.currency == e)
        setSelectedCoin(...coin)

    }




    const convert = async (e) => {
        if (selected?.conversion < 5) {
            toast.error('Minimum Amount For conversion is 5 USDT')
            return
        }

        e.preventDefault()
        startTransition(async () => {

            let res = await axios.post('/api/convert', {
                from: selectedCoin?.currency,
                to: "usdt",
                amount: amount,
                pair: symbols[selectedCoin?.currency]
            }).then((res) => res.data)
            if (res.success) {
                toast.success(
                    res.message
                )
                router.refresh()

            } else {
                toast.error(
                    res.message
                )

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
            <p className='text-sm font-semibold capitalize'>no coins to convert ...</p>

        </div>

    )


    return (

        <div className="mx-auto space-y-5 w-full p-5 relative overflow-hidden">


            {

                loadingData ?
                    <Loading />
                    :





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
                            <p className='text-sm'>{selectedCoin?.price} $</p>

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
                                    'relative flex gap-2 items-center w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white uppercase ',
                                )}
                            >
                                <img src={coinIcon[selectedCoin?.currency]} alt="" className='w-5 h-5' />
                                {selectedCoin?.currency}

                                <FaChevronDown
                                    className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                                    aria-hidden="true"
                                />
                                <p className='text-sm font-semibold'>{(selectedCoin?.price)?.toFixed(2)}$</p>


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
                                        value={coin?.currency}
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
                                        <p className='text-sm'>{formatCustomPrice(selectedCoin?.amount) || 0}</p>
                                        <p className='text-sm'>{(selectedCoin?.currency)?.toUpperCase()}</p>
                                        <img src={coinIcon[selectedCoin?.currency]} alt="" className='w-5 h-5' />

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
                                        disabled={selectedCoin?.disabled}
                                    />
                                    <div className='flex flex-col gap-1'>
                                        <ButtonSecondary disabled={selectedCoin?.disabled} onClick={(e) => setAmount(selectedCoin?.amount)} >Max</ButtonSecondary>
                                    </div>
                                </div>
                            </div>



                            <div className='w-full space-y-5 flex items-center justify-center flex-col'>
                                <div className='flex gap-5 items-center'>

                                    <img src={coinIcon[selectedCoin?.currency]} alt="" className='w-10 h-10' />
                                    <FaRightLeft className='text-lg !text-neutral' />
                                    <img src='/assets/images/crypto/usdt.svg' alt="" className='w-10 h-10' />
                                </div>
                                {<p className='text-xl '> {formatCustomPrice((selectedCoin?.price * amount))} USDT   </p>}
                            </div>



                            {

                                <div className='w-full space-y-5 flex items-center justify-center flex-col'>
                                    {selectedCoin.balance == 0 && <p className='text-sm !text-red-500 '>insuffisant balance</p>}

                                    <ButtonPrimary disabled={selectedCoin?.amount == 0} onClick={(e) => convert(e)} className={'w-max px-4'}>Convert</ButtonPrimary>
                                </div>
                            }
                        </div>
                        <p className='text-sm '>+0.25% conversion fees</p>
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
                                <p className='text-white'>Swap</p>
                            </Tab>
                        </TabList> */}
                        <TabPanels className="mt-3"> 
                            <TabPanel className="rounded-xl bg-card backdrop-blur-xl border border-primary/10 ">

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