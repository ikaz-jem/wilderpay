"use client"
import { MdOutlineArrowCircleUp } from "react-icons/md";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { PiArrowClockwiseFill } from "react-icons/pi";
import { useSession } from 'next-auth/react';
import { PiDownloadSimpleBold } from "react-icons/pi";
import { PiUploadSimpleBold } from "react-icons/pi";

import { useRouter } from 'next/navigation';
import { appBaseRoutes } from '@/routes';
import { MdPeopleAlt } from "react-icons/md";
import { FaChartPie } from "react-icons/fa";
import { GiMining } from "react-icons/gi";
import { FaArrowsRotate } from "react-icons/fa6";
import React, { useEffect, useState } from 'react'
import { BsFillSendFill } from "react-icons/bs";
import { formatCustomPrice, formatPrice } from "@/app/utils/formatPrice";
import { IoTerminal } from "react-icons/io5";
import { FaFileContract } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";




export default function HeaderMobile({ userData }) {


  const [visible, setVisible] = useState(true)
  const wilderPayBalance = userData.balances?.filter((bal) => bal.currency == "wp")?.[0]?.amount || 0
  const accountActive = userData?.verified

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let vis = JSON?.parse(localStorage?.getItem('viewBalance'))
      setVisible(vis)
    }
  }, [])

  const yesterDay = userData?.percentage?.yesterday?.percentage

  const totalBalance = formatCustomPrice(userData?.totalValue,0) 
  const fraction = formatCustomPrice(userData?.totalValue,8).split('.')?.[1] || 0
  

  const session = useSession()

  const router = useRouter()

  const buttons = [
    {
      title: 'Deposit',
      icon: <PiDownloadSimpleBold className='text-primary/50 text-xl group-hover:text-accent transition-all' />,
      link: appBaseRoutes.deposit,
    },
        {
          title:'Withdraw',
          icon:  <PiUploadSimpleBold className='text-primary/50 text-xl group-hover:text-accent transition-all' />
    ,
          link:appBaseRoutes.withdraw,
        },
    // {
    //   title:'Reinvest',
    //   icon: <PiArrowClockwiseFill className='text-primary/50 text-xl group-hover:text-accent transition-all' />,
    //   link:appBaseRoutes.withdraw,
    // },
    {
      title: 'Transfer',
      icon: <BsFillSendFill className='text-primary/50 text-xl group-hover:text-accent transition-all' />,
      link: appBaseRoutes.transfer,
    },
    {
      title: 'Invest',
      icon: <FaChartPie className='text-primary/50 text-xl group-hover:text-accent transition-all' />,
      link: appBaseRoutes.invest,
    },
    // {
    //   title: 'Mining',
    //   icon: <GiMining className='text-primary/50 text-xl group-hover:text-accent transition-all' />,
    //   link: appBaseRoutes.mining,
    // },
    {
      title: 'Convert',
      icon: <FaArrowsRotate className='text-primary/50 text-xl group-hover:text-accent transition-all' />,
      link: appBaseRoutes.convert,
    },
    {
      title: 'Contracts',
      icon: <FaFileContract className='text-primary/50 text-xl group-hover:text-accent transition-all' />,
      link: appBaseRoutes.contracts,
    },
    {
      title: 'Terminal',
      icon: <IoTerminal className='text-primary/50 text-xl group-hover:text-accent transition-all' />,
      link: appBaseRoutes.terminal,
    },


  ]

  function handleBallanceAppearance(view) {
    localStorage.setItem('viewBalance', view)
    setVisible(view)
  }



  function Buttons() {
    return (
      <div className='w-full  h-max   '>
        <div className='grid gap-5 rounded-full '>
          <div className='flex gap-2 overflow-x-scroll md:overflow-x-hidden  items-center h-full max-w-max md:max-w-full'>
            {
              buttons.map((button, idx) => <div key={idx} className=' p-2 grow group  cursor-pointer' onClick={() => (router.push(button.link))}>
                <div className=' flex flex-col gap-2 items-center justify-center  '>
                  <span className=' p-3 rounded-full backdrop-blur-sm'>
                    {button.icon}
                  </span>
                  <p className='text-xs'>{button.title}</p>
                </div>
              </div>)
            }
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="flex flex-col gap-5">

      <div className=' relative h-max  space-y-5  overflow-hidden rounded-lg bg-gradient-to-tl from-accent/10 to-primary/10 backdrop-blur-xl p-5 border border-primary/10'>
        <div className='w-full flex items-center h-max '>

          <div className='w-full rounded flex flex-col justify-center  gap-1  '>
            <h5 className='text-xs !text-neutral'>Total Balance in USD</h5>
            <div className='flex gap-2 items-baseline justify-between'>
              {
                visible ?
                  <div className='flex gap-2 items-center'>
                    <h1 className='text-2xl md:text-3xl lg:text-4xl font-semibold '>${totalBalance}{Number(fraction) !==0 && <span className="!text-sm">.{fraction}</span>} </h1>
                    <FaEyeSlash className='text-white/50 text-2xl hover:text-primary cursor-pointer' onClick={() => handleBallanceAppearance(false)} />
                  </div>
                  :
                  <div className='flex gap-2 items-baseline'>
                    <h1 className='text-4xl font-semibold '>$****** </h1>
                    <FaEye className='text-white/50 text-2xl hover:text-primary cursor-pointer' onClick={() => handleBallanceAppearance(true)} />
                  </div>
              }
              <div className="flex  gap-1 items-center w-max">
{/* 
                {
                  userData?.balance !==0 &&
                  <p className='!text-green-500 align-middle border border-green-500/10  rounded bg-green-500/10 text-xs w-max p-2'> +{userData?.balance} USDT </p>
                } */}
                {
                  accountActive ?
                    <RiRobot2Line className='!text-green-500 text-xl md:text-2xl lg:text-3xl w-max '/>
                    :
                    <RiRobot2Line className='!text-red-500 text-xl md:text-2xl lg:text-3xl w-max '/>
                }


              </div>


            </div>

          </div>
          {/* <div className='flex gap-1 items-center pfx-2  rounded-full bg-green-500/20 py-1 '>
            <h5 className='text-sm !text-green-500'> +15.5%</h5>
            <MdOutlineArrowCircleUp className='text-green-500 text-xl hover:!text-primary cursor-pointer' />
          </div> */}

          {/* <ButtonPrimary>Deposit</ButtonPrimary> */}
        </div>
        {/* <div className='flex gap-2 items-center'>
          <img src="/assets/images/logo.webp" alt="" className='w-5 h-5' />
          <div className="flex justify-between items-center w-full">
            <h1 className='text-xl font-semibold '>{formatCustomPrice(wilderPayBalance, 4)}<span className='text-sm'> WP </span> </h1>
            <h1 className='text-xs !text-green-300 align-middle'> <span className="text-xs  !text-primary">Yesterday</span> {yesterDay} %</h1>
          </div>
        </div> */}



      </div>
      {/* <Buttons /> */}
    </div>
  )
}
