
//   const binancePrice = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT').then(res => res.data);
//   console.log({ binancePrice })

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { RiBnbFill } from "react-icons/ri";
import AccountSettings from './AccountSettings';
import { useSession } from 'next-auth/react';
// import PaymentSettings from './PaymentSettings';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/app/lib/db';
import User from '@/app/models/userSchema/UserSchema';
import BorderEffect from '../components/BorderEffect/BorderEffect';


async function userProfile() {
    "use server"
    const session = await getServerSession(authOptions)
    if (!session) return ({ success: false, message: 'Access denied' }, { status: 400 });
    await dbConnect()
    const user = await User.findOne({ _id: session.user.id })
    if (!user) return ({ success: false, message: 'Not Found' }, { status: 400 });
    const parsed = await JSON.parse(JSON.stringify(user))
    parsed.password = null
    return parsed
}



export default async function page() {
    const profile = await userProfile()

    function DeopsitTypes() {
        "use client"
        return (
            <div className="flex  w-full justify-center  pt-5 ">
                <div className="w-full backdrop-blur-xl rounded-lg ">
               <BorderEffect/>
                                <AccountSettings user={profile} />
                </div>
            </div>
        )
    }



    return (
        <>
            <div className='max-w-lg mx-auto'>
                <DeopsitTypes />
            </div>

        </>
    )
}