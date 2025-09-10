"use client"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

import { LuLogOut } from "react-icons/lu";
import { signOut } from 'next-auth/react';
import { mutate } from "swr";

import { MdAccountCircle } from "react-icons/md";
import { RiFundsLine } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import { appBaseRoutes } from '@/routes';
import BorderEffect from '../BorderEffect/BorderEffect';
import { MdPayment } from "react-icons/md";

import { BsGridFill } from "react-icons/bs";
import { BsPersonLinesFill } from "react-icons/bs";
import { BiTransferAlt } from "react-icons/bi";
import { FaPiggyBank } from "react-icons/fa";
import { BsFillSendFill } from "react-icons/bs";
import { FaChartPie } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";



export default function Avatar({ img,name }) {

  const router = useRouter()

  const handleLogout = async () => {
    await signOut();
    mutate(() => true, undefined, { revalidate: false }); // clear all SWR cache
    // Clear Zustand, localStorage, etc. here too
  };

  function Navigate(path) {
    router.push(path)
  }



  return (
    <div >
      <Menu>
        <MenuButton className="cursor-pointer" >
          {
            img ? 
            <img src={img} alt="" className='w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-all' />
            :
            <p className='w-10 h-10 uppercase bg-neutral-400 !text-black text-lg rounded-full flex items-center justify-center hover:scale-110 transition-all'>{name.slice(0,2)}</p>
          }
        </MenuButton>
        <MenuItems
          transition
          anchor="bottom end"
          className=" w-52 shadow-lg shadow-black origin-top-right rounded-xl border border-white/5 bg-card backdrop-blur-xl p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
        >

          <p className='px-5  text-sm '>My Wallet</p>
          <div className="my-1 h-px bg-white/5" />
          <MenuItem className='cursor-pointer' onClick={() => Navigate(appBaseRoutes.deposit)}>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 data-focus:!text-primary">
              <FaPiggyBank className="size-3 fill-white/30 group-hover:!fill-primary" />
              Add Funds
            </button>
          </MenuItem>
          <MenuItem className='cursor-pointer' onClick={() => Navigate(appBaseRoutes.withdraw)}>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 data-focus:!text-primary">
              <MdPayment className="size-3 fill-white/30 group-hover:!fill-primary" />
              Withdraw
            </button>
          </MenuItem>

          <MenuItem className='cursor-pointer' onClick={() => Navigate(appBaseRoutes.convert)}>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 data-focus:!text-primary">
              <BiTransferAlt className="size-3 fill-white/30 group-hover:!fill-primary" />
              Convert
            </button>
          </MenuItem>
          <MenuItem className='cursor-pointer' onClick={() => Navigate(appBaseRoutes.transfer)}>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 data-focus:!text-primary">
              <BsFillSendFill className="size-3 fill-white/30 group-hover:!fill-primary" />
              Transfer Assets
            </button>
          </MenuItem>

          <div className="my-1 h-px bg-white/5" />
          <p className='px-5  text-sm '>My Portfolio</p>
          <div className="my-1 h-px bg-white/5" />


          <MenuItem className='cursor-pointer' onClick={() => Navigate(appBaseRoutes.contracts)}>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 data-focus:!text-primary ">
              <IoDocuments className="size-3 fill-white/30 group-hover:!fill-primary" />
              Contracts
            </button>
          </MenuItem>

          <MenuItem className='cursor-pointer' onClick={() => Navigate(appBaseRoutes.invest)}>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 data-focus:!text-primary">
              <FaChartSimple className="size-3 fill-white/30 group-hover:!fill-primary" />
              Invest
            </button>
          </MenuItem>

          <MenuItem className='cursor-pointer' onClick={() => Navigate(appBaseRoutes.dashboard)}>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 data-focus:!text-primary">
              <FaChartPie className="size-3 fill-white/30 group-hover:!fill-primary" />
              Assets
            </button>
          </MenuItem>
          <MenuItem className='cursor-pointer' onClick={() => Navigate(appBaseRoutes.referrals)}>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 data-focus:!text-primary">
              <BsPersonLinesFill className="size-3 fill-white/30 group-hover:!fill-primary" />
              Account
            </button>
          </MenuItem>


          < BorderEffect />
        
          <div className="my-1 h-px bg-white/5" />
          <MenuItem className='cursor-pointer' onClick={() => Navigate(appBaseRoutes.settings)}>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 data-focus:!text-primary">
              <MdAccountCircle className="size-3 fill-white/30 group-hover:!fill-primary" />
              Settings
            </button>
          </MenuItem>
          <MenuItem className='cursor-pointer' onClick={handleLogout}>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 data-focus:!text-primary !text-red-500/80">
              <LuLogOut className="size-3 text-white/30 group-hover:!text-primary" />
              Sign Out  
            </button>
          </MenuItem>

        </MenuItems>
      </Menu>
    </div>
  )
}