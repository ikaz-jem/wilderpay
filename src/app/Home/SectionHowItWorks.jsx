import React from 'react'
import { motion } from 'framer-motion'
import { FaArrowRightLong } from "react-icons/fa6";
import { appBaseRoutes } from '@/routes';


export default function SectionHowItWorks() {

  const images = [
    {
      src: '/assets/images/sphere.png',
      title: 'Create Account',
    },
    {
      src: '/assets/images/sphere.png',
      title: 'Deposit Funds',
    },
    {
      src: '/assets/images/sphere.png',
      title: 'Daily Profit Calculation',
    },
    {
      src: '/assets/images/sphere.png',
      title: 'Withdraw Profits',
    },


  ]


  function Card(props) {
    const { item, idx } = props
    return (
      <div className='grid gap-5 '>
        <div className='[box-shadow:0px_-20px_40px_rgba(238,102,166,0.3)] '>
          <div className='bg-gradient-to-br from-primary to-pink-500/50 p-5 mask-b-from-80% rounded-lg  '>

            <img loading='lazy' src={item?.src} alt="" className='w-40 h-40  ' />
          </div>
        </div>
        <div className='flex items-baseline gap-2'>
          <span className='text-sm md:text-lg lg:text-2xl text-neutral'>{idx + 1} .</span>
          <span className='text-sm md:text-lg   text-white font-light'>{item?.title} </span>
        </div>
        <span className="relative inline-block after:block after:h-[1px] after:bg-primary after:w-1/2 after:absolute after:bottom-0 after:left-1/4 w-40">
        </span>
      </div>
    )

  }





  return (
    <div className='overflow-y-scroll pr-5 pl-1 snap-center w-full backdrop-blur relative bg-gradient-to-b from-background to-black overflow-hidden py-20 md:h-[100vh] h-full'>

      <span className="bg-pink-500 rounded-full h-[400px] w-[400px] blur-[400px] absolute top-[80] left-[35%] z-[-1] opacity-40"></span>

      <div className='container  pt-20 h-full space-y-20'  >


        <div className='text-left gap-3 flex flex-col md:flex-row justify-between align-baseline px-2'>
          <motion.div
            className='space-y-3'
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <motion.h1 className='text-3xl lg:text-5xl tracking-widest font-bold'>
              How Yieldium
            </motion.h1>
            <motion.h1 className='text-3xl lg:text-5xl font-light tracking-widest !text-primary'>
              Works
            </motion.h1>
          </motion.div>
          <a href={appBaseRoutes.register} className='!text-white h-max cursor-pointer hover:bg-primary/10 transition-all border-primary/50 border w-max rounded-full flex items-center gap-2 px-5 py-2 '>Trade Now  <FaArrowRightLong className='text-primary ' /> </a>
        </div>



        <div className='flex justify-center md:justify-between flex-wrap w-full gap-2 '>

          {
            images?.map((item, idx) => <motion.div
              key={idx}
              className={`${idx == 1 ? 'mt-5' : ''} ${idx == 3 ? 'mt-20' : ''}`}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                ease: 'easeOut',
                delay: idx * 0.15
              }}
              viewport={{ once: true, amount: 0.4 }}
            >
              <Card item={item} idx={idx} />
            </motion.div>)
          }
        </div>
        <p className=' tracking-widest text-center  !text-neutral ' >More Than Just a Trading Platform — It’s a Smart Wealth Engine

 </p>

      </div>
    </div>
  )
}
