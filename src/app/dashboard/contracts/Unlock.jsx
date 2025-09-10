"use client"
import ButtonPrimary from '@/app/components/ButtonPrimary'
import ButtonSecondary from '@/app/components/ButtonSecondary'
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState, useTransition } from 'react'
import { formatISO } from '@/app/utils/formatISO'
import { timeLeft } from '@/app/utils/timeLeft'
import { FaLock } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";
import BorderEffect from '../components/BorderEffect/BorderEffect'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'


export default function Unlock({ contract }) {
    let [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()


    const now = new Date();
    const target = new Date(contract.unlocksAt);
    const diffMs = target.getTime() - now.getTime();
    let disabled = diffMs >= 0

    async function claim() {
        startTransition(async () => {
            close(false)
            const data = {
                id: contract._id,
            }

            const res = await axios.post('/api/staking/unstake', data , {
                headers:{"x-api-key":process.env.NEXT_PUBLIC_SECRET}
            })
            if (res) {
                router.refresh()
                toast.success('Profits Added To your Wallet !')
            }

        })
    }



    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    return (
        <>
            <ButtonPrimary className={'!text-xs uppercase min-w-40'} onClick={open} disabled={disabled}>
                Claim {contract.amount} {contract.currency}
            </ButtonPrimary>

            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>

                <div className="fixed inset-0 z-50 w-screen overflow-y-auto backdrop-blur-md bg-black/20 ">

                    <div className="flex min-h-full items-center justify-center p-4 relative overflow-hidden">
                        <DialogPanel transition className="w-full space-y-5 relative max-w-lg rounded-xl bg-primary/5 p-6 backdrop-blur-xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0">
                            <BorderEffect />

                            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                              Unlock & Claim Profits
                            </DialogTitle>

                            <p className="mt-2 text-sm/6 text-white/50">
                                You are about To Claim
                                <span className='text-primary px-1'>
                                    {parseFloat((contract.amount+contract.profits).toFixed(2))} USDT
                                </span>
                                , are you Sure you wanna continue ?
                            </p>

                            <div className='flex flex-col max-w-xl w-full gap-2 border border-primary/10 p-5 rounded backdrop-blur-xl'>

                                <div className='flex  gap-5 items-center '>
                                    <img src='/assets/images/crypto/usdt.svg' alt="" className='w-8 h-8' />
                                    <div className='w-full flex justify-between'>
                                        <div className='flex flex-col '>
                                            <h1>Tether</h1>
                                            <p className='text-xs'>{parseFloat((contract?.amount).toFixed(2))} USDT</p>
                                            {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}
                                        </div>
                                        <p className='text-sm !text-green-500'>{parseFloat((contract?.profits).toFixed(2)) + ' $'} </p>
                                    </div>
                                </div>

                                <div className="flex justify-between ">
                                    <p className='text-sm'>{timeLeft(contract.unlocksAt)} </p>
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

                            </div>

                            <div className="mt-4 flex gap-2">
                                <ButtonPrimary onClick={close}>
                                    Cancel
                                </ButtonPrimary>
                                <ButtonSecondary loading={isPending} onClick={claim}>
                                    Claim Profits
                                </ButtonSecondary>
                            </div>

                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}