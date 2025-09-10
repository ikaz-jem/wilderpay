
import { FaPlusCircle } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { appBaseRoutes } from "@/routes";
import Link from "next/link";
import { RiFundsFill } from "react-icons/ri";
import { TbCreditCardRefund } from "react-icons/tb";


import { MdSpaceDashboard } from "react-icons/md";


export default function DashboardNavMobile() {


    return (
        <div className='w-full h-max  fixed bottom-0 z-40 pointer-events-auto'>
            <div className='flex gap-10 justify-evenly bg-card border border-primary/10 backdrop-blur  my-5 mx-2 p-3 rounded-full'>
            <Link scroll={false} href={appBaseRoutes.dashboard}>
                <MdSpaceDashboard className='text-white/50 text-3xl hover:!text-primary cursor-pointer' />
            </Link>

            <Link scroll={false} href={appBaseRoutes.dashboard}>
                <RiFundsFill className='text-white/50 text-3xl hover:!text-primary cursor-pointer' />
            </Link>

            <Link scroll={false} href={appBaseRoutes.deposit}>
                <FaPlusCircle className='text-primary outline-8 rounded-full outline-background text-5xl hover:!text-accent hover:scale-120 transition-all cursor-pointer -m-5' />
            </Link>

            <Link scroll={false} href={appBaseRoutes.withdraw}>
                <TbCreditCardRefund className='text-white/50 text-3xl hover:!text-primary cursor-pointer' />
            </Link>

            <Link scroll={false} href={appBaseRoutes.settings}>
                <IoMdSettings className='text-white/50 text-3xl hover:!text-primary cursor-pointer' />
            </Link>
            </div>
        </div>
    )
}
