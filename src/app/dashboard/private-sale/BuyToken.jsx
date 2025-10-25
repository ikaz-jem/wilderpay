'use client';

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import privateSaleABI from './abi';
import { bscTestnet } from '@reown/appkit/networks';
import { addresses } from '../staticData';
import ButtonPrimary from '@/app/components/ButtonPrimary';
import BorderEffect from '../components/BorderEffect/BorderEffect';
import { formatEther } from 'viem';
import { toast } from 'sonner';
import { IoMdSwap } from "react-icons/io";
import { formatCustomPrice } from '@/app/utils/formatPrice';

const CONTRACT_ADDRESS = addresses.privateSale

export default function BuyTokens({ data, tokenPrice, chainId }) {
    const { address, isConnected } = useAccount();
    const [bnbAmount, setBnbAmount] = useState('1');
    const [hash, setHash] = useState(undefined);

    const { writeContract, isPending, error } = useWriteContract();

    const { isLoading, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });



    let raised = Number(formatEther(data.totalRaised.toString()))



    const handleBuy = () => {
        if (!data.saleActive) {
            toast('Sale Is Not Live Yet')
        }
        if (!bnbAmount || isNaN(Number(bnbAmount))) return;

        writeContract({
            abi: privateSaleABI,
            address: CONTRACT_ADDRESS,
            functionName: 'buyTokens',
            chainId: chainId,
            value: BigInt(Math.floor(Number(bnbAmount) * 1e18)), // Convert BNB to wei
        }, {
            onSuccess(tx) {
                setHash(tx);
            },
            onError(err) {
                console.error("Buy error", err);
            }
        });
    };

    return (


        <div className='grid w-full space-y-5'>
            <div className=' w-full justify-between border border-primary/10 p-5  rounded-xl backdrop-blur-xl relative overflow-hidden space-y-5 bg-black/80 '>
                <BorderEffect />


                <div className='flex items-center gap-2'>
                    <img src="/assets/images/crypto/wpay.webp" className='w-8 h-8' alt="" />

                    <p className='text-2xl font-semibold capitalize !text-highlight' >Buy $WPAY Token</p>
                </div>

<div className='flex w-full justify-center items-center gap-2'>
                    <img src="/assets/images/crypto/bnb.svg" className='w-10 h-10' alt="" />
                    <IoMdSwap className='text-2xl'/>

                    <img src="/assets/images/crypto/wpay.webp" className='w-10 h-10' alt="" />

</div>

                <p className='!text-yellow-500 text-center'>1 BNB = {formatCustomPrice(Number(tokenPrice))} WilderPay Tokens</p>


                <div className='flex items-center gap-2 w-full'>

                    <div className='w-full space-y-2'>
                        <p >BNB Amount</p>
                        <input
                            type="number"
                            value={bnbAmount}
                            onChange={e => setBnbAmount(e.target.value)}
                            placeholder="Enter BNB amount"
                            step="0.01"
                            min="0"
                            className='bg-white/10 w-full placeholder:text-xs text-white rounded h-10 p-3 text-sm outline-none focus:border-primary/50 focus:border disabled:cursor-not-allowed disabled:bg-neutral-500/60'
                        />
                        <p className='text-accent text-xs'> You will receive {formatCustomPrice(Number(bnbAmount * tokenPrice))} WilderPay Tokens</p>



                    </div>

                    <ButtonPrimary disabled={isPending || !bnbAmount || !data?.saleActive} loading={isPending} onClick={handleBuy}>
                        {isPending ? 'Waiting for wallet...' : 'Contribute'}
                    </ButtonPrimary>


                </div>



                <div className="space-y-3">
                    <div>
                        <div className="w-full bg-highlight/20 rounded-full overflow-hidden relative">
                            <p className="bg-highlight  p-2  rounded-full animate-pulse" style={{ width: `${(raised * 2)}%` }} >  </p>

                        </div>

                    </div>
                    <div className="flex items-center justify-between">
                        <p className="uppercase text-xs"> {raised} BNB </p>
                        <p className=" uppercase text-xs">{50} BNB  </p>
                    </div>
                </div>





                {isLoading && <p className='text-xs'>⏳ Transaction confirming...</p>}
                {isSuccess && <a className='text-xs' href={`https://bscscan.com/tx/${hash}`} target='_blank'>✅ Tx hash: {hash}</a>}
                {error && <p className='text-xs'>❌ Error: {error.message}</p>}
            </div>





        </div>

    );
}
