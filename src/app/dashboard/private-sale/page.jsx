"use client"
import React from 'react'
import { Web3Provider } from '@/providers/Web3Provider'
import Presale from './Presale';





export default function page() {

    return (
        <>
            <Web3Provider >
                <Presale />
            </Web3Provider >
        </>
    )
}
