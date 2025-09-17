"use client"
import Avatar from '../Avatar/Avatar'
import { useRouter } from 'next/navigation'
import { GrFormPreviousLink } from "react-icons/gr";
import { usePathname } from 'next/navigation';



import { useState } from 'react'
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from '@headlessui/react'
import {
    ArrowPathIcon,
    Bars3Icon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
    XMarkIcon,
    ArrowsRightLeftIcon,
    UserGroupIcon,
    CommandLineIcon, WalletIcon

} from '@heroicons/react/24/outline'

import { BsRobot } from 'react-icons/bs';
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import { appBaseRoutes } from '@/routes';
import { LuChartCandlestick } from "react-icons/lu";
import { signOut } from 'next-auth/react';




const products = [
    { name: 'Assets', description: 'View Your Assets', href: appBaseRoutes.dashboard, icon: ChartPieIcon },
    { name: 'Deposit', description: 'Deposit Funds to your Account', href: appBaseRoutes.deposit, icon: CursorArrowRaysIcon },
    { name: 'Withdraw', description: 'Withdraw To An External Wallet', href: appBaseRoutes.withdraw, icon: FingerPrintIcon },
    { name: 'Transfer', description: 'Transfer Funds Between Accounts', href: appBaseRoutes.transfer, icon: SquaresPlusIcon },
    { name: 'Swap', description: 'Convert Your Assets', href: appBaseRoutes.convert, icon: ArrowPathIcon },
    { name: 'Transactions', description: 'Convert Your Assets', href: appBaseRoutes.transactions, icon: ArrowsRightLeftIcon },
]
const trading = [
    { name: 'Activate Share', description: 'Activate Robot Trading', href: appBaseRoutes.invest, icon: BsRobot },
    { name: 'Investments', description: 'View Activated Shares', href: appBaseRoutes.contracts, icon: ChartPieIcon },
    { name: 'Live Stats', description: 'Robot Trading Stats - Beta', href: appBaseRoutes.terminal, icon: CommandLineIcon },

]

const links = [
    { name: 'Dashboard', href: appBaseRoutes.dashboard, icon: PlayCircleIcon },
    { name: 'Community', href: appBaseRoutes.dashboard, icon: UserGroupIcon },
]






