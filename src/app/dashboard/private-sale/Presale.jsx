"use client"
import React from 'react'
import { Web3Provider } from '@/providers/Web3Provider'
import { useAppKit } from '@reown/appkit/react'
import { useAppKitAccount } from "@reown/appkit/react";
import ButtonPrimary from '@/app/components/ButtonPrimary';
import { useSwitchChain } from 'wagmi';


import { useAccount, useReadContract } from 'wagmi';
import privateSaleABI from './abi';
import tokenAbi from './tokenAbi.json';
import { bscTestnet, bsc } from '@reown/appkit/networks';
import { formatEther } from 'viem';
import BuyToken from './BuyToken';
import { useEffect } from 'react';
// import MultiChainPayment from './MultichainPayment'
import { IoMdCopy } from "react-icons/io"
import { RiFundsBoxFill } from "react-icons/ri";
import { RiDiscountPercentFill } from "react-icons/ri";
import { FaCoins } from "react-icons/fa";


import { IoArrowForward } from "react-icons/io5";
import { appBaseRoutes } from "@/routes"
import Link from "next/link"
import { BsFillPeopleFill } from "react-icons/bs";
import { FaChartArea } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import BorderEffect from "../components/BorderEffect/BorderEffect";
import { ClipLoader } from "react-spinners";
import SaleCountdown from './SaleCountdown';
import { addresses } from '../staticData';
import { toast } from 'sonner';
import { formatCustomPrice, formatPrice } from '@/app/utils/formatPrice';
import TokenDistributionChart from './TokenDistributionChart';
import Loading from '../loading';
import { ClaimTokens } from './ClaimTokens';
import { ClaimPresaleBonus } from './claimPresaleBonusAction';


const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link)
    toast.success("copied!")
}


const chainId = bsc.id


function StatsCard({ data, loadingData }) {


    return (
        <div className='flex flex-col  w-full gap-3 border border-primary/10 p-5  rounded-xl backdrop-blur-xl relative overflow-hidden bg-card '>
            <BorderEffect />
            {
                !loadingData ?
                    <>
                        <div className='flex  gap-5 items-center '>

                            <div className='w-full flex justify-between'>
                                <div className='flex flex-col gap-5 '>
                                    <h1 className="uppercase text-sm">{data.title}</h1>
                                    <p className='text-3xl tracking-wider font-light !text-primary'>{data.value}</p>
                                    {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}
                                </div>
                                {data?.icon}
                            </div>
                        </div>

                        <div className="flex justify-between ">
                            <p className='text-xs'>{data.desc} </p>
                            {
                                data?.cta && <Link href={appBaseRoutes.contracts} className="text-xs flex gap-1 items-center !text-primary cursor-pointer hover:!text-accent transition-all">{data.cta}  <IoArrowForward />  </Link>

                            }
                        </div>
                    </>
                    :
                    <div className="w-full h-20 flex items-center justify-center">

                        <ClipLoader className='text-xs' color='var(--title)' size={25} />
                    </div>
            }
        </div>
    )
}



