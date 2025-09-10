import { createWalletClient, createPublicClient, http, parseAbi, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import abi from './abi'

export async function sendErc20Transfer({key , amount , reciepient , tokenAddress}) {
  const privateKey = key
  const account = privateKeyToAccount(privateKey)

  const walletClient = createWalletClient({
    account,
    chain: mainnet,
    transport: http(),
  })

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  })


  const erc20Abi = parseAbi([
abi  ])

  const recipientAddress = reciepient
  const amount = parseEther(amount) // 10 tokens (adjust decimals if needed)

  // Estimate gas limit for transfer
  const gasLimit = await publicClient.estimateGas({
    account: account.address,
    to: tokenAddress,
    data: walletClient.encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [recipientAddress, amount],
    }),
  })

  // Estimate fees
  const { maxFeePerGas, maxPriorityFeePerGas } = await publicClient.estimateFeesPerGas()

  // Send transaction
  const txHash = await walletClient.writeContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'transfer',
    args: [recipientAddress, amount],
    gas: gasLimit * 11n / 10n, // add 10% buffer
    maxFeePerGas,
    maxPriorityFeePerGas,
  })

  console.log('Transaction sent:', txHash)

  // Wait for confirmation
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })

  if (receipt.status === 'success' || receipt.status === 1) {
    console.log('Transaction confirmed in block', receipt.blockNumber)
  } else {
    console.error('Transaction failed')
  }
}

// sendErc20Transfer().catch(console.error)
