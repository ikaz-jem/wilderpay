
import React from 'react'

import { AiFillOpenAI } from "react-icons/ai";
import ButtonPrimary from '@/app/components/ButtonPrimary';
import { LazyMotion, domAnimation, m } from "framer-motion";
import { appBaseRoutes } from '@/routes';
import { RiSecurePaymentFill } from "react-icons/ri";
import { RiGlobalFill } from "react-icons/ri";
import { HiRefresh } from "react-icons/hi";
import { RiRobot2Fill } from "react-icons/ri";


function Bento() {
  return (
    <div className='grid gap-5  relative pr-2 pl-1'>

      <div className='flex flex-col md:flex-row gap-5 '>
          <div className='w-full relative group/1 !overflow-hidden'>            
            <div className='cursor-pointer p-5    bg-white/5  h-full w-full rounded-xl overflow-hidden'>


              <div className='grid gap-5 z-10'>
                <div className='flex gap-2 items-center z-10'>
                  <AiFillOpenAI className='text-primary text-3xl z-10' />
                  <h5 className='z-10'>AI That Learns and Adapts</h5>
                </div>
                <p className='text-xs md:text-sm md:w-[80%] w-[80%] z-10'>Our proprietary AI engine doesn't just execute — it evolves. By analyzing historical data, real-time market shifts, and user behavior, it continually improves its trading strategies for better performance.

</p>
                <a href={appBaseRoutes.dashboard}>
                <ButtonPrimary className='!text-xs'>Get Started!</ButtonPrimary>
                </a>
                
              </div>
            </div>
          </div>


        <div className='flex gap-5 w-full'>


          <div className=' relative  overflow-hidden  cursor-pointer p-5   bg-white/5  h-full w-full rounded-xl  '>
            <div className='grid gap-5 z-10  transition duration-1000  '>
              <div className='flex gap-2  items-center z-10'>
                <RiSecurePaymentFill className='text-primary text-3xl z-10' />
                <h5 className='font-semibold   z-10'>Built-In Risk Controls</h5>
              </div>
              <p className='text-xs md:text-sm md:w-[80%] w-[80%] z-10'>From stop-loss logic to emergency trade halts and payout caps, our System Handle Risks your Gains Are Protected And covered..</p>
            </div>
          </div>

          <div className='  cursor-pointer p-5   bg-white/5  h-full w-full rounded-xl  '>
            <div className='grid gap-5 z-10  transition duration-1000  '>
              <div className='flex gap-2  items-center z-10'>
                <RiGlobalFill className='text-primary text-3xl z-10' />
                <h5 className='font-semibold   z-10'>Global Access</h5>
              </div>
              <p className='text-xs md:text-sm md:w-[80%] w-[80%] z-10'>Accessible from anywhere in the world.</p>
            </div>
          </div>
        </div>



      </div>
      <div className='grid grid-cols-6 gap-4'>

        <div className='col-span-3 md:col-span-4'>

          <div className='  cursor-pointer p-5   bg-white/5  h-full w-full rounded-xl  '>
            <div className='grid gap-5 z-10  transition duration-1000  '>
              <div className='flex gap-2  items-center z-10'>
                <HiRefresh className='text-primary text-3xl z-10' />
                <h5 className='font-semibold   z-10'>Daily Compounding, Maximum Growth</h5>
              </div>
              <p className='text-xs md:text-sm md:w-[80%] w-[80%] z-10'>With daily profit calculations and automatic compounding, your earnings grow exponentially over time — turning consistent returns into serious long-term gains.</p>
            </div>
          </div>


        </div>
        <div className='col-span-3 md:col-span-2'>

          <div className='  cursor-pointer p-5   bg-white/5  h-full w-full rounded-xl  '>
            <div className='grid gap-5 z-10  transition duration-1000  '>
              <div className='flex gap-2  items-center z-10'>
                <RiRobot2Fill className='text-primary text-3xl z-10' />
                <h5 className='font-semibold   z-10'>Artificial Automated Strategy</h5>
              </div>
              <p className='text-xs md:text-sm md:w-[80%] w-full z-10 '>No charts. No guesswork. Just deposit your crypto and let our AI take the wheel. Yieldium is designed to be your passive income engine.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}



export default function SectionBento() {
  return (
    <>
      <div
        className='md:h-[100vh] h-full   w-full   relative overflow-hidden bg-black '>
        {/* <div
          class="opacity-80 sepia-20   mask-radial-from-0% group-hover/1:blur-xs  z-0 absolute inset-0 bg-[url('/assets/images/wave.png')] bg-cover  ">
        </div> */}
        <div className='  '>

          <div className='container space-y-20 py-20 h-full'  >
            <LazyMotion features={domAnimation}>

              <div className='px-2'>
                <m.h1 className='text-3xl lg:text-5xl tracking-widest font-bold'>
                  Smart AI Engine That
                </m.h1>
                <m.h1 className='text-3xl lg:text-5xl font-light tracking-widest !text-primary'>
                  Runs in Background
                </m.h1>
              </div>
            </LazyMotion >

            <Bento />
          </div>
        </div>
      </div>
    </>
  )


}
