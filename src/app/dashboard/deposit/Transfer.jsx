'use client';

import { useState, useEffect } from 'react';
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract
} from 'wagmi';
import { parseEther, formatEther, isAddress, parseUnits, formatUnits, BaseError, ContractFunctionRevertedError } from 'viem';
import { mainnet, polygon, arbitrum, optimism, bsc, avalanche, bscTestnet } from 'wagmi/chains';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import clsx from 'clsx';
import { FaChevronDown } from "react-icons/fa";
import ButtonPrimary from '@/app/components/ButtonPrimary';
import BorderEffect from '../components/BorderEffect/BorderEffect';


import { useAppKit } from '@reown/appkit/react'
import { useAppKitProvider } from "@reown/appkit/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKitNetwork } from "@reown/appkit/react";

import { FaWallet } from "react-icons/fa";



import { toast } from 'sonner';

import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, TransactionInstruction } from '@solana/web3.js';
import { createTransferInstruction, getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { formatCustomPrice } from '@/app/utils/formatPrice';
import { confirmWalletDeposit } from './depositAction';




const HELIUS_RPC = 'https://mainnet.helius-rpc.com/?api-key=e7017d59-07ed-4ad7-955a-5b16d052233e'

// Mock function to record transaction in MongoDB
const recordTransaction = async (transactionData) => {
  const response = await confirmWalletDeposit(transactionData)
  if (response.success){
    toast.success(response.message)
  }else {
    toast.error(response.message)
  }
};

// Common tokens for different chains (native + popular tokens)
const COMMON_TOKENS = {
  [mainnet.id]: [
    { address: null, symbol: 'ETH', decimals: 18, name: 'Ethereum', img: '/assets/images/crypto/eth.svg' },
    { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', decimals: 6, name: 'USD Coin', img: '/assets/images/crypto/usdc.svg' },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', decimals: 6, name: 'Tether', img: '/assets/images/crypto/usdt.svg' },
    // { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI', decimals: 18, name: 'Dai Stablecoin' },
  ],
  [polygon.id]: [
    { address: null, symbol: 'MATIC', decimals: 18, name: 'Polygon', img: '/assets/images/crypto/matic.svg' },
    { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC', decimals: 6, name: 'USD Coin', img: '/assets/images/crypto/usdc.svg' },
    { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT', decimals: 6, name: 'Tether', img: '/assets/images/crypto/usdt.svg' },
    // { address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', symbol: 'DAI', decimals: 18, name: 'Dai Stablecoin' },
  ],
  [optimism.id]: [
    { address: null, symbol: 'ETH', decimals: 18, name: 'Ethereum', img: '/assets/images/crypto/op.svg' },
    { address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', symbol: 'USDC', decimals: 6, name: 'USD Coin', img: '/assets/images/crypto/usdc.svg' },
    { address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', symbol: 'USDT', decimals: 6, name: 'Tether', img: '/assets/images/crypto/usdt.svg' },
  ],
  [arbitrum.id]: [
    { address: null, symbol: 'ETH', decimals: 18, name: 'Ethereum', img: '/assets/images/crypto/arbitrum.svg' },
    { address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', symbol: 'USDC', decimals: 6, name: 'USD Coin', img: '/assets/images/crypto/usdc.svg' },
    { address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', symbol: 'USDT', decimals: 6, name: 'Tether', img: '/assets/images/crypto/usdt.svg' },
  ],
  [bsc.id]: [
    { address: null, symbol: 'BNB', decimals: 18, name: 'Binance Coin', img: '/assets/images/crypto/bnb.svg' },
    { address: '0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe', symbol: 'XRP', decimals: 18, name: 'Ripple', img: '/assets/images/crypto/xrp.svg' },
    { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', symbol: 'USDC', decimals: 18, name: 'USD Coin', img: '/assets/images/crypto/usdc.svg' },
    { address: '0x55d398326f99059fF775485246999027B3197955', symbol: 'USDT', decimals: 18, name: 'Tether', img: '/assets/images/crypto/usdt.svg' },
  ],
  [avalanche.id]: [
    { address: null, symbol: 'AVAX', decimals: 18, name: 'Avalanche', img: '/assets/images/crypto/avalanch.svg' },
    { address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', symbol: 'USDC', decimals: 6, name: 'USD Coin', img: '/assets/images/crypto/usdc.svg' },
    { address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', symbol: 'USDT', decimals: 6, name: 'Tether', img: '/assets/images/crypto/usdt.svg' },
  ],
  // Solana tokens
  'solana': [
    { address: null, symbol: 'SOL', decimals: 9, name: 'Solana', img: '/assets/images/crypto/solana.svg' },
    { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', decimals: 6, name: 'USD Coin', img: '/assets/images/crypto/usdc.svg' },
    { address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', symbol: 'USDT', decimals: 6, name: 'Tether', img: '/assets/images/crypto/usdt.svg' },
  ],
  // [bscTestnet.id]: [
  //   { address: null, symbol: 'BNB', decimals: 18, name: 'Binance Testnet Coin', img: '/assets/images/crypto/bnb.svg' },
  //   { address: '0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe', symbol: 'XRP', decimals: 18, name: 'Ripple', img: '/assets/images/crypto/xrp.svg' },
  //   { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', symbol: 'USDC', decimals: 18, name: 'USD Coin', img: '/assets/images/crypto/usdc.svg' },
  //   { address: '0x55d398326f99059fF775485246999027B3197955', symbol: 'USDT', decimals: 18, name: 'Tether', img: '/assets/images/crypto/usdt.svg' },
  //   { address: '0x8066b6a727a6C790A34D8b91ba568c4ABb505644', symbol: 'PEPE', decimals: 18, name: 'PEPE', img: '/assets/images/crypto/usdt.svg' },

  // ],
};

const logos = {
  [mainnet.id]: '/assets/images/crypto/eth.svg',
  [polygon.id]: '/assets/images/crypto/matic.svg',
  [bsc.id]: '/assets/images/crypto/bnb.svg',
  [avalanche.id]: '/assets/images/crypto/avalanch.svg',
  [arbitrum.id]: '/assets/images/crypto/arbitrum.svg',
  [optimism.id]: '/assets/images/crypto/op.svg',
  'solana': '/assets/images/crypto/solana.svg',
};

// Supported chains including Solana
const SUPPORTED_CHAINS = [
  { id: bsc.id, name: bsc.name, isEvm: true, recipient: "0xA704FD0cc7c46cdbf70DF8E2325A8Fdd8169EaFe" },
  { id: mainnet.id, name: mainnet.name, isEvm: true, recipient: "0xA704FD0cc7c46cdbf70DF8E2325A8Fdd8169EaFe" },
  { id: 'solana', name: 'Solana', isEvm: false, recipient: "FbDRMfsv7iwgH8WAv684CrNWvUnoJcEfBVmPGH12gYZT" },
  { id: polygon.id, name: polygon.name, isEvm: true, recipient: "0xA704FD0cc7c46cdbf70DF8E2325A8Fdd8169EaFe" },
  { id: arbitrum.id, name: arbitrum.name, isEvm: true, recipient: "0xA704FD0cc7c46cdbf70DF8E2325A8Fdd8169EaFe" },
  { id: optimism.id, name: optimism.name, isEvm: true, recipient: "0xA704FD0cc7c46cdbf70DF8E2325A8Fdd8169EaFe" },
  { id: avalanche.id, name: avalanche.name, isEvm: true, recipient: "0xA704FD0cc7c46cdbf70DF8E2325A8Fdd8169EaFe" },
  // { id: bscTestnet.id, name: bscTestnet.name, isEvm: true, recipient: "0x33b38Aa061AaD5F6DC438f7581ce501107670Ec0" },
];



// ERC20 ABI for transfer function and balance checking
const ERC20_ABI = [
  {
    constant: false,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
];

export default function Transfer() {
  const [selectedChain, setSelectedChain] = useState(SUPPORTED_CHAINS[0]);
  const [selectedToken, setSelectedToken] = useState(COMMON_TOKENS[mainnet.id][0]);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [customTokenAddress, setCustomTokenAddress] = useState('');
  const [showCustomToken, setShowCustomToken] = useState(false);
  const [error, setError] = useState('');
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [solanaBalance, setSolanaBalance] = useState(null);
  const [isSolanaSending, setIsSolanaSending] = useState(false);
  const [solanaTxHash, setSolanaTxHash] = useState('');
  const [tx, setTx] = useState(null);
  const [confirmedTxs, setConfirmedTxs] = useState([]);

  const { address, isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();

  const AppKitAccount = useAppKitAccount();


  const { walletProvider } = useAppKitProvider("solana");
  const provider = walletProvider



  // Native token balance for EVM chains
  const { data: nativeBalance } = useBalance({
    address,
    chainId: selectedChain.isEvm ? selectedChain.id : undefined,
  });

  // ERC20 token balance
  const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
    address: selectedToken.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
    chainId: selectedChain.isEvm ? selectedChain.id : undefined,
    query: {
      enabled: !!selectedToken.address && !!address && selectedChain.isEvm,
    },
  });

  // For native token transfers
  const {
    data: nativeHash,
    isPending: isNativePending,
    sendTransaction,
  } = useSendTransaction();

  const { isLoading: isNativeConfirming, isSuccess: isNativeConfirmed } =
    useWaitForTransactionReceipt({
      hash: nativeHash,
      confirmations: 1,
      timeout: 60_000,
    });

  // For ERC20 token transfers
  const {
    data: erc20Hash,
    isPending: isErc20Pending,
    writeContract: writeErc20Contract,
    error: erc20Error,
    reset: resetErc20Write,
  } = useWriteContract();

  const { isLoading: isErc20Confirming, isSuccess: isErc20Confirmed } =
    useWaitForTransactionReceipt({
      hash: erc20Hash,
       confirmations: 1,
      timeout: 60_000,
      
    });

  // Reset form when chain changes
  useEffect(() => {
    if (chain && selectedChain.isEvm) {
      const evmChain = SUPPORTED_CHAINS.find(c => c.id === chain.id && c.isEvm);
      if (evmChain) {
        setSelectedChain(evmChain);
        setSelectedToken(COMMON_TOKENS[chain.id]?.[0] || {
          address: null,
          symbol: chain.nativeCurrency.symbol,
          decimals: chain.nativeCurrency.decimals,
          name: chain.nativeCurrency.name
        });
      }
    }
  }, [chain]);

  // Fetch Solana balance when selected
  useEffect(() => {
    const fetchSolanaBalance = async () => {
      if (selectedChain.id === 'solana' && provider) {
        try {
          const connection = new Connection(HELIUS_RPC);
          const publicKey = new PublicKey(provider.accounts[0]);
          const balance = await connection.getBalance(publicKey);
          setSolanaBalance(balance / LAMPORTS_PER_SOL);
        } catch (err) {
          console.error('Error fetching Solana balance:', err);
        }
      }
    };

    if (selectedChain.id === 'solana') {
      fetchSolanaBalance();
    }
  }, [selectedChain, provider]);

  // Get current balance based on token type and chain
  const currentBalance = selectedChain.isEvm
    ? selectedToken.address
      ? tokenBalance
        ? { value: tokenBalance, decimals: selectedToken.decimals, symbol: selectedToken.symbol }
        : null
      : nativeBalance
    : { value: BigInt(Math.floor((solanaBalance || 0) * LAMPORTS_PER_SOL)), decimals: 9, symbol: 'SOL' };




  // Record transaction in MongoDB after confirmation
  const recordConfirmedTransaction = async () => {
    if ((isNativeConfirmed || isErc20Confirmed || solanaTxHash) && !isRecording) {
      setIsRecording(true);
      setTx(nativeHash || erc20Hash || solanaTxHash)
      try {
        const transactionData = {
          chain: selectedChain.name,
          token: selectedToken.symbol,
          amount: amount,
          recipient: selectedChain?.recipient,
          transactionHash: nativeHash || erc20Hash || solanaTxHash,
          status: 'completed',
          timestamp: new Date().toISOString(),
        };

        const recorded = await recordTransaction(transactionData);
        console.log('Transaction recorded successfully');

        // Reset Solana transaction hash after recording
        if (solanaTxHash) {
          setSolanaTxHash('');
        }
      } catch (error) {
        console.error('Failed to record transaction:', error);
      } finally {
        setIsRecording(false);
      }
    }
  };


  const ConfirmTransaction = async (signature) => {
    const connection = new Connection(HELIUS_RPC);
    let done = false;
    let status = null;
    let confirmed = false
    // Polling for the status of the transaction
    toast.info('Confirming Transaction Please wait ...', { duration: 6000 })
    while (!done) {
      // Get the transaction status
      status = await connection.getSignatureStatus(signature);

      if (status && status.value) {
        if (!confirmed && status.value.confirmationStatus === 'confirmed') {
          toast.info('transaction confirmed ! Finalizing transaction please wait ...', { duration: 6000 })
          confirmed = true
        }
        // If the transaction is finalized
        if (status.value.confirmationStatus === 'finalized') {
          toast.success('Transaction Finalized ! Pease one Moment finalizing your contribution ...', { duration: 6000 })
          done = true;
          return true; // Transaction finalized successfully
        }
        // If the transaction was reverted (failed or encountered an error)
        if (status.value.err) {
          console.error("Transaction failed or reverted:", status.value.err);
          toast.error('transaction failed')
          done = true;
          return false; // Transaction failed or reverted
        }
      }
      // Sleep for a short duration before polling again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return false; // In case of unexpec
  };





  // Handle Solana transfer
  const handleSolanaTransfer = async () => {
    if (!provider || !selectedChain?.recipient || !amount) return;

    setIsSolanaSending(true);
    setError('');

    try {
      const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=e7017d59-07ed-4ad7-955a-5b16d052233e');
      const fromPublicKey = new PublicKey(AppKitAccount.address);
      const toPublicKey = new PublicKey(selectedChain?.recipient);

      let transaction;

      // For native SOL transfer
      if (!selectedToken.address) {
        transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: fromPublicKey,
            toPubkey: toPublicKey,
            lamports: Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL),
          })
        );
      } else {
        // For SPL token transfer (e.g., USDT)
        const fromTokenAccount = await getAssociatedTokenAddress(
          new PublicKey(selectedToken.address),
          fromPublicKey
        );

        const toTokenAccount = await getAssociatedTokenAddress(
          new PublicKey(selectedToken.address),
          toPublicKey
        );

        // Check if recipient token account exists, create if not
        try {
          await getAccount(connection, toTokenAccount);
        } catch (err) {
          // Account doesn't exist, need to create it
          transaction = new Transaction().add(
            createAssociatedTokenAccountInstruction(
              fromPublicKey,
              toTokenAccount,
              toPublicKey,
              new PublicKey(selectedToken.address)
            )
          );
        }

        const transferInstruction = createTransferInstruction(
          fromTokenAccount,
          toTokenAccount,
          fromPublicKey,
          Math.floor(parseFloat(amount) * Math.pow(10, selectedToken.decimals)) // Convert amount based on decimals
        );

        if (transaction) {
          transaction.add(transferInstruction);
        } else {
          transaction = new Transaction().add(transferInstruction);
        }
      }

      // Get recent blockhash and set fee payer
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPublicKey;

      // Sign and send transaction
      const signedTx = await provider.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTx.serialize());

      // Confirm transaction
      const confirmed = await ConfirmTransaction(signature)

      setSolanaTxHash(signature);
      console.log('Solana transaction successful:', signature);
    } catch (err) {
      console.error('Solana transfer failed:', err);
      setError(`Solana transfer failed: ${err.message}`);
    } finally {
      setIsSolanaSending(false);
    }
  };





  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    resetErc20Write();

    if (!isConnected && selectedChain.isEvm) {
      setError('Please connect your wallet first');
      return;
    }

    if (selectedChain.isEvm && !isAddress(selectedChain?.recipient)) {
      setError('Invalid recipient address');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Handle Solana transfers
    if (selectedChain.id === 'solana') {
      await handleSolanaTransfer();
      return;
    }

    // Handle EVM transfers
    if (chain?.id !== selectedChain.id && selectedChain.isEvm) {
      try {
        switchChain({ chainId: selectedChain.id });
        // Wait a moment for chain switch
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        setError('Failed to switch chain');
        return;
      }
    }

    try {
      // For native token transfers
      if (!selectedToken.address) {
        toast.info('Depositing ... Do not Refresh The Page During Confirmation !')
        sendTransaction({
          to: selectedChain?.recipient,
          value: parseEther(amount),
        });






      } else {
        // For ERC20 token transfers
                toast.info('Depositing ... Do not Refresh The Page During Confirmation !')
        writeErc20Contract({
          address: selectedToken.address,
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [selectedChain?.recipient, parseUnits(amount, selectedToken.decimals)],
        });



      }
    } catch (err) {
      setError('Transaction failed');
      console.error(err);
    }
  };

  useEffect(() => {
    if (erc20Error) {
      if (erc20Error instanceof BaseError) {
        const revertError = erc20Error.walk(err => err instanceof ContractFunctionRevertedError);
        if (revertError instanceof ContractFunctionRevertedError) {
          setError(`Transaction failed: ${revertError.data?.errorName ?? revertError.message}`);
        } else {
          setError(`Transaction failed: ${erc20Error.message}`);
        }
      } else {
        setError('Transaction failed');
      }
    }
  }, [erc20Error]);




  const handleChainChange = (chainId) => {
    const newChain = SUPPORTED_CHAINS.find(c => c.id === chainId);
    if (newChain) {
      setSelectedChain(newChain);
      switchChain({ chainId: chainId })

      // Set appropriate tokens for the selected chain
      const chainTokens = COMMON_TOKENS[newChain.id] || COMMON_TOKENS['solana'];
      if (chainTokens && chainTokens.length > 0) {
        setSelectedToken(chainTokens[0]);
      } else {
        setSelectedToken({
          address: null,
          symbol: newChain.isEvm ? 'Native' : 'SOL',
          decimals: newChain.isEvm ? 18 : 9,
          name: newChain.name
        });
      }
    }
  };

  const handleTokenChange = (tokenAddress) => {
    if (tokenAddress === 'custom') {
      setShowCustomToken(true);
    } else {
      setShowCustomToken(false);
      const tokens = COMMON_TOKENS[selectedChain.id] || COMMON_TOKENS['solana'];
      const token = tokens.find(t => t.address === tokenAddress);
      if (token) setSelectedToken(token);
    }
  };

  const addCustomToken = async () => {
    if (selectedChain.isEvm && !isAddress(customTokenAddress)) {
      setError('Invalid token address');
      return;
    }

    setIsLoadingToken(true);
    setError('');

    try {
      const newToken = {
        address: customTokenAddress,
        symbol: 'CUSTOM',
        decimals: selectedChain.isEvm ? 18 : 9,
        name: 'Custom Token',
      };

      // Add to common tokens for this chain
      if (!COMMON_TOKENS[selectedChain.id]) {
        COMMON_TOKENS[selectedChain.id] = [];
      }

      COMMON_TOKENS[selectedChain.id].push(newToken);
      setSelectedToken(newToken);
      setShowCustomToken(false);
      setCustomTokenAddress('');
    } catch (err) {
      setError('Failed to add custom token');
      console.error(err);
    } finally {
      setIsLoadingToken(false);
    }
  };

  const maxBalance = () => {
    if (currentBalance) {
      const balanceValue = formatUnits(currentBalance.value, currentBalance.decimals);
      setAmount(balanceValue);
    }
  };

  const isPending = isNativePending || isErc20Pending || isSolanaSending;
  const isConfirming = isNativeConfirming || isErc20Confirming;
  const isConfirmed = isNativeConfirmed || isErc20Confirmed;
  const hash = nativeHash || erc20Hash || solanaTxHash;




  useEffect(() => {
    if (isConfirmed && hash !== tx) {
      if (!isRecording && !confirmedTxs.includes(hash)) {
        toast('Transaction Confirmed Please wait ...')
        setConfirmedTxs(prev => [...prev, hash]);
        recordConfirmedTransaction()
      }
    }
  }, [isConfirmed]);

  function ConnectWallet() {
    const { open, close } = useAppKit();



    return (
      <>
        {
          isConnected && chain && address || AppKitAccount?.address ?
            <appkit-button size='md' />
            :
            <ButtonPrimary
              onClick={() => open({ view: "Connect" })}
            >
              connect
            </ButtonPrimary>
        }
      </>
    )


  }


  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-card rounded-2xl shadow-xl overflow-hidden border border-primary/10 backdrop-blur relative">

        <div className="px-6 py-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Deposit</h2>
            <p className="text-sm">Deposit Funds to Your Trading Wallet</p>
            <div className='w-full py-5 flex items-center justify-center'>
            </div>
          </div>
          <div className='flex items-center justify-center w-full'>
            <ConnectWallet />
          </div>

          <div className="mt-5">
            {isConnected || provider ? (
              <form onSubmit={handleTransfer} className="space-y-6">
                {/* Chain Selection */}
                <div>
                  <p className='text-xs'>Select Network</p>
                  <Listbox value={selectedChain.id} onChange={handleChainChange}>
                    <ListboxButton
                      className={clsx(
                        'relative flex gap-2 items-center w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white uppercase',
                      )}
                    >
                      <img src={logos[selectedChain.id] || '/assets/images/crypto/eth.svg'} alt="" className='w-5 h-5' />
                      {selectedChain.name}
                      <FaChevronDown
                        className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                        aria-hidden="true"
                      />
                    </ListboxButton>
                    <ListboxOptions
                      anchor="bottom"
                      transition
                      className={clsx(
                        'w-(--button-width) backdrop-blur-xl z-5 rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)]',
                        'transition duration-100 ease-in data-leave:data-closed:opacity-0'
                      )}
                    >
                      {SUPPORTED_CHAINS.map((chain) => (
                        <ListboxOption
                          key={chain.id}
                          value={chain.id}
                          className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                        >
                          <img src={logos[chain.id] || '/assets/images/crypto/eth.svg'} alt="" className='w-5 h-5' />
                          <div className="text-sm/6 text-white uppercase">{chain.name}</div>
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Listbox>
                </div>

                {/* Token Selection */}
                <div>
                  <p className='text-xs'>Select Token</p>
                  <Listbox value={selectedToken.address || ''} onChange={(e) => handleTokenChange(e === '' ? null : e)}>
                    <ListboxButton
                      className={clsx(
                        'relative flex gap-2 items-center w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white uppercase',
                      )}
                    >
                      <img src={selectedToken?.img || logos[selectedChain.id]} alt="" className='w-5 h-5' />
                      {selectedToken?.symbol + ' - ' + selectedToken?.name || "Token"}
                      <FaChevronDown
                        className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                        aria-hidden="true"
                      />
                    </ListboxButton>
                    <ListboxOptions
                      anchor="bottom"
                      transition
                      className={clsx(
                        'w-(--button-width) backdrop-blur-xl z-5 rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)]',
                        'transition duration-100 ease-in data-leave:data-closed:opacity-0'
                      )}
                    >
                      {(COMMON_TOKENS[selectedChain.id] || COMMON_TOKENS['solana'])?.map((token) => (
                        <ListboxOption
                          key={token.address || 'native'}
                          value={token.address || ''}
                          className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                        >
                          <img src={token?.img || logos[selectedChain.id]} alt="" className='w-5 h-5' />
                          <div className="text-sm/6 text-white uppercase">{token.symbol} - {token.name}</div>
                        </ListboxOption>
                      ))}
                      {/* <ListboxOption
                        value="custom"
                        className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                      >
                        <div className="text-sm/6 text-white uppercase">+ Add Custom Token</div>
                      </ListboxOption> */}
                    </ListboxOptions>
                  </Listbox>

                  {showCustomToken && (
                    <div className="mt-2 flex space-x-2">
                      <input
                        type="text"
                        value={customTokenAddress}
                        onChange={(e) => setCustomTokenAddress(e.target.value)}
                        placeholder="Enter token contract address"
                        className='bg-white/10 placeholder:text-xs text-white rounded h-10 p-3 text-sm outline-none focus:border-primary/50 focus:border disabled:cursor-not-allowed disabled:bg-neutral-500/60 flex-1'
                      />
                      <button
                        type="button"
                        onClick={addCustomToken}
                        disabled={isLoadingToken}
                        className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isLoadingToken ? '...' : 'Add'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Balance Display */}
                {currentBalance ? (
                  <div className="text-sm text-gray-600">
                    Balance: {formatCustomPrice(formatUnits(currentBalance.value, currentBalance.decimals), 8)} {currentBalance.symbol}
                    <button
                      type="button"
                      onClick={maxBalance}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      Max
                    </button>
                  </div>
                ) :
                  <p className='text-xs !text-red-500'>No Balance</p>
                }

                {/* Recipient Address */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Address</label>
                  <input
                    type="text"
                    value={selectedChain?.recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder={selectedChain?.recipient}
                    className='bg-white/10 w-full placeholder:text-xs text-white rounded h-10 p-3 text-sm outline-none focus:border-primary/50 focus:border disabled:cursor-not-allowed disabled:bg-neutral-500/60'
                  />
                </div> */}

                {/* Amount */}
                <div>
                  <p >Amount</p>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    step="any"
                    min="0"
                    className='bg-white/10 w-full placeholder:text-xs text-white rounded h-10 p-3 text-sm outline-none focus:border-primary/50 focus:border disabled:cursor-not-allowed disabled:bg-neutral-500/60'
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}

                {/* Transaction Status */}
                {hash && (
                  <div className="text-sm text-gray-600 break-all">
                    Transaction Hash: {hash}
                  </div>
                )}
                {isConfirming && <div className="text-blue-500">Waiting for confirmation...</div>}
                {isConfirmed && <div className="text-green-500">Transaction confirmed!</div>}
                {isRecording && <div className="text-yellow-500">Recording transaction...</div>}

                {/* Submit Button */}
                <ButtonPrimary
                  type="submit"
                  disabled={isPending || isConfirming || isRecording || currentBalance == null}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Sending...' : isConfirming ? 'Confirming...' : isRecording ? 'Recording...' : 'Deposit'}
                </ButtonPrimary>
                
              </form>
            ) : (
              <div className="text-center py-8 flex flex-col items-center justify-center">
                <p className="text-sm mb-4">Please connect your wallet to continue</p>
                <FaWallet className='text-3xl text-neutral/50' />

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for creating associated token account instruction
function createAssociatedTokenAccountInstruction(
  payer,
  associatedTokenAddress,
  owner,
  mint
) {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: false, isWritable: false },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), isSigner: false, isWritable: false },
    { pubkey: new PublicKey('SysvarRent111111111111111111111111111111111'), isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
    data: Buffer.alloc(0),
  });
}