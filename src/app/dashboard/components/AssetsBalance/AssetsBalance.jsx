


import { appBaseRoutes } from '@/routes'
import Link from 'next/link'
import React from 'react'
import BorderEffect from '../BorderEffect/BorderEffect'
import { formatCustomPrice, formatPrice } from '@/app/utils/formatPrice'
import { IoArrowForward } from "react-icons/io5";
import { coinIcon as coinDetails } from '../../staticData'





export default function AssetsBalance({ data }) {

    return (
        <div className='flex flex-col gap-2 w-full  '>

            <div className="flex items-center justify-between">

                <h1 className="!text-neutral text-sm" >Wallet Balances</h1>
                <Link href={appBaseRoutes.deposit} className="text-xs flex items-center gap-2 !text-primary cursor-pointer hover:!text-accent transition-all">Deposit   <IoArrowForward/></Link>
            </div>
            {
                data?.balances?.map((balance, idx) => <div key={idx} className='flex px-5 py-3  gap-3 items-center border border-accent/10 bg-card rounded-xl relative overflow-hidden backdrop-blur-xl'>

                            {/* <BorderEffect/> */}

                    <img src={coinDetails[balance?.currency]} alt="" className='w-8 h-8' />
                    <div className='w-full flex justify-between items-center'>

                        <div className='flex flex-col '>
                            <h1>{balance?.currency.toUpperCase()}</h1>
                            {/* <p className='text-xs'>{formatCustomPrice(balance?.amount,8)} {balance?.currency.toUpperCase()}</p> */}
                            {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}

                        </div>
                        <div className='flex flex-col items-end '>
                        <p className='text-sm !text-primary'>{formatCustomPrice(balance?.convertedAmount,8) || 0}$ </p>
                            <p className='text-sm !text-accent/80'>{formatCustomPrice(balance?.amount,8)} {balance?.currency.toUpperCase()}</p>
                            {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}

                        </div>
                    </div>
                </div>
                )
            }
        </div>)
}
