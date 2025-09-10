"use client"
import React from 'react'
import CryptoPayments from './CryptoPayments'
import Transfer from './Transfer'
import { Web3Provider } from '@/providers/Web3Provider'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { RiBnbFill } from "react-icons/ri";

// import MultiChainPayment from './MultichainPayment'

export default function page() {
  return (
    <>

      <TabGroup>
        <TabList className="flex gap-4">
          <Tab
            className="rounded-full flex gap-2 items-center px-3 py-1 text-sm/6 font-semibold text-white outline-none data-hover:bg-white/5 data-selected:bg-white/10 data-selected:data-hover:bg-white/10">
            <RiBnbFill className='text-lg' />
            <p className='text-white'>Wallet Deposit</p>
          </Tab>
          <Tab
            className="rounded-full flex gap-2 items-center px-3 py-1 text-sm/6 font-semibold text-white outline-none data-hover:bg-white/5 data-selected:bg-white/10 data-selected:data-hover:bg-white/10">
            <RiBnbFill className='text-lg' />
            <p className='text-white'>Direct Deposit</p>
          </Tab>
        </TabList>
        <TabPanels className="mt-3 ">

          <TabPanel className="rounded-xl bg-card  backdrop-blur-xl     ">
            <Web3Provider >
              <Transfer />
            </Web3Provider >
          </TabPanel>
          <TabPanel className="rounded-xl bg-card  backdrop-blur-xl     ">
              <CryptoPayments /> 
          </TabPanel>

        </TabPanels>
      </TabGroup>



    </>
  )
}
