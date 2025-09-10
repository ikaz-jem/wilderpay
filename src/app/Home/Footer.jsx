import { FaTelegram } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import BrandsSlider from "./components/BrandsSlider/BrandsSlider";
import Link from "next/link";


export default function Footer() {
  return (
    <div className="h-[100vh] flex flex-col justify-between backdrop-blur-xs grayscale-50">

      <div className="w-full h-full pt-30 px-5 flex flex-col gap-5  sepia-100">

       
            <h1 className='text-3xl md:text-7xl tracking-widest font-bold ' >Grow Your Portfolio — The Smart Way </h1>
            <h1 className=' tracking-widest font-bold  w-[50%]' >Join a new era of intelligent investing. Start earning with Yieldium and take control of your financial future.
 </h1>

      </div>


      <div className="w-full   bg-neutral-900 p-10">
        <div className="flex justify-between items-center">

          <div className='space-y-3 '>
            <h1 className='text-3xl md:text-4xl tracking-widest font-bold ' >Building A Better </h1>
            <h1 className='text-3xl md:text-4xl font-light tracking-widest !text-primary ' >Financial Future </h1>
          </div>



          <div className="flex gap-5 grayscale-0">
            <Link href="https://x.com/YieldiumApp?t=ODMrlTltn4Yp_4SLYjiE-A&s=09" target="_blank">
            <FaSquareXTwitter className="text-4xl text-neutral cursor-pointer hover:text-primary transition-all" />
            </Link>
            <Link href='https://t.me/YieldiumApps' target="_blank" >
            <FaTelegram className="text-4xl text-neutral cursor-pointer hover:text-primary transition-all" />
            </Link>
          </div>


        </div>
        {/* <BrandsSlider /> */}

      </div>
    </div>
  )
}