export default function Presale() {
    const { address, isConnected } = useAccount();
    const { data, isLoading, error } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: privateSaleABI,
        functionName: 'getUIData',
        args: [],
        chainId: chainId,
        watch: true,
        query: {
            enabled: true,
        },
    });


    const cardData = [
        {
            title: 'Token For Private Sale',
            value: `5% - 5B $WPAY`,
            icon: <FaCoins className="text-neutral text-3xl" />,
            desc: 'Token Dedicated For Private Sale ',
            cta: null
        },
        {
            title: 'Sale Round',
            value: '2',
            icon: <RiDiscountPercentFill className="text-neutral text-3xl" />,
            desc: 'Second Round',
            cta: null
        },
        {
            title: 'Total Raised',
            value: `${data && formatCustomPrice(Number(formatEther(data?.totalRaised.toString())), 4) || 0} BNB`,
            icon: <RiFundsBoxFill className="text-neutral text-3xl" />,
            desc: 'Total BNB Raised',
            cta: null
        },
    ]

    if (!data) return <Loading />

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5    w-full '>
                {
                    cardData.map((card, idx) => <StatsCard key={idx} data={card} />)
                }
            </div>

            <div className=" rounded-lg flex gap-5 items-center">
                <a className=" break-all !text-neutral hover:!text-accent text-sm" href={`https://bscscan.com/tx/0xbdf23e608901bdbc2bae9c197fe59573c973a65e135857a93752dad2f9b183d9`} target='_blank' >📜 Ownership Renounced : 0xbdf23e608901bdbc2bae9c197fe59573c973a65e135857a93752dad2f9b183d9 🔥🚀</a>
                <button onClick={() => copyToClipboard(addresses.token)} className="cursor-pointer hover:scale-110 hover:!text-green-500">
                    <IoMdCopy className="text-lg" />
                </button>
            </div>


            <div className='flex gap-5 md:flex-row-reverse md:flex-nowrap flex-wrap w-full'>

                <div className='grid w-full gap-3 h-max'>
                    <div className=' w-full h-max items-center justify-center border border-primary/10 p-5  rounded-xl backdrop-blur-xl relative overflow-hidden  bg-black/50'>
                        <BorderEffect />
                        <SaleCountdown start={data?.saleStart} end={data?.saleEnd} />
                    </div>
                    <PrivateSale address={address} isConnected={isConnected} />

                    {isConnected && <BuyToken chainId={chainId} data={data} tokenPrice={Number(formatEther(data?.rate?.toString()))} />}

                    <ClaimTokens chainId={chainId} address={address} isConnected={isConnected} />

                    <div className=' w-full justify-between border border-primary/10 p-5  rounded-xl backdrop-blur-xl relative overflow-hidden space-y-5 bg-card '>
                        <BorderEffect />

                        <p className='text-sm'>Or Send BNB Directly To the Private Sale Contract Address</p>

                        <div className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
                            <a className="text-sm break-all hover:!text-accent" href={`https://bscscan.com/address/${CONTRACT_ADDRESS}`} target='_blank' >{CONTRACT_ADDRESS}</a>
                            <button onClick={() => copyToClipboard(CONTRACT_ADDRESS)} className="cursor-pointer hover:scale-110 hover:!text-green-500">
                                <IoMdCopy className="text-lg" />
                            </button>
                        </div>
                    </div>
                </div>

                <UiData data={data} isLoading={isLoading} error={error} address={address} isConnected={isConnected} />
            </div>
        </>
    )
}



const CONTRACT_ADDRESS = addresses.privateSale;

export function PrivateSale({ address, isConnected }) {
    const { data, isLoading, error } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: privateSaleABI,
        functionName: 'getUserUIData',
        args: [address && address],
        chainId: chainId,
        watch: true,
        query: {
            enabled: address ? true : false,
        },
    });

    // console.log(data)
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!isConnected) return <div className='flex w-full justify-between border border-primary/10 p-5  rounded-xl backdrop-blur-xl relative overflow-hidden '>
        <BorderEffect />
        <p className='text-neutral'>Connect Your Wallet To continue</p>
        <ConnectWallet />
    </div>;

    const { contributedBNB, totalTokens, claimed, claimable } = data;
     let boughtAmount = Number(formatEther(contributedBNB?.toString()))
     let boughtTokens = Number(formatEther(totalTokens?.toString()))

    async function claim() {
        let percent = (boughtTokens * 10) / 100
        toast('Claiming Bonus Please Wait ...')
        const claimed = await ClaimPresaleBonus(percent,address)
        if (claimed.success) {
            return toast.success(claimed.message)
        } else {
            return toast.error(claimed.message)
        }
    }

    return (
        <div className='flex w-full justify-between border border-primary/10 p-5  rounded-xl backdrop-blur-xl relative overflow-hidden bg-black/80 '>
            <BorderEffect />
            <div>
                <h1>My Summary </h1>
                <p>Contributed: <span className='!text-accent'>{boughtAmount} BNB</span> </p>
                <p>Purchased:  <span className='!text-accent'>{boughtTokens} $WPAY</span></p>
                <p>Vested: <span className='!text-accent'>{formatEther(claimed?.toString())} $WPAY</span></p>
                <p>Claimable: <span className='!text-accent'>{formatEther(claimable?.toString())} $WPAY</span></p>
                {/* <ButtonPrimary className='w-max px-5 mt-5' disabled={boughtAmount == 0} onClick={claim}> Claim 10% Bonus </ButtonPrimary> */}
            </div>
            <ConnectWallet />
        </div>
    );
}






