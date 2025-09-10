"use client"
import ButtonPrimary from '@/app/components/ButtonPrimary'

import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState, useTransition } from 'react'
import { FaExclamationTriangle } from "react-icons/fa";

import { formatCustomPrice } from '@/app/utils/formatPrice'
import BorderEffect from '../BorderEffect/BorderEffect'
import { coinIcon } from '../../staticData';
import ButtonSecondary from '@/app/components/ButtonSecondary';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Loading from '@/app/components/Loading';


const activatePrice = 10

export default function ActivateAccount({ userData }) {




    return (
        <div className='w-full border-primary/10 border rounded px-5 py-2 flex items-center justify-between bg-yellow-500/5 relative'>
            <BorderEffect />

            <div className='flex items-center gap-2 '>
                <FaExclamationTriangle className='text-yellow-500' />
                <p className='capitalize text-sm'>Your Account is not activated Yet</p>
            </div>
            {
                userData && 
            <ActivateModal userData={userData} title='Activate Your Account' />
            }
        </div>)
}



function ActivateModal({ title = "", userData }) {
    let [isOpen, setIsOpen] = useState(false)
    let [selected, ssetSelected] = useState(false)


    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    const balances = userData?.balances


    function calculateCoin(balance, price) {
        const coinPrice = Number(price) / Number(balance)
        const coinsNeeded = activatePrice / coinPrice
        if (balance == 0 || price == 0) {
            const coinsNeeded = activatePrice / price
            return coinsNeeded
        }

        return coinsNeeded

    }




const neededCoins = calculateCoin(selected?.amount, selected?.convertedAmount)


    async function activate() {
        startTransition(async () => {

            let data = selected
            data.coinsNeeded = neededCoins

            if (data.coinsNeeded == null || isNaN(data?.coinsNeeded)){
                return toast.error('No Balance')
            }

            
            const activated = await axios.post('/api/activate-account', data).then((res) => res.data)
            if (activated?.success) {
                toast.success(activated?.message)
            }
            else {
                toast.warning(activated?.message)
            }
            if (activated?.success) {
                router.refresh()
            }
        })
            
    }



    return (
        <>

            <ButtonPrimary
                onClick={open}
                className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black/30"
            >
                Activate
            </ButtonPrimary>




            <Dialog open={isOpen} as="div" className="relative z-50 focus:outline-none" onClose={close}>
                <div className="fixed inset-0 z-50 w-screen overflow-y-auto ">
                    <div className="flex min-h-full items-center justify-center p-4 backdrop-blur-md ">
                        <DialogPanel
                            transition
                            className="w-full max-w-xl rounded border border-primary/10 bg-black/50 p-6 backdrop-blur-4xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 relative"
                        >
                            <BorderEffect />
                            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                                {title}
                            </DialogTitle>
                            <div className='flex flex-col space-y-5 gap-2 flex-wrap'>

                                <p className='uppercase text-xs'>To start Using Yieldium Activate your Account as Low as 10$</p>

                                <div className='flex gap-3 items-center flex-wrap'>


                                    {
                                        balances?.map((balance, key) =>
                                            <div className={`flex grow gap-2 border border-primary/10 p-2 rounded cursor-pointer ${selected?.currency == balance?.currency && "bg-primary/40"} `} key={key} onClick={(e) => ssetSelected(balance)}>
                                                <img src={coinIcon[balance.currency]} alt="" className='w-8 h-8' />
                                                <div className=' flex flex-col gap-1 w-20'>

                                                    <p className='uppercase text-xs'>{balance?.currency} </p>
                                                    <p className='uppercase text-xs'>{formatCustomPrice(balance?.amount)} </p>
                                                </div>
                                            </div>
                                        )
                                    }

                                </div>
                                {
                                    !userData && 
                                <Loading/>
                                }
                                {selected ?  Number(selected?.amount)>= neededCoins &&
                                    <div className='flex gap-2 items-center justify-between p-5 bg-primary/20 border border-primary/10 rounded'>


                                        <h3 className='text-xl uppercase font-medium'>Total :  </h3>
                                        <div className='flex gap-2 items-center'>

                                            <p className='uppercase xl font-medium !text-primary'>{selected?.currency} </p>
                                            <p className='uppercase xl font-medium !text-primary'>{formatCustomPrice(neededCoins,4)} </p>
                                            <img src={coinIcon[selected.currency]} alt="" className='w-6 h-6' />
                                        </div>


                                    </div>:''
                                    }
                                {selected?.amount < neededCoins &&
                                    <div className='flex gap-2 items-center justify-between p-5 bg-primary/5 border border-primary/10 rounded backdrop-blur'>


                                        <h3 className='text-md uppercase font-medium !text-red-500'>insufficient balance for This Currency  </h3>
                                       


                                    </div>
                                    }
                                <p className='uppercase text-xs'>one Time Payment</p>


                            </div>




                            <div className="mt-4 flex gap-2">
                                <ButtonPrimary
                                    onClick={() => activate()}
                                    loading={isPending}
                                    disabled={selected?.amount < neededCoins || isNaN(neededCoins) || !neededCoins}
                                >
                                    Activate
                                </ButtonPrimary>

                                <ButtonSecondary
                                    onClick={close}
                                >
                                    Close
                                </ButtonSecondary>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}






const tiers = [
    { volume: 0, name: "Direct", percent: 7 },
    { volume: 50, name: "Level 2", percent: 1.5 },
    { volume: 100, name: "level 3", percent: 1 },
    { volume: 500, name: "level 4", percent: 0.25 },
    { volume: 1, name: "level 5", percent: 0.25 },
];

function TiersTable() {
    return (
        <div className="overflow-hidden rounded-xl border border-primary/10  shadow-sm">
            <table className="w-full divide-y divide-primary/10">
                <thead className="bg-primary/10">
                    <tr>

                        <th
                            scope="col"
                            className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
                        >
                            Tier
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
                        >
                            Networker
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
                        >
                            pro-M
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
                        >
                            VIP
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
                        >
                            Partner
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
                        >
                            Shareholder
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                    <tr className="">
                        <td className="text-xs px-2 py-2  !text-neutral">Volume  </td>
                        <td className="px-2 py-2">
                            <div className="flex items-center gap-3">
                                <span className="text-xs !text-neutral">
                                    5K
                                </span>

                            </div>
                        </td>
                        <td className="px-2 py-2">
                            <div className="flex items-center gap-3">
                                <span className="text-xs !text-neutral">
                                    50K
                                </span>

                            </div>
                        </td>
                        <td className="px-2 py-2">
                            <div className="flex items-center gap-3">
                                <span className="text-xs !text-neutral">
                                    100K
                                </span>

                            </div>
                        </td>
                        <td className="px-2 py-2">
                            <div className="flex items-center gap-3">
                                <span className="text-xs !text-neutral">
                                    500K
                                </span>

                            </div>
                        </td>
                        <td className="px-2 py-2">
                            <div className="flex items-center gap-3">
                                <span className="text-xs !text-neutral">
                                    1M+
                                </span>

                            </div>
                        </td>
                    </tr>
                    <tr className="">
                        <td className="text-xs px-2 py-2  !text-neutral">Bonus  </td>
                        <td className="px-2 py-2">
                            <div className="flex items-center gap-3">
                                <span className="text-xs !text-neutral">
                                    50 USDT
                                </span>

                            </div>
                        </td>
                        <td className="px-2 py-2">
                            <div className="flex items-center gap-3">
                                <span className="text-xs !text-neutral">
                                    500 USDT
                                </span>

                            </div>
                        </td>
                        <td className="px-2 py-2">
                            <div className="flex items-center gap-3">
                                <span className="text-xs !text-neutral">
                                    1000 USDT
                                </span>

                            </div>
                        </td>
                        <td className="px-2 py-2">
                            <div className="flex items-center gap-3">
                                <span className="text-xs !text-neutral">
                                    5000 USDT
                                </span>

                            </div>
                        </td>
                        <td className="px-2 py-2">
                            <div className="flex items-center gap-3">
                                <span className="text-xs !text-neutral">
                                    10,000 USDT
                                </span>

                            </div>
                        </td>
                    </tr>
                    {tiers.map((tier) => (
                        <tr key={tier.name} className="">
                            <td className="text-xs px-2 py-2  !text-neutral">{tier.name}  </td>
                            <td className="px-2 py-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs !text-neutral">
                                        {tier.percent}%
                                    </span>

                                </div>
                            </td>
                            <td className="px-2 py-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs !text-neutral">
                                        {tier.percent}%
                                    </span>

                                </div>
                            </td>
                            <td className="px-2 py-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs !text-neutral">
                                        {tier.percent}%
                                    </span>

                                </div>
                            </td>
                            <td className="px-2 py-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs !text-neutral">
                                        {tier.percent}%
                                    </span>

                                </div>
                            </td>
                            <td className="px-2 py-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs !text-neutral">
                                        {tier.percent}%
                                    </span>

                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


const rebatesTiers = [
    { name: "Direct", percent: 3 },
    { name: "Level 2", percent: 2 },
    { name: "level 3", percent: 1.5 },
    { name: "level 4", percent: 1 },
    { name: "level 5", percent: 0.8 },
    { name: "level 6", percent: 0.6 },
    { name: "level 7", percent: 0.4 },
    { name: "level 8", percent: 0.3 },
    { name: "level 9", percent: 0.2 },
    { name: "level 10", percent: 0.2 },
];

function RebateTiers() {
    return (
        <div className="overflow-hidden rounded-xl border border-primary/10 shadow-sm">
            <table className="w-full divide-y divide-primary/10">
                <thead className="bg-primary/10">
                    <tr>
                        <th
                            scope="col"
                            className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
                        >
                            Tier
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
                        >
                            Percentage
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                    {rebatesTiers.map((tier) => (
                        <tr key={tier.name} className="">
                            <td className="text-xs px-2 py-2 !text-neutral">{tier.name}</td>
                            <td className="px-2 py-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs !text-neutral">
                                        {tier.percent}%
                                    </span>

                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
