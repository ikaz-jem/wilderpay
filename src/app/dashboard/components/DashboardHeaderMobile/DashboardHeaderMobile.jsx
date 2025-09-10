"use client"
import Avatar from '../Avatar/Avatar'
import { useRouter } from 'next/navigation'
import { GrFormPreviousLink } from "react-icons/gr";
import { usePathname } from 'next/navigation';

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
        <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-5'>
         {pathname !== "/dashboard"  &&  <GrFormPreviousLink className='text-5xl text-white bg-white/10 rounded-full p-2 cursor-pointer hover:scale-110 transition-all' onClick={()=>router.back()}  />}

            <h1 className=''>{extractTitle(pathname)}</h1>
            </div>
            <Avatar img={user?.image ? user.image : null} name={user.email} />
        </div>

    )
}