export default function DashboardHeaderMobile({ session }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        await signOut();

    };

    const router = useRouter()
    const pathname = usePathname();
    const user = session.user

    function extractTitle(path) {
        switch (path) {
            case "/dashboard/deposit":
                return "Deposit"
            case "/dashboard/withdraw":
                return "Withdraw"
            case "/dashboard/invest":
                return "Invest"
            case "/dashboard/referrals":
                return "Referrals"
            case "/dashboard/settings":
                return "Account Settings"
            case "/dashboard/convert":
                return "Convert Balance"
            case "/dashboard/contracts":
                return "Manage Contracts"
            case "/dashboard/transfer":
                return "Transfer Funds"
            case "/dashboard/account":
                return "Account Summary"
            case "/dashboard/account/referrals":
                return "All Referrals"
            case "/dashboard/account/transactions":
                return "Transactions History"
            default: return "Dashboard"
        }
    }


    return (
        <div className='flex items-center justify-between w-full bg-card rounded-full border border-primary/10 px-5 py-2'>


            <header className=" w-full">
                <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between ">
                    <div className="flex lg:flex-1 gap-2">
                        {pathname == "/dashboard" && <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">WilderPay</span>
                            <img
                                alt=""
                                src="/assets/images/logo.webp"
                                className="h-8 w-auto"
                            />
                        </a>}

                        <div className='flex items-center gap-5'>
                            {pathname !== "/dashboard" && <GrFormPreviousLink className='text-5xl text-white bg-primary/10 border border-primary/10 rounded-full p-2 cursor-pointer hover:scale-110 transition-all' onClick={() => router.back()} />}

                            <h1 className=''>{extractTitle(pathname)}</h1>
                        </div>


                    </div>


                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <PopoverGroup className="hidden lg:flex lg:gap-x-5">
                        <Popover className="relative">
                            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold !text-primary cursor-pointer hover:!text-accent">
                                Wallet
                                <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-500" />
                            </PopoverButton>

                            <PopoverPanel
                                transition
                                className=" shadow-xl shadow-black/20 font-primary absolute left-1/2 z-[999] mt-3 w-screen h-max max-w-md -translate-x-1/2 overflow-hidden rounded-3xl backdrop-blur-xl outline-1 -outline-offset-1 outline-primary/10 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                            >
                                <div className="p-4 ">
                                    {products.map((item) => (
                                        <div
                                            key={item.name}
                                            className=" group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-white/5"
                                        >
                                            <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-700/50 group-hover:bg-accent">
                                                <item.icon aria-hidden="true" className="size-6 text-gray-400 group-hover:text-white" />
                                            </div>
                                            <div className="flex-auto ">
                                                <a href={item.href} className="block font-semibold  font-primary text-primary">
                                                    {item.name}
                                                    <span className="absolute inset-0" />
                                                </a>
                                                <p className="mt-1 text-neutral">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-white/10 bg-gray-700/50">
                                    {links.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className="!font-primary flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-white hover:bg-gray-700/50"
                                        >
                                            <item.icon aria-hidden="true" className="size-5 flex-none text-accent" />
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                            </PopoverPanel>
                        </Popover>
                        {
                            links?.map((link, key) => <a key={key} href={link?.href} className="font-primary text-sm/6 font-semibold !text-primary hover:!text-accent">
                                {link?.name}
                            </a>)
                        }


                        <Popover className="relative">
                            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold !text-primary cursor-pointer hover:!text-accent">
                                Trading
                                <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-500" />
                            </PopoverButton>

                            <PopoverPanel
                                transition
                                className=" shadow-xl shadow-black/20 font-primary absolute left-1/2 z-[999] mt-3 w-screen h-max max-w-md -translate-x-1/2 overflow-hidden rounded-3xl backdrop-blur-xl outline-1 -outline-offset-1 outline-primary/10 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                            >
                                <div className="p-4 ">
                                    {trading.map((item) => (
                                        <div
                                            key={item.name}
                                            className=" group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-white/5"
                                        >
                                            <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-700/50 group-hover:bg-accent">
                                                <item.icon aria-hidden="true" className="size-6 text-gray-400 group-hover:text-white" />
                                            </div>
                                            <div className="flex-auto ">
                                                <a href={item.href} className="block font-semibold  font-primary text-primary">
                                                    {item.name}
                                                    <span className="absolute inset-0" />
                                                </a>
                                                <p className="mt-1 text-neutral">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </PopoverPanel>
                        </Popover>

                    </PopoverGroup>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <Avatar img={user?.image ? user.image : null} name={user.email} />
                    </div>
                </nav>
                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                    <div className="fixed inset-0 z-50" />
                    <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto backdrop-blur-xl p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
                        <div className="flex items-center justify-between">
                            <a href="#" className="-m-1.5 p-1.5">
                                <span className="sr-only">WilderPay</span>
                                <img
                                    alt=""
                                    src="/assets/images/logo.webp"
                                    className="h-8 w-auto"
                                />
                            </a>
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-2.5 rounded-md p-2.5 text-gray-400"
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon aria-hidden="true" className="size-6" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-white/10">
                                <div className="space-y-2 py-6">
                                    <Disclosure as="div" className="-mx-3">
                                        <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold !text-primary hover:!text-accent hover:bg-white/5">

                                            <WalletIcon aria-hidden="true" className="size-6 text-gray-400 group-hover:text-white" />
                                            Wallet
                                            <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
                                        </DisclosureButton>
                                        <DisclosurePanel className="mt-2 space-y-2">
                                            {[...products].map((item) => (
                                                <DisclosureButton
                                                    key={item.name}
                                                    as="a"
                                                    href={item.href}
                                                    className="flex items-center gap-2  rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold !text-primary hover:!text-accent hover:bg-white/5"
                                                >
                                                    <item.icon aria-hidden="true" className="size-6 text-gray-400 group-hover:text-white" />

                                                    {item.name}
                                                </DisclosureButton>
                                            ))}
                                        </DisclosurePanel>
                                    </Disclosure>
                                    <Disclosure as="div" className="-mx-3">
                                        <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold !text-primary hover:!text-accent hover:bg-white/5">
                                            <LuChartCandlestick aria-hidden="true" className="size-6 text-gray-400 group-hover:text-white" />

                                            Trading
                                            <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
                                        </DisclosureButton>
                                        <DisclosurePanel className="mt-2 space-y-2">
                                            {trading.map((item) => (
                                                <DisclosureButton
                                                    key={item.name}
                                                    as="a"
                                                    href={item.href}
                                                    className="flex items-center gap-2  rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold !text-primary hover:!text-accent hover:bg-white/5"
                                                >
                                                    <item.icon aria-hidden="true" className="size-6 text-gray-400 group-hover:text-white" />

                                                    {item.name}
                                                </DisclosureButton>
                                            ))}
                                        </DisclosurePanel>
                                    </Disclosure>


                                    {
                                        links?.map((link, key) => <a key={key} href={link.href} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold !text-primary hover:!text-accent hover:bg-white/5">
                                            {link?.name}
                                        </a>)
                                    }

                                    <a href={appBaseRoutes.settings} className="cursor-pointer text-left gap-2 -mx-3 flex items-center  w-full rounded-lg px-3 py-2 text-base/7 font-semibold !text-primary hover:!text-accent hover:bg-white/5">
                                        Settings
                                    </a>


                                    <button onClick={() => handleLogout()} className="cursor-pointer text-left gap-2 -mx-3 flex items-center  w-full rounded-lg px-3 py-2 text-base/7 font-semibold !text-primary hover:!text-accent hover:bg-white/5">
                                        Logout

                                    </button>

                                </div>

                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
            </header>

        </div>

    )
}






