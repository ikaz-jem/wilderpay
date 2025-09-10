import { FaLevelDownAlt } from "react-icons/fa";
import BorderEffect from "../../components/BorderEffect/BorderEffect";
import { IoPersonAdd } from 'react-icons/io5';


import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { coinIcon } from "../../staticData";


export default function IndirectReferrals({ userData }) {

    return (
        <>

            <div className="p-5 mx-auto  space-y-5 w-full backdrop-blur-xl bg-card rounded border border-primary/10 relative">
                <BorderEffect />

                <div className="flex flex-col justify-center gap-1">
                    <h1 className="text-lg tracking-wider uppercase">Indirect Referrals : </h1>
                    <p className=" text-xs !text-neutral">Indirect Referrals Up to Level 5</p>
                </div>

                {
                    userData && Object?.keys(userData)?.length > 0 ? (
                        <div className="space-y-3 h-80 overflow-y-scroll ">
                            <div className="text-sm space-y-1">
                                {Object?.entries(userData)?.map(([level, data], i) =>{ 
                                    
                                if (Number(data?.count) == 0) return
                                    
                                    return (
                                    <div key={i} className="bg-white/5 rounded ">
                                        <Disclosure as="div" className="p-3   " defaultOpen={level == 1}>
                                            <DisclosureButton className="group flex items-center justify-between w-full cursor-pointer border- border-primary/10">
                                                <div className="flex items-center gap-2 justify-between  w-full">
                                                    <p className={`!text-md !text-accent font-semibold  truncate uppercase '`}> {Number(level) == 1 ? `Direct Referrals ` : `Level ${Number(level) || 0}`}  </p>

                                                    <div className="flex items-center gap-1 px-5 ">
                                                        <IoPersonAdd className='text-neutral' />
                                                        <p className={`!text-xs truncate capitalize !text-primary '`}>{data?.count || 0} Referrals </p>
                                                        {/* <p className={`!text-xs truncate capitalize !text-orange-500/50 '`}>{formatISO(user?.createdAt) || ''}</p> */}
                                                    </div>

                                                </div>
                                                <FaLevelDownAlt className="size-5 fill-white/60 group-data-hover:fill-primary/50 group-data-open:rotate-180" />
                                            </DisclosureButton>
                                            <DisclosurePanel className="mt-2 space-y-2 text-sm/5 text-white/50 ">


                                                {userData && Object?.keys(data.balancesByCurrency)?.length > 0 &&

                                                    <div className="grid w-full gap-1">
                                                        <p className="text-xs uppercase !text-primary">  Balances : </p>
                                                        <div className="flex gap-1 flex-wrap w-full">

                                                            {
                                                                Object?.entries(data.balancesByCurrency)?.map(([currency, balance], i) =>
                                                                    <div key={currency} className="flex items-center gap-1 justify-center bg-card rounded p-1 ">

                                                                        <img src={coinIcon[currency]} alt="" className="w-4 h-4" />
                                                                        <p className="text-xs uppercase">   {balance} {currency}  </p>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    </div>

                                                }
                                                {userData && Object?.keys(data.stakingsByCurrency)?.length > 0 &&

                                                    <div className="grid w-full gap-1">
                                                        <p className="text-xs uppercase !text-primary">  Stakings : </p>
                                                        <div className="flex gap-1 flex-wrap w-full">

                                                            {
                                                                Object?.entries(data.stakingsByCurrency)?.map(([currency, balance], i) =>
                                                                    <div key={currency} className="flex items-center gap-1 justify-center bg-card rounded p-1 ">

                                                                        <img src={coinIcon[currency]} alt="" className="w-4 h-4" />
                                                                        <p className="text-xs uppercase !text-green-500">   {balance} {currency}  </p>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    </div>

                                                }
                                                {data?.users?.length > 0 &&

                                                    <div className="grid w-full gap-1">
                                                        <p className="text-xs uppercase !text-primary">  Referral's Volume : </p>
                                                        <div className="flex gap-1 flex-wrap w-full">

                                                            {
                                                                data?.users?.map((user, i) =>
                                                                    <div key={i} className="flex items-center gap-1 justify-between bg-card rounded p-1  w-full">

                                                                        <p className="text-xs "> {user?.email} :  </p>
                                                                        <p className="text-xs !text-green-500"> {user?.totalVolume}$ </p>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    </div>

                                                }

                                            </DisclosurePanel>
                                        </Disclosure>




                                    </div>
                                )}
                                
                                )}
                            </div>
                        </div>
                    )
                        :

                        (<div className="space-y-3">
                            <div>
                                <ul className="text-sm space-y-1">

                                    <li className="bg-white/5 rounded p-5 w-full space-y-2">
                                        <div className="flex items-center gap-2 ">
                                            <p className={`truncate '`}>Nothing Yet !</p>
                                        </div>
                                    </li>

                                </ul>
                            </div>
                        </div>)

                }
            </div>

        </>
    )

}



