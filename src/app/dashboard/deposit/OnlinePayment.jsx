import React from 'react'
import { onlinePayments } from './data'

export default function OnlinePayment() {
  return (



    <div className='w-full p-5 grid gap-2'>
      {
        onlinePayments?.map((pay, idx) =>
          <div className='flex gap-5 bg-neutral-500/80 rounded-lg p-5 items-center cursor-not-allowed ' key={idx}>
            <div>{pay.icon}</div>
            <div className='grid gap-1'>
              <h1>{pay.title}</h1>
              <p className='text-xs !text-neutral-400'>Coming soon</p>
            </div>
          </div>)
      }
    </div>



)
}
