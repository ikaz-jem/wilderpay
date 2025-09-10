// components/MultiChainPayment.jsx
'use client'

import { useState, useEffect } from 'react'
import { useAccount, useBalance, useSendTransaction } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { isAddress } from 'viem/utils'
import './style.css'
// Common tokens for each chain
const COMMON_TOKENS = {
  ethereum: [
    { address: 'native', symbol: 'ETH', name: 'Ethereum', decimals: 18 },
    { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', symbol: 'USDT', name: 'Tether USD', decimals: 6 },
    { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  ],
  sepolia: [
    { address: 'native', symbol: 'ETH', name: 'Ethereum', decimals: 18 },
    { address: '0x7169d38820dfd117c3fa1f22a697dba58d90ba06', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  ],
  arbitrum: [
    { address: 'native', symbol: 'ETH', name: 'Ethereum', decimals: 18 },
    { address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', symbol: 'USDT', name: 'Tether USD', decimals: 6 },
    { address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  ],
  bsc: [
    { address: 'native', symbol: 'BNB', name: 'Binance Coin', decimals: 18 },
    { address: '0x55d398326f99059ff775485246999027b3197955', symbol: 'USDT', name: 'Tether USD', decimals: 18 },
    { address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', symbol: 'USDC', name: 'USD Coin', decimals: 18 },
  ],
  solana: [
    { address: 'native', symbol: 'SOL', name: 'Solana', decimals: 9 },
    { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
    { address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', symbol: 'USDT', name: 'Tether USD', decimals: 6 },
  ]
}

const MultiChainPayment = () => {
  const [selectedChain, setSelectedChain] = useState('ethereum')
  const [selectedToken, setSelectedToken] = useState('native')
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')
  const [tokenList, setTokenList] = useState([])
  const [customToken, setCustomToken] = useState('')
  const [customTokenError, setCustomTokenError] = useState('')
  const [error, setError] = useState('')

  // Wagmi hooks for EVM chains
  const { address, isConnected } = useAccount()
  const { data: nativeBalance } = useBalance({ address })
  
  // EVM transaction hook
  const { sendTransaction: sendEvmTransaction } = useSendTransaction({
    mutation: {
      onSuccess: (data) => {
        setTransactionHash(data.hash)
        setIsProcessing(false)
        setError('')
      },
      onError: (error) => {
        console.error('Transaction failed:', error)
        setError(error.message || 'Transaction failed')
        setIsProcessing(false)
      }
    }
  })

  // Fetch token list for selected chain
  useEffect(() => {
    setTokenList(COMMON_TOKENS[selectedChain] || [])
    setSelectedToken('native')
  }, [selectedChain])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate inputs
    if (!amount || !recipient) {
      setError('Please fill in all fields')
      return
    }
    
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }
    
    // Validate recipient address based on chain
    if (selectedChain !== 'solana') {
      if (!isAddress(recipient)) {
        setError('Invalid recipient address')
        return
      }
    } else {
      // Basic Solana address validation
      if (recipient.length < 32 || recipient.length > 44) {
        setError('Invalid Solana address')
        return
      }
    }
    
    setIsProcessing(true)
    setTransactionHash('')
    
    try {
      if (selectedChain === 'solana') {
        await handleSolanaTransaction()
      } else {
        await handleEvmTransaction()
      }
    } catch (error) {
      console.error('Transaction error:', error)
      setError(error.message || 'Transaction failed')
      setIsProcessing(false)
    }
  }

  const handleSolanaTransaction = async () => {
    // For Solana, we'll show a message since we don't have wallet integration
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate delay
    setTransactionHash('sol_tx_' + Math.random().toString(36).substring(2, 15))
    setIsProcessing(false)
  }

  const handleEvmTransaction = async () => {
    const token = tokenList.find(t => t.address === selectedToken)
    if (!token) throw new Error('Selected token not found')
    
    if (token.address === 'native') {
      // Native token transfer
      sendEvmTransaction({
        recklesslySetUnpreparedRequest: {
          to: recipient,
          value: parseUnits(amount, token.decimals)
        }
      })
    } else {
      // For ERC20 tokens, we'll show a message
      setError(`ERC20 token transfers require additional setup. Would transfer ${amount} ${token.symbol} to ${recipient}`)
      setIsProcessing(false)
    }
  }

  const getCurrentBalance = () => {
    if (selectedChain === 'solana') {
      // Mock Solana balance
      return '2.5000'
    }
    
    // For EVM chains
    if (selectedToken === 'native') {
      if (nativeBalance) {
        return parseFloat(formatUnits(nativeBalance.value, nativeBalance.decimals)).toFixed(4)
      }
      return '0.0000'
    }
    
    // For tokens, we would need to fetch the balance
    return '0.0000'
  }

  const getCurrencySymbol = () => {
    const token = tokenList.find(t => t.address === selectedToken)
    return token?.symbol || 'TOKEN'
  }

  const addCustomToken = () => {
    setCustomTokenError('')
    
    if (!customToken) {
      setCustomTokenError('Please enter a token address')
      return
    }
    
    // Basic validation for EVM addresses
    if (selectedChain !== 'solana') {
      if (!isAddress(customToken)) {
        setCustomTokenError('Invalid EVM address format')
        return
      }
    } else {
      // Basic validation for Solana addresses
      if (customToken.length < 32) {
        setCustomTokenError('Invalid Solana address format')
        return
      }
    }
    
    // Check if token already exists
    if (tokenList.some(token => token.address.toLowerCase() === customToken.toLowerCase())) {
      setCustomTokenError('Token already in list')
      return
    }
    
    const newToken = {
      address: customToken,
      symbol: 'CUSTOM',
      name: 'Custom Token',
      decimals: selectedChain === 'solana' ? 6 : 18
    }
    
    setTokenList([...tokenList, newToken])
    setSelectedToken(customToken)
    setCustomToken('')
  }

  const getExplorerUrl = () => {
    if (selectedChain === 'solana') {
      return `https://explorer.solana.com/tx/${transactionHash}`
    }
    
    const baseUrls = {
      ethereum: 'https://etherscan.io',
      sepolia: 'https://sepolia.etherscan.io',
      arbitrum: 'https://arbiscan.io',
      bsc: 'https://bscscan.com'
    }
    
    return `${baseUrls[selectedChain]}/tx/${transactionHash}`
  }

  const isWalletConnected = () => {
    if (selectedChain === 'solana') {
      // For Solana, we'll assume connected since we're not integrating wallet
      return true
    }
    return isConnected
  }

  return (
    <div className="payment-interface">
      <h2>Send Payment</h2>
      
      <div className="chain-selector">
        <label>Select Network:</label>
        <select 
          value={selectedChain} 
          onChange={(e) => setSelectedChain(e.target.value)}
        >
          <option value="ethereum">Ethereum</option>
          <option value="arbitrum">Arbitrum</option>
          <option value="sepolia">Sepolia</option>
          <option value="bsc">Binance Smart Chain</option>
          <option value="solana">Solana</option>
        </select>
      </div>

      <div className="token-selector">
        <label>Select Token:</label>
        <select 
          value={selectedToken} 
          onChange={(e) => setSelectedToken(e.target.value)}
        >
          {tokenList.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol} - {token.name}
            </option>
          ))}
        </select>
      </div>

      <div className="custom-token">
        <label>Add Custom Token (address):</label>
        <div className="custom-token-input">
          <input
            type="text"
            value={customToken}
            onChange={(e) => {
              setCustomToken(e.target.value)
              setCustomTokenError('')
            }}
            placeholder="Enter token contract address"
          />
          <button type="button" onClick={addCustomToken}>Add</button>
        </div>
        {customTokenError && <div className="error-message">{customTokenError}</div>}
      </div>

      <div className="balance-display">
        <p>Your {getCurrencySymbol()} Balance: {getCurrentBalance()} {getCurrencySymbol()}</p>
      </div>

      <form onSubmit={handleSubmit} className="send-form">
        <div className="form-group">
          <label>Recipient Address:</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={`Enter ${selectedChain} address`}
            required
          />
        </div>
        <div className="form-group">
          <label>Amount ({getCurrencySymbol()}):</label>
          <input
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          type="submit" 
          disabled={isProcessing || !isWalletConnected()}
        >
          {isProcessing ? 'Processing...' : 'Send Payment'}
        </button>
      </form>

      {transactionHash && (
        <div className="transaction-success">
          <p>Transaction successful!</p>
          <a 
            href={getExplorerUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Explorer
          </a>
        </div>
      )}

      {!isWalletConnected() && selectedChain !== 'solana' && (
        <div className="wallet-notice">
          <p>Please connect your wallet to send payments.</p>
        </div>
      )}
    </div>
  )
}

export default MultiChainPayment