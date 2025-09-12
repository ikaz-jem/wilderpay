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

      <Web3Provider >
        <Transfer />
      </Web3Provider >



    </>
  )
}
