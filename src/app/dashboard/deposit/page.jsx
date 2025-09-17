"use client"
import React from 'react'
import Transfer from './Transfer'
import { Web3Provider } from '@/providers/Web3Provider'


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
