"use client"
import Avatar from '../Avatar/Avatar'
import { useRouter } from 'next/navigation'
import { GrFormPreviousLink } from "react-icons/gr";
import { usePathname } from 'next/navigation';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'

function Example() {
  return (
    <Popover>
      {({ open }) => (
        <>
          <PopoverButton>Solutions</PopoverButton>
          <AnimatePresence>
            {open && (
              <PopoverPanel
                static
                as={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                anchor="bottom"
                className="flex origin-top flex-col"
              >
                <a href="/analytics">Analytics</a>
                <a href="/engagement">Engagement</a>
                <a href="/security">Security</a>
                <a href="/integrations">Integrations</a>
              </PopoverPanel>
            )}
          </AnimatePresence>
        </>
      )}
    </Popover>
  )
}

export default function DashboardHeaderMobile({session}) {
    const router = useRouter()
   const pathname = usePathname();
   const user = session.user

   function extractTitle (path){
        switch (path) {
            case "/dashboard/deposit":
           return"Deposit"
            case "/dashboard/withdraw":
           return"Withdraw"
            case "/dashboard/invest":
           return"Invest"
            case "/dashboard/referrals":
           return"Referrals"
            case "/dashboard/settings":
           return"Account Settings"
            case "/dashboard/convert":
           return"Convert Balance"
            case "/dashboard/contracts":
           return"Manage Contracts"
            case "/dashboard/transfer":
           return"Transfer Funds"
            case "/dashboard/account":
           return"Account Summary"
            case "/dashboard/account/referrals":
           return"All Referrals"
            case "/dashboard/account/transactions":
           return"Transactions History"
           default: return "Dashboard"
        }
      }
      

    return (
        <div className='flex items-center justify-between w-full sticky top-0 px-10 py-2     bg-card border border-primary/10 rounded-full backdrop-blur'>
            <div className='flex items-center gap-2'>
         {pathname !== "/dashboard"  &&  <GrFormPreviousLink className='text-4xl text-white bg-white/10 rounded-full p-2 cursor-pointer hover:scale-110 transition-all' onClick={()=>router.back()}  />}

            <h1 className=''>{extractTitle(pathname)}</h1>
            </div>
            <Avatar img={user?.image ? user.image : null} name={user.email} />
        </div>

    )
}
