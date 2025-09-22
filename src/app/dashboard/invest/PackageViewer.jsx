"use client"

//   const binancePrice = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT').then(res => res.data);
//   console.log({ binancePrice })

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import clsx from 'clsx'
import { useEffect, useState, useTransition } from 'react'
import { FaChevronDown } from "react-icons/fa";
import ButtonPrimary from '@/app/components/ButtonPrimary';
import ButtonSecondary from '@/app/components/ButtonSecondary';

import { useSession } from 'next-auth/react';

import axios from 'axios';
import { toast } from 'sonner';
import { useMemo } from 'react';
import BalanceChart from '../components/charts/BalanceChart';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { appBaseRoutes } from '@/routes';
import { getPrices } from './getPrices';
import Loading from '@/app/components/Loading';
import { formatCustomPrice } from '@/app/utils/formatPrice';
import { coinIcon, symbols } from '../staticData';
import ActivateAccount from '../components/ActivateAccount/ActivateAccount';



function dayToYear(targetDays) {
    const months = targetDays / 30
    return `${months} Months`
}

const tickers = [symbols.sol, symbols.btc, symbols.eth, symbols.bnb, symbols.matic, symbols.xrp]

export async function getCoinsPrices(tickers) {
    let symbols = JSON.stringify(tickers);
    let endpoint = `https://api.binance.com/api/v3/ticker/price?symbols=${symbols}`;
    let prices = await axios.get(endpoint).then((res) => res.data);
    return prices;
}


const days = [90, 180, 360, 720];
const minStake = 20 // 20$ min investment


