


import { appBaseRoutes } from '@/routes'
import Link from 'next/link'
import React from 'react'
import BorderEffect from '../BorderEffect/BorderEffect'
import { formatPrice } from '@/app/utils/formatPrice'
import { IoArrowForward } from "react-icons/io5";
import { coinIcon as coinDetails } from '../../staticData'





export default function AssetsBalance({ data }) {

    return (
        <div className='flex flex-col gap-3 w-full  '>

            <div className="flex items-center justify-between">

                <h1 className="!text-neutral text-sm" >Wallet Balances</h1>
                <Link href={appBaseRoutes.deposit} className="text-xs flex items-center gap-2 !text-primary cursor-pointer hover:!text-accent transition-all">Deposit   <IoArrowForward/></Link>
            </div>
            {
                data?.balances?.map((balance, idx) => <div key={idx} className='flex p-5  gap-3 items-center border border-primary/10 bg-card rounded relative overflow-hidden backdrop-blur-xl'>

                            <BorderEffect/>

                    <img src={coinDetails[balance?.currency]} alt="" className='w-8 h-8' />
                    <div className='w-full flex justify-between'>

                        <div className='flex flex-col '>
                            <h1>{balance?.currency.toUpperCase()}</h1>
                            <p className='text-xs'>{parseFloat((balance?.amount).toFixed(2))} {balance?.currency.toUpperCase()}</p>
                            {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}

                        </div>
                        <p className='text-sm'>{formatPrice.format(balance?.convertedAmount) || 0} </p>
                    </div>
                </div>
                )
            }
        </div>)
}
