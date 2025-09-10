"use client"
import React, { useRef } from 'react'
import { GrMoney } from "react-icons/gr";
import { FaArrowRightLong } from "react-icons/fa6";
import Featuresslider from './components/Featuresslider/Featuresslider';


import { LazyMotion, domAnimation, m } from "framer-motion";
import { appBaseRoutes } from '@/routes';


export default function SectionFeatures() {
  const itemRef = useRef(null)

  

  const cards = [
    {
      title: 'AI-Powered Profit Engine',
      desc: 'WilderPay uses arbitrage, sentiment analysis, and yield optimization to generate consistent profits — even in volatile markets. ',
    },
    {
      title: 'Security First',
      desc: 'Your funds are protected with advanced security protocols, wallet isolation, starting from 7-day lock-in buffer for system stability.',
    },
    {
      title: 'High-Yield Potential',
      desc: 'Target up to 3% daily ROI returns, with 0.5% compounding Bonus designed to maximize your long-term growth.',
    },
  ]

  function Card({ data }) {
    return (

      <div className="rounded-xl h-full bg-white/5 border border-primary/5 shadow-xl  p-6 bg-clip-border w-full space-y-5">


        <div className='border rounded border-primary/50 w-max p-3'>
          <GrMoney className='text-primary/50 text-xl' />
        </div>

        <div className='space-y-5'>

          <h2 className="text-lg font-medium">{data?.title}</h2>
          <p className='text-xs md:text-sm text-neutral'>{data?.desc}</p>
        </div>
      </div>

    )


  }


  function Section1() {
    return (
      <div className='grid gap-5  '>

        <div className='grid  w-full gap-3  ' >

          <div className='text-left gap-3 flex flex-col md:flex-row justify-between align-baseline '>
            <div className='space-y-3'>
              <h1 className='text-3xl lg:text-5xl tracking-widest font-bold ' >WilderPay </h1>
              <h1 className='text-3xl lg:text-5xl font-light tracking-widest !text-primary ' >a Smart Wealth Engine </h1>
            </div>
            <a href={appBaseRoutes?.register} className='!text-white h-max cursor-pointer hover:bg-primary/10 transition-all border-primary/50 border w-max rounded-full flex items-center gap-2 px-5 py-2 '>Create Account  <FaArrowRightLong className='text-primary ' /> </a>
          </div>
        </div>

        <div className='grid gap-5 grid-cols-1 lg:grid-cols-3'>
          {
            cards?.map((item, key) => <Card key={key} data={item} />)
          }
        </div>
      </div>

    )
  }

  



  return (
    
    <div className='h-full md:h-[100vh]  relative overflow-y-scroll sm:overflow-none bg-gradient-to-t from-black to-transparent from-50% to-80%   '>
      <img src="/assets/images/divider.png" loading='lazy' alt="" className="w-full -mb-[100px] md:-mb-[200px] lg:-mb-[450px] z-[-1] " />
      <LazyMotion features={domAnimation}>
      <m.div 
      initial={{opacity:0}}
      whileInView={{opacity:1}}
      viewport={{once:false}}
      className=' w-full backdrop-blur  overflow-hidden   relative'>

  
        <div className='bg-black  mask-t-from-90%  px-2  overflow-hidden '>
          <div className='container space-y-20 py-20 h-full' ref={itemRef} >
            <div>
              <Section1 />
            </div>
           
          </div>
        </div>
      </m.div>
    </LazyMotion >
    </div>

  )
}
