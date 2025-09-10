"use client"
import React from 'react'
import { ClipLoader
 } from 'react-spinners'
 
export default function ButtonSecondary({className,children , onClick,Icon , loading ,disabled}) {



  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${className} disabled:cursor-not-allowed disabled:bg-neutral-400/20 disabled:border-neutral-500 flex items-center justify-center gap-5 !text-sm !rounded-lg cursor-pointer before:ease relative h-10 w-28 overflow-hidden border border-neutral/50   shadow-lg transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-40  before:bg-white before:opacity-40 before:duration-700 hover:shadow-primary/20 hover:before:-translate-x-40`}>
    {!loading ?
    <>

      <span className="relative ">{children || 'button'}  </span>
      {Icon && <Icon className='text-2xl' />}
      </>
      :
             <ClipLoader className='text-xs' color='var(--title)' size={25}/>
      
    }
    </button>
  )
}