export function UiData({ data, isConnected, isLoading, error }) {


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>No data returned.</div>;

    let rate = Number(formatEther(data.rate.toString()))
    let unclaimedTokens = Number(formatEther(data.tokensLeftToClaim.toString()))
    let totalSolde = Number(formatEther(data.totalSold.toString()))
    let raisedBnb = Number(formatEther(data.totalRaised.toString()))

    return (


        <div className='grid gap-5 w-full h-max '>


            <TokenDistributionChart />

            <div className=' w-full justify-between border border-primary/10 p-5  rounded-xl backdrop-blur-xl relative overflow-hidden bg-card divide-y divide-primary/20 space-y-1 '>
                <BorderEffect />

                <h1>Private Sale Information</h1>
                <p>🔋Total Supply : <span className='!text-accent'>1T $WPAY</span> </p>
                <p>🕒 Sale Active: <span className='!text-accent'> {data.saleActive ? 'Yes' : 'No'}</span></p>
                <p>📅 Sale Start: <span className='!text-accent'> {new Date(Number(data.saleStart) * 1000).toLocaleString()}</span></p>
                <p>📅 Sale End: <span className='!text-accent'> {new Date(Number(data.saleEnd) * 1000).toLocaleString()}</span></p>
                <p>📊 Rate: <span className='!text-accent'> {formatCustomPrice(rate)} Tokens Per BNB - (1B)</span> </p>
                {/* <p>🎯🔐 Whitelisted: <span className='!text-accent'> {data.whitelisted ? 'Yes' : 'No'}</span></p> */}
                <p>💰 Total Raised: <span className='!text-accent'> {formatCustomPrice(raisedBnb)} BNB</span> </p>
                <p>📈 Total Sold: <span className='!text-accent'> {formatCustomPrice(totalSolde)} $WPAY</span> </p>
                <p>📦 Tokens Remaining:<span className='!text-accent'> {formatCustomPrice(Number(formatEther(data.tokensRemaining.toString())))} $WPAY</span> </p>
                <p>🎁 Total Unclaimed Tokens: <span className='!text-accent'> {formatCustomPrice(unclaimedTokens)} $WPAY</span></p>
                <p>⏱️ Vesting Started: <span className='!text-accent'> {data.vestingStarted ? 'Yes' : 'No'}</span></p>

                <div className=" rounded-lg flex justify-between items-center">
                    <a className=" break-all !text-neutral hover:!text-accent" href={`https://bscscan.com/token/${addresses.token}`} target='_blank' >📜 Token Address : {addresses.token}</a>
                    <button onClick={() => copyToClipboard(addresses.token)} className="cursor-pointer hover:scale-110 hover:!text-green-500">
                        <IoMdCopy className="text-lg" />
                    </button>
                </div>
                <div className=" rounded-lg flex justify-between items-center">
                    <a className=" break-all !text-neutral hover:!text-accent" href='https://bscscan.com/tx/0xbdf23e608901bdbc2bae9c197fe59573c973a65e135857a93752dad2f9b183d9' target='_blank' >🔐 Ownership Renounced : 0xbdf23e608901bdbc2bae9c197fe59573c973a65e135857a93752dad2f9b183d9</a>
                    <button onClick={() => copyToClipboard('0xbdf23e608901bdbc2bae9c197fe59573c973a65e135857a93752dad2f9b183d9')} className="cursor-pointer hover:scale-110 hover:!text-green-500">
                        <IoMdCopy className="text-lg" />
                    </button>
                </div>

            </div>
        </div>
    );
}



function ConnectWallet() {
    const { open, close } = useAppKit();
    const { address, isConnected, chain } = useAccount();

    const AppKitAccount = useAppKitAccount();

    const { switchChain } = useSwitchChain();

    useEffect(() => {
        if (isConnected && chain?.id !== chainId) {
            switchChain({ chainId: chainId }); // BSC Testnet
        }

    }, [isConnected, chain, address]);

    return (
        <>
            {
                isConnected && chain && address || AppKitAccount?.address ?
                    <appkit-button size='md' />
                    :
                    <ButtonPrimary
                        onClick={() => open({
                            view: 'Connect',
                            namespace: 'eip155',

                        })}
                    >
                        connect
                    </ButtonPrimary>
            }
        </>
    )


}