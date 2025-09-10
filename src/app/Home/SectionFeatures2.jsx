import React from 'react'
import { LazyMotion, domAnimation, m } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
import FeaturesAccordion from '../components/FeaturesAccordion';
import { appBaseRoutes } from '@/routes';


function Section2() {

const cards = [
  {
    title:'Secure In-App Wallet',
    desc:'Fast. Encrypted. Always in your control.'
  },
  {
    title:'Instant transactions',
    desc:'Seamless access to your crypto funds.'
  },
]


    return (
      <div className='grid gap-5  rounded-xl p-10 bg-[url(/assets/images/slider.jpg)] bg-opacity-20 bg-cover bg-fixed group'>
        <a href={appBaseRoutes.dashboard} className='!text-white border w-max rounded-full flex items-center gap-2 px-5 py-2 border-primary/50 hover:bg-primary/10 transition-all cursor-pointer '>
          Start Now <FaArrowRightLong className='text-primary' />
        </a>
  
        <div
          className='flex flex-col md:flex-row gap-5 justify-between align-text-top'
          initial={{ opacity: 0, x: -30 }}
          whileinview={{ opacity: 1, x: 0 }}
          viewport={{once:false}}
          transition={{ duration: 0.6 }}
        >
          <div className='grid gap-3 w-full'>
        <LazyMotion features={domAnimation}>
            <m.h1 className='text-3xl lg:text-5xl font-tight tracking-widest text-shadow-lg'>
               <b className='text-primary text-shadow'> A Gateway</b>  to Effortless Crypto  
            </m.h1>
            <m.h1 className='text-3xl lg:text-5xl font-tight tracking-widest text-shadow-lg'>
              Access
            </m.h1>
          </LazyMotion>
          </div>
  
          {/* Gradient Cards */}
          <div className='flex gap-5 w-full bg-white/5 rounded-xl p-5 backdrop-blur'>
            {cards?.map((card, i) => (
              <div key={i} className='space-y-2 w-1/2 '>
                <h2 className="text-lg font-medium">{card?.title}</h2>
                <p className='text-sm'>{card?.desc}</p>
                {/* <p className='!text-primary'>Learn More.</p> */}
              </div>
            ))}
          </div>
        </div>
  
        {/* Image & Accordion */}
        <div className='w-full flex flex-col md:flex-row gap-5'>
            <img
              src="/assets/images/sphere.png"
              alt=""
              className='w-1/2 absolute bottom-0 opacity-40 md:opacity-100 md:relative drop-shadow-[30px_-20px_40px_rgba(0,0,0,1)] group-hover:scale-110 grayscale-60    transition-all duration-1000 '
            />
          <div className='flex flex-col gap-5 items-start justify-start w-full relative'>
            {/* <h1 className='text-3xl md:text-5xl font-tight tracking-widest'>
              Building A Better
            </h1> */}
            <FeaturesAccordion />
          </div>
        </div>
      </div>

    );
  }
  



export default function SectionFeatures2() {
  return (
 <div className='md:h-[100vh] h-full relative  overflow-y-scroll md:overflow-y-none bg-black '>
      
      <div 
      className=' w-full    overflow-hidden   relative'>
        <div className='  pb-10 pr-2 pl-1 '>
          <div className='container   h-full'  >
              <Section2 />
          </div>
        </div>
      </div>
    </div>  
    )
}
