
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
                <div className="w-full ">
                    <TabGroup>
                        <TabList className="flex gap-4">
                            <Tab
                                className="rounded-full flex gap-2 items-center px-3 py-1 text-sm/6 font-semibold text-white   data-hover:bg-white/5 data-selected:bg-white/10 data-selected:data-hover:bg-white/10">
                                <RiBnbFill className='text-lg' />
                                <p className='text-white'>Account</p>
                            </Tab>
                            {/* <Tab
                                className="rounded-full flex gap-2 items-center px-3 py-1 text-sm/6 font-semibold text-white   data-hover:bg-white/5 data-selected:bg-white/10 data-selected:data-hover:bg-white/10">
                                <RiBnbFill className='text-lg' />
                                <p className='text-white'>Payments</p>
                            </Tab> */}
                        </TabList>
                        <TabPanels className="mt-3">
                            <TabPanel className="rounded-xl bg-card backdrop-blur-xl ">

                                <BorderEffect/>
                                <AccountSettings user={profile} />

                            </TabPanel>
                            {/* <TabPanel className="rounded-xl  bg-card backdrop-blur-xl ">
                                <BorderEffect/>
                                <PaymentSettings user={profile} />

                            </TabPanel> */}
                        </TabPanels>
                    </TabGroup>
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