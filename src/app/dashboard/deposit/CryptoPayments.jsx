"use client"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import clsx from 'clsx'
import { useEffect, useState, useTransition } from 'react'
import { FaChevronDown } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { RiBnbFill } from "react-icons/ri";
import { GenerateQr } from '@/actions/generateQr';
import { IoMdCopy } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import {ClipLoader} from 'react-spinners'

import { cryptoDeposits } from './data';
import { useSession } from 'next-auth/react';
import { checkDeposit } from '@/web3/transactions/pollTransaction';
import { depositFunds } from '@/actions/web3Actions/depositFunds';
import DepositHistory from './DepositHistory';
import { toast } from 'sonner';

// import { getEvmWallet } from '@/web3/wallets/createOrGetEvmWallet';
// import { getTonWallet } from '@/web3/wallets/createOrGetTonWallet';
// import { getSolanaWallet } from '@/web3/wallets/createOrGetSolanaWallet';
// import { getBtcWallet } from '@/web3/wallets/createOrGetBtcWallet';

function CryptoPayment() {
    const session = useSession()
    const user = session?.data?.user

    const [selected, setSelected] = useState({ id: 0, name: 'Select A coin' })
    const [isPending, startTransition] = useTransition()
    const [sent,setSent] = useState(false)

useEffect(()=>{
    if (selected?.address && selected?.qr && !sent){
        ConfirmDeposit()
    }
},[selected])
useEffect(()=>{
  handleSelect(cryptoDeposits?.[0])
},[])

    const extractDepositAddress = async (e) => {
        // if (user?.walletIndex && e.network == 'ton') {
        //     const ton = await import('@/web3/wallets/createOrGetTonWallet')
        //     const data = await ton.getTonWallet(Number(user?.walletIndex), 0)
        //     return data
        // } else
             if (user?.walletIndex && e.network == 'solana') {
            const sol = await import('@/web3/wallets/createOrGetSolanaWallet')
            const data = await sol.getSolanaWallet(Number(user?.walletIndex), 0)
            return data
        } else if (user?.walletIndex && e.network == 'evm') {
            const evm = await import('@/web3/wallets/createOrGetEvmWallet')
            const data = await evm.getEvmWallet(Number(user?.walletIndex), 0)
            return data
        } 
        else if (user?.walletIndex && e.network == 'xrp') {
            const evm = await import('@/web3/wallets/createOrGetEvmWallet')
            const data = await evm.getEvmWallet(Number(user?.walletIndex), 0)
            return data
        } 
         
        else {
            return { address: null }
        }
    }

    async function ConfirmDeposit() {
            if (sent) return
        let { address, privateKey } = await extractDepositAddress(selected)
        const deposit = await checkDeposit(address, selected, user, privateKey)
        const dataCheck = process.env.CHECK_KEY
        if (deposit?.success) {
            let depositResult = await depositFunds(deposit , dataCheck , process.env.NEXT_PUBLIC_SECRET)
            setSent(true)
        }
    }

    const handleSelect = async (e) => {
     
        let { address, privateKey } = await extractDepositAddress(e)
        startTransition(async () => {
            const Qr = await GenerateQr(address)
            const tokenDetails = {
                ...e,
                qr: Qr,
                address: address,
                key: privateKey
            }
            setSelected(tokenDetails)
        })
    }


    function CopyButton({ text }) {
        const [copied, setCopied] = useState(false);

        const handleCopy = async () => {
            try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            } catch (err) {
                console.error('Failed to copy text:', err);
            }
        };

        return (
            <div className='flex items-center justify-between w-full py-1 px-2 bg-white/10 rounded h-10'>
                <p className='text-xs truncate w-60'>{text}</p>
                {copied ?
                    <FaCheckCircle
                        className="cursor-pointer !text-green-500 text-xl " />
                    :
                    <IoMdCopy onClick={handleCopy} className="cursor-pointer !text-neutral text-2xl hover:!text-primary" />
                }
            </div>
        );
    }



    return (
        <div className="mx-auto space-y-5 w-full p-5">
            <p className='text-sm font-semibold'>Select Currency</p>

            <Listbox value={selected} onChange={handleSelect}>
                <ListboxButton
                    className={clsx(
                        'relative flex gap-2 items-center w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white ',

                    )}
                >

                    {selected?.icon &&
                        <img src={selected?.icon} alt="" className='w-5 h-5' />
                    }
                    {selected.name} {selected.currency == "BTC"  && " (SegWit)"}  {selected.currency == "XRP"  && " (BSC BEP20)"}
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
                    {cryptoDeposits.map((person) => (
                        <ListboxOption
                            key={person.name}
                            value={person}
                            className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                        >
                            <FaCheck className="invisible size-4 fill-white group-data-selected:visible" />
                                                    <img src={person?.icon} alt="" className='w-5 h-5' />
                            <div className="text-sm/6 text-white">{person.name} {person.currency == "BTC"  && " (SegWit)"} {person.currency == "XRP"  && " (BSC BEP20)"}</div>

                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </Listbox>

            <div className=' gap-5 grid space-y-5 relative'>


                {
                    isPending && !selected.qr ?
                        <div className='w-full space-y-5 flex items-center justify-center  h-40'>
                            <ClipLoader className='text-xs' color='var(--title)' size={25} />
                        </div>
                        :

                        selected?.qr &&
                        <div className='w-full space-y-5 '>
                            <div className='flex items-center justify-center w-full h-40'>
                                <img src={selected?.qr} alt="" className='w-40 h-40 rounded-xl' />

                            </div>
                            <CopyButton text={selected.address} />
                            {/* <ButtonPrimary disabled={false} onClick={() => ConfirmDeposit()} className={'w-max px-4'}>Confirm Deposit</ButtonPrimary> */}
                        </div>
                }
            </div>
            <p className='text-xs '>Funds will be credited within 5s Please wait untill it's credited</p>
           {selected?.minDeposit && <p className='text-xs !text-primary '>{`Min Deposit is ${selected?.minDeposit} ${selected.symbol} `}</p>}
        </div>
    )
}




export default function CryptoPayments() {

    function DeopsitTypes() {
        return (
            <div className="flex  w-full justify-center  pt-5">
                <div className="w-full ">
                    <TabGroup>
                        <TabList className="flex gap-4">
                            
                        </TabList>
                        <TabPanels className="mt-3 ">
                            <TabPanel className="rounded-xl bg-card  backdrop-blur-xl     ">
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
            <div className='max-w-lg mx-auto space-y-5'>
                <DeopsitTypes />
                {/* <DepositHistory /> */}
            </div>
        </>
    )
}