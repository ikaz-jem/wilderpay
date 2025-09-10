import React from 'react'
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from 'framer-motion'
import CompoundCalculator from '../dashboard/components/CompoundCalculator/CompoundCalculator';
import { appBaseRoutes } from '@/routes';

export default function SectionCalculator() {
    return (
        <div className='pr-2 pl-1 overflow-y-scroll md:overflow-y-hidden snap-center w-full backdrop-blur relative bg-gradient-to-b from-background to-black overflow-hidden py-10 pt-20 md:h-[100vh] h-full '>

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
                            Experience the Power
                        </motion.h1>
                        <motion.h1 className='text-3xl lg:text-5xl font-light tracking-widest !text-primary'>
                            Of Compounding !
                        </motion.h1>

                    </motion.div>
                    <a href={appBaseRoutes?.dashboard} className='!text-white h-max cursor-pointer hover:bg-primary/10 transition-all border-primary/50 border w-max rounded-full flex items-center gap-2 px-5 py-2 '>Get Started <FaArrowRightLong className='text-primary ' /> </a>
                </div>



                <div className='pt-10'>
                    <CompoundCalculator />
                </div>
                <p className=' tracking-widest text-center  !text-neutral ' >Reinvest in our System Watch your profits grow !.</p>
            </div>
        </div>
    )
}