export default function PackageViewer() {
    const session = useSession()
    const user = session?.data?.user
    const router = useRouter()


    const [amount, setAmount] = useState(200)
    const [isPending, startTransition] = useTransition()
    const [balance, setBalance] = useState(0)
    const [coins, setCoins] = useState([])
    const [selected, setSelected] = useState(days[days.length - 1])
    const [auto, setAuto] = useState(false)
    const [selectedCoin, setSelectedCoin] = useState([])
    const [loadingData, setLoadingData] = useState(true)
    const [roiPercent, setRoiPercent] = useState(true)
    const [userData, setUserData] = useState(false)



    const ROI_PERCENT = roiPercent?.today?.percentage
    const YIELDIUM_PERCENT = 0.05

    const [stats, setStats] = useState({
        roi: 0.1,
        returns: 0,
        total: 0

    })

    async function getPercent() {
        // retrieving percentage and earnings
        const percentage = await axios.get('/api/earnings').then((res) => res.data)
        setRoiPercent(percentage?.percentage)

    }

    async function getUser() {
        // retrieving percentage and earnings
        const res = await axios.get(`/api/users?id=${user?.id}`).then((res) => res.data.data)
        return res
    }


    async function getBalance() {
        const percent = await getPercent()
        const balance = await axios.get('/api/balance?currency=usdt').then((res) => res.data)
        if (balance.success) {
            if (balance.currencyBalance?.amount > 0) {
                setBalance(balance.currencyBalance.amount)
            }
        }
    }


    async function getBalances() {
        let user = await getUser()
        const balance = await axios.get('/api/balance').then((res) => {
            if (user?.verified) {
                const curr = res.data.currencyBalance.filter((coin) => coin.currency !== "yieldium")
                res.data.currencyBalance = curr
            }
            return res.data
        })

        let tickers = []
        for (let i = 0; i < balance.currencyBalance.length; i++) {
            if (balance.currencyBalance[i].currency == "yieldium" || balance.currencyBalance[i].currency == "usdt" | balance.currencyBalance[i].currency == "usdc") {
                continue
            }
            tickers.push(symbols[balance.currencyBalance[i].currency])
        }



        // not fetching prices if user has only usdt or yieldium
        const haveBalance = balance.currencyBalance.filter((coin) => coin.currency !== "usdt" && coin.currency !== "usdc")
        if (haveBalance.length > 0) {

            let prices = await getPrices(tickers)

            for (let i = 0; i < balance.currencyBalance.length; i++) {
                if (balance.currencyBalance[i].currency == "yieldium") {
                    balance.currencyBalance[i].price = 0.01
                    balance.currencyBalance[i].convertedAmount = 0.01 * balance.currencyBalance[i].amount
                    continue
                }
                if (balance.currencyBalance[i].currency == "usdt" || balance.currencyBalance[i].currency == "usdc") {
                    balance.currencyBalance[i].convertedAmount = 1 * balance.currencyBalance[i].amount
                    balance.currencyBalance[i].price = 1
                    continue
                }
                balance.currencyBalance[i].price = Number(prices?.filter((coin) => coin.symbol == symbols[balance.currencyBalance[i].currency])?.[0].price)
                balance.currencyBalance[i].convertedAmount = Number(prices?.filter((coin) => coin.symbol == symbols[balance.currencyBalance[i].currency])?.[0].price) * balance.currencyBalance[i].amount
            }

        }


        if (balance.success) {
            user.balances = balance.currencyBalance
            setCoins(balance.currencyBalance)
            setSelectedCoin(balance.currencyBalance[0])
            setLoadingData(false)
            setUserData(user)
        }
    }




    function calculateInvestmentProfits() {
        let percent = ROI_PERCENT
        let dailyPercent = (percent * Number(amount)) / 100
        let result = dailyPercent * selected
        if (isNaN(result) || result == 0) { return 0 }
        let formated = parseFloat(Number(result.toFixed(2)))
        return Number(formated)
    }



    useEffect(() => {
        if (!balance && user) {
            getBalance()
            getBalances()
        }
    }, [user])


    useEffect(() => {
        if (selected && amount) {
            calculateCompoundInterest(amount, 0.5, selected)
        }
    }, [selected, amount])


    // const data = useMemo(() => {

    //     let coinAmount = amount == "" ? 100 : amount

    //     const points = [];
    //     let compoundedBalance = Number(coinAmount); // only compound this
    //     let flatProfitTotal = 0; // track flat daily profits separately

    //     const percent = ROI_PERCENT; // e.g., 2%
    //     const extraDailyProfit = (percent * coinAmount) / 100; // e.g., 30

    //     for (let i = 0; i <= selected; i++) {
    //         const totalBalance = auto ? compoundedBalance + flatProfitTotal : flatProfitTotal + coinAmount;

    //         points.push({
    //             date: `Day ${i}`,
    //             balance: Number(totalBalance.toFixed(2)),
    //         });

    //         // Apply only 0.5% daily compound to the compoundedBalance
    //         compoundedBalance *= 1 + 0.5 / 100;

    //         // Add fixed daily profit separately (not compounded)
    //         flatProfitTotal += extraDailyProfit;
    //     }

    //     return points;
    // }, [selected, amount, auto, selectedCoin]);

    function calculateCompoundInterest(initialAmount, dailyRatePercent, days) {
        const dailyRate = dailyRatePercent / 100;
        const finalAmount = initialAmount * Math.pow((1 + dailyRate), days);
        const roi = ((finalAmount - initialAmount) / initialAmount) * 100;
        if (isNaN(roi)) {
            return
        }
        setStats({
            roi: roi.toFixed(2),
            total: finalAmount.toFixed(2),
            returns: (Number(finalAmount) - initialAmount).toFixed(2)
        })
        return {
            finalAmount: finalAmount.toFixed(2),
            roi: roi.toFixed(2)
        };
    }




    const amountChange = async (e) => {
        e.preventDefault()
        if (e.target.value == 0) {
            setAmount('')
            return 

        }
        setAmount(Number(e.target.value))
        // if (e.target.value >= balance) {
        //     setAmount(Number(balance.toFixed(2)))

        // } else {
        //     setAmount(Number(e.target.value))
        // }
    }


    function eligibleToStake () {
        const totalPrice = selectedCoin?.price * amount
        if (totalPrice >=minStake) {
            return true
        }
        return false

    }


    
    async function Stake() { 

            const eligible = eligibleToStake()

            if (!eligible) {
                return toast.error('Minimum investment is 20$')
            }

        if (Number(amount) > Number(selectedCoin?.amount)) {
            toast.error('Insuffisant Balance ')
            return
        }
        startTransition(async () => {
            let profits = calculateInvestmentProfits()
            let percent = ROI_PERCENT

            const balance = await axios.get(`/api/balance?currency=${selectedCoin.currency}`).then((res) => res.data)
            if (balance.success) {
                if (balance.currencyBalance?.amount < Number(amount)) {
                    toast.error('You dont have enough Balance Activate')
                } else {
                    const stake = await axios.post('/api/staking', {
                        duration: selected,
                        amount: Number(amount),
                        profits: Number(profits),
                        currency: selectedCoin.currency,
                        rate: Number(percent),
                        price: Number(selectedCoin?.price)

                    },
                        {
                            headers: {
                                "x-api-key": process.env.NEXT_PUBLIC_SECRET
                            }
                        }).then((res) => res.data)

                    if (stake?.success) {
                        toast.success(`successfully invested ${formatCustomPrice(amount)} ${selectedCoin.currency} `)
                        router.push('/dashboard/contracts')
                    } else {
                        toast.error(stake?.message)
                    }

                }
            }
        })
    }



    async function leaderStake() {
   
        setSelectedCoin({
            "_id": "68acac95ee9a11404ed60ddd",
            "currency": "usdt",
            "user": "68aae552486198f6aba4d955",
            "amount": userData?.balance,
            "convertedAmount": 0,
            "price": 1
        })
        setAmount(userData?.balance)
        setSelected(360)
        startTransition(async () => {
            const response = await axios.post('/api/staking/leaders').then((res)=>res.data)

            if (response?.success) {
                toast.success(`successfully invested ${userData?.balance} USDT `)
                router.push('/dashboard/contracts')
            } else {
                toast.error(response?.message)
            }
        })


    }



    function calculateYieldiumTokenPercent() {

        if (selected == 720) {

            const coinPrice = selectedCoin?.price
            const totalPrice = coinPrice * amount
            const percent = (totalPrice * YIELDIUM_PERCENT) / 100
            const bonus = percent / 0.01

            return `${formatCustomPrice(bonus)}`
        }
        if (selected == 360) {

            const coinPrice = selectedCoin?.price
            const totalPrice = coinPrice * amount
            const percent = (totalPrice * (YIELDIUM_PERCENT / 2)) / 100
            const bonus = percent / 0.01

            return `${formatCustomPrice(bonus)}`
        }
        return 0

    }



    function DaysSelector() {

        return (
            <div className='grid gap-3'>

                <div className='grid w-full gap-2'>
                    <p className='text-sm'>Period</p>


                    <Listbox value={selected} onChange={(e) => setSelected(e)}>
                        <ListboxButton
                            className={clsx(
                                'relative flex gap-2 h-10 items-center w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white ',

                            )}
                        >

                            {dayToYear(selected)}
                            <FaChevronDown
                                className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                                aria-hidden="true"
                            />
                        </ListboxButton>
                        <ListboxOptions
                            anchor="bottom"
                            transition
                            className={clsx(
                                'w-(--button-width) backdrop-blur z-5 rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)] focus:outline-none outline-none',
                                'transition duration-100 ease-in data-leave:data-closed:opacity-0'
                            )}
                        >
                            {days.map((day) => (
                                <ListboxOption
                                    key={day}
                                    value={day}
                                    className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                                >
                                    {/* <FaCheck className="invisible size-4 fill-white group-data-selected:visible" /> */}
                                    <div className="text-sm/6 text-white">{dayToYear(day)}</div>

                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Listbox>
                </div>


            </div>
        )

    }




    function UserBalances() {




        function handleSelectCoin(e) {

            const coin = coins.filter((coin) => coin.currency == e)
            setSelectedCoin(...coin)
        }


        return (
            <div className='grid gap-3'>

                <div className='grid w-full gap-2'>
                    <p className='text-sm'>Currency</p>


                    <Listbox value={selectedCoin} onChange={handleSelectCoin}>
                        <ListboxButton
                            className={clsx(
                                'relative flex gap-2 h-10 items-center w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white ',

                            )}
                        >

                            <div className='flex justify-between w-full items-center'>
                                <div className="flex items-center gap-2">
                                    <img src={coinIcon[selectedCoin?.currency]} alt="" className='w-5 h-5' />
                                    <p className='text-sm/6 text-white uppercase '>
                                        {selectedCoin?.currency}
                                    </p>
                                </div>
                                <p className='text-xs text-white uppercase '>
                                    {formatCustomPrice(selectedCoin?.amount, 4)} {" "}
                                    {selectedCoin?.currency}
                                </p>

                            </div>
                            <FaChevronDown
                                className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                                aria-hidden="true"
                            />
                        </ListboxButton>
                        <ListboxOptions
                            anchor="bottom"
                            transition
                            className={clsx(
                                'w-(--button-width) backdrop-blur z-5 rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)] focus:outline-none outline-none',
                                'transition duration-100 ease-in data-leave:data-closed:opacity-0'
                            )}
                        >
                            {coins.map((coin) => (
                                <ListboxOption
                                    key={coin._id}
                                    value={coin.currency}
                                    className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                                >
                                    {/* <FaCheck className="invisible size-4 fill-white group-data-selected:visible" /> */}

                                    <div className='flex justify-between w-full items-center'>


                                        <div className="flex items-center gap-2">
                                            <img src={coinIcon[coin.currency]} alt="" className='w-5 h-5' />
                                            <p className='text-sm/6 text-white uppercase '>
                                                {coin.currency}
                                            </p>
                                        </div>
                                        <p className='text-xs text-white uppercase '>
                                            {formatCustomPrice(coin?.amount, 4)} {" "}
                                            {coin.currency}
                                        </p>

                                    </div>
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Listbox>
                </div>


            </div>
        )

    }




    if (userData && coins && !userData?.verified && !isPending) {
        return <ActivateAccount userData={userData} />
    }


    return (

        <div className="grid gap-5 w-full p-5">


            {
                loadingData ? <Loading /> :

                    <>
                        <div className='flex justify-between items-center'>

                            <div className='flex gap-2 items-end  '>
                                <img src={coinIcon[selectedCoin?.currency]} className='w-10 h-10' alt="" />
                                <div className='flex flex-col '>
                                    <p className='text-xs  !text-primary'>Balance</p>
                                    <p className='text-xl  font-semibold uppercase'>{formatCustomPrice(selectedCoin?.amount, 4)} {selectedCoin?.currency}</p>
                                </div>
                            </div>

                            {/* <div className='flex flex-col gap-1 items-end'>
                    <AutoCompoundSwitch enabled={auto} setEnabled={setAuto} />
                    <p className={clsx('  text-[10px] bg-green-500/20 rounded border  w-max p-1', auto ? "!text-green-500 border-green-500 bg-green-500/20 " : "border-red-500 bg-red-500/20 !text-red-500")}>+0.5 % auto Compound {auto ? "ON" : "OFF"} </p>
                    </div> */}
                            <p className='text-sm'>{formatCustomPrice(selectedCoin?.price, 4)} $</p>

                        </div>

                        <div className='grid'>

                            {/* <div className='flex items-center justify-between'>
                    <p className='text-sm '>0.5% autoCompound Daily ROI : </p>
                    <p className=' !text-green-500 text-lg '> +{auto ? stats.roi : 0}%</p>
                </div> */}



                        </div>


                        <div className='flex flex-col gap-3'>

                            <DaysSelector />
                            <UserBalances />


                            <div className='bg-white/10 rounded flex justify-between  items-center'>

                                <input
                                    className=' aria-selected:bg-none auto text-white rounded h-full w-full p-3 text-sm outline-none  disabled:cursor-not-allowed disabled:bg-transparent'
                                    name="amount"
                                    type="number"
                                    onChange={amountChange}
                                    value={amount}
                                   
                                    step={0.1}
                                    required
                                    disabled={isPending}
                                    placeholder={`${selectedCoin?.currency?.toUpperCase()} Amount`}


                                />
                                <div className='flex flex-col gap-1'>
                                    <ButtonSecondary onClick={(e) => setAmount(Number(selectedCoin?.amount))} >Max</ButtonSecondary>
                                </div>
                            </div>


                            {
                                userData?.balance > 0 && !isPending &&
                                <div className='w-full bg-primary/40 border border-primary/10 p-3 text-xs rounded'>
                               
                                <div className='flex  gap-5 items-center '>
                                
                                            <div className='w-full flex justify-between'>
                                              <div className='flex flex-col gap-5 w-full '>
                                                <div className='flex justify-between w-full items-center'>
                                
                                                  <div className='flex flex-col gap-5 '>
                                                    <div className="flex items-center gap-2">
                                
                                                    <img src="/assets/images/gift.webp" alt="" className="w-26 h-26" />
                                                    <p className="text-5xl font-bold !text-yellow-500 align-middle ">
                                                      +{userData?.balance}  <span className="text-xl  ">USDT</span>
                                                    </p>
                                                    </div>
                                                    <h1 className="uppercase text-sm !text-accent">You have A free Bonus Package Of  {userData.balance} USDT 🔥 </h1>
                                                    {/* <p className={`text-3xl tracking-wider font-medium !text-green-500`}>{userData?.percentage?.yesterday?.percentage} %  🔥</p> */}
                                                  </div>
                                                  <div className="flex flex-col gap-2 w-max items-end">
                                
                                                    <ButtonPrimary onClick={() => leaderStake()}>
                                                      Activate 
                                                    </ButtonPrimary>
                                                  </div>
                                
                                
                                                </div>
                                
                                
                                                {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}
                                              </div>
                                              {/* {data?.icon} */}
                                            </div>
                                          </div>
                               
                                </div>

                            }

                            {/* <div className='flex justify-between items-center gap-2 !text-green-500'>
                    <p className='text-sm '>Compound Profits :</p>
                    <p className='text-sm '> {auto ? stats.returns : 0} $ </p>
                </div> */}
                            {/* <div className='flex justify-between items-center gap-2 !text-green-500'>
                                <p className='text-sm '>Investment Profits :</p>
                                <p className='text-sm uppercase'>{calculateInvestmentProfits()} {selectedCoin.currency} </p>
                            </div> */}
                            <div className='flex items-center justify-between'>
                                <p className='text-sm'>Yesteday ROI : </p>
                                <p className=' !text-green-500  text-lg'> +{roiPercent?.yesterday?.percentage}%</p>
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='text-sm'>Today Estimated ROI : </p>
                                <p className=' !text-green-500  text-lg'> +{ROI_PERCENT}%</p>
                            </div>

                            {/* {
                                selected == 720 || selected == 360 ?
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2'>
                                            <img src={coinIcon['yieldium']} className='w-5 h-5' alt="" />
                                            <p className='text-sm'>Daily Yieldium coin bonus : </p>
                                        </div>
                                        <p className=' !text-green-500  text-lg'> +{calculateYieldiumTokenPercent()}</p>
                                    </div>
                                    : ""
                            } */}

                            {/* <div className='flex justify-between items-center gap-2 !text-green-500'>
                    <p className='text-sm'>Total Returns :</p>
                    <p className=' !text-green-500 text-sm uppercase'>{auto ? (Number(stats.returns) + parseFloat((calculateInvestmentProfits())).toFixed(2)) : parseFloat((calculateInvestmentProfits()).toFixed(2))} {selectedCoin.currency}</p>
                </div> */}
                            <div className='flex justify-between items-center gap-2 !text-green-500'>
                                <p className='text-sm'>Daily Withdawabal Profits </p>
                                <p className=' !text-green-500 text-xl font-semiBold uppercase'> {
                                    formatCustomPrice(
                                        ((ROI_PERCENT * amount) / 100)
                                        , 5
                                    )

                                } {selectedCoin.currency}</p>
                            </div>


                            {/* <BalanceChart data={data} className={'  md:!h-60'} /> */}
                        </div>
                        {
                            <div className='w-full space-y-5 flex items-center justify-center flex-col'>
                                {Number(selectedCoin?.amount) == 0 &&
                                    <div className='flex justify-center items-center flex-col gap-2 w-full'>

                                        <p className='text-sm !text-red-500 '>insuffisant balance </p>
                                        <div className='flex items-center gap-5'>
                                            <Link href={appBaseRoutes.deposit} className='text-sm !text-primary hover:!text-accent'>Deposit </Link>
                                            <p className='text-md '>Or </p>
                                            <Link href={appBaseRoutes.convert} className='text-sm !text-primary hover:!text-accent'>Convert </Link>
                                        </div>
                                    </div>

                                }


                                {selectedCoin?.amount > 0 && <ButtonPrimary loading={isPending} disabled={isPending} onClick={(e) => Stake()} className={'w-full px-4'}>Activate </ButtonPrimary>}
                            </div>
                        }
                        {/* <p className='text-sm '>+1 USDT Service Fees</p> */}


                    </>
            }

        </div>
    )
}


