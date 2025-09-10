import React from 'react'
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from 'framer-motion'
import { appBaseRoutes } from '@/routes';

function Card2({ data }) {

    return (
        <div className="rounded-xl p-5  bg-gradient-to-br from-primary/40 to-pink-500/50 from-40% /10 w-full h-max z-1">
            <div className="rounded-xl bg-background flex justify-end bg-clip-border w-full h-full relative bg-gradient-to-tr from-background to-neutral-900 ">
                <motion.img initial={{y:50 ,opacity:0}} whileInView={{y:0 ,opacity:1}} viewport={{once:true}}  transition={{ duration: 0.6, ease: 'easeOut' }} src="/assets/images/mobile.png" alt="" className='absolute bottom-0 left-0 drop-shadow-[0px_-20px_40px_rgba(238,102,166,0.3)] w-40 md:w-max ' />
                <div className='text-left gap-3 flex justify-between align-baseline p-10 my-5'>
                    <div className=''>
                        <h1 className='text-xl md:text-3xl tracking-widest font-bold !text-neutral ' > Your 24/7 Wealth Machine </h1>
                        <h1 className='text-lg font-light tracking-widest !text-primary ' >Small Profits, Big Outcomes ! </h1>
                        <p className=' tracking-widest text-xs md:text-sm lg:text-md max-w-md !text-neutral py-5 ' >With Yieldium’s 0.5% daily compounding Bonus, your crypto doesn’t just earn — it multiplies. Every day, your profits are reinvested automatically, growing your balance faster than you think. </p> <br />
                        {/* <p className=' tracking-widest text-xs md:text-sm lg:text-md max-w-md !text-neutral py-5 text-' >💰 Day 1: You deposit $1,000 , 🌕 Day 90: You hold ~$5,943 </p>  */}
                    </div>
                </div>
            </div>
        </div>
    )
}




export default function SectionCta() {
    return (
        <div className='pr-2 pl-1 overflow-y-scroll md:overflow-y-hidden snap-center w-full backdrop-blur relative bg-gradient-to-b from-background to-black overflow-hidden py-20 pt-20 md:h-[100vh] h-full'>

            <span className="bg-pink-500 rounded-full h-[400px] w-[400px] blur-[400px] absolute top-[80] left-[35%] z-[-1] opacity-40"></span>

            <div className='container   h-full space-y-20'  >


                <div className='text-left gap-3 flex flex-col md:flex-row justify-between align-baseline px-2'>
                    <motion.div
                        className='space-y-3'
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        viewport={{ once: true }}
                    >
                        <motion.h1 className='text-3xl lg:text-5xl tracking-widest font-bold'>
                            Watch Your Crypto 
                        </motion.h1>
                        <motion.h1 className='text-3xl lg:text-5xl font-light tracking-widest !text-primary'>
                            Multiply Daily
                        </motion.h1>
                    </motion.div>
                    <a href={appBaseRoutes.register} className='!text-white h-max cursor-pointer hover:bg-primary/10 transition-all border-primary/50 border w-max rounded-full flex items-center gap-2 px-5 py-2 '>Create Wallet  <FaArrowRightLong className='text-primary ' /> </a>
                </div>



                <div className='pt-10'>
                    <Card2 />
                </div>
                <p className='text-xs md:text-sm lg:text-md tracking-widest text-center  !text-neutral ' >You don’t need to trade, click, or manage anything. Just deposit your crypto and let our AI handle the rest. You can track every step of your growth through our sleek, easy-to-use mobile dashboard.

 </p>
            </div>
        </div>
    )
}
