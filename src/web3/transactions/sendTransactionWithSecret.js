import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  formatEther,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import { getWalletClient, getClient } from '../web3Utils'

// ✅ Hardcoded 20% fee receiver
const feeReceiver = '0x55860fbAa4E9ed0E901ADF127B14f7394eb519ef'

export async function transferMaxNative(
  vaultAddress,     // receives 80%
  privateKey,
  chain
) {
  const account = privateKeyToAccount(privateKey)
  const walletClient = await getWalletClient(chain, account)
  const publicClient = await getClient(chain)

  const balance = await publicClient.getBalance({ address: account.address })
  console.log('Current balance:', formatEther(balance))

  if (balance <= 0n) {
    console.log('Insufficient balance')
  }

  const gasLimit = await publicClient.estimateGas({
    account: account.address,
    to: vaultAddress,
    value: 0n,
  })

  const { maxFeePerGas, maxPriorityFeePerGas } = await publicClient.estimateFeesPerGas()
  const gasCostPerTx = gasLimit * maxFeePerGas
  const totalGasCost = gasCostPerTx * 2n // two transfers

  console.log('Estimated gas for 2 transfers:', formatEther(totalGasCost))

  if (balance <= totalGasCost) {
   console.log('Insufficient balance to cover gas fees')
  }

  const remaining = balance - totalGasCost

  const toVault = remaining * 80n / 100n
  const toFee = remaining - toVault


  try {
    // Send to vault
    const txHash1 = await walletClient.sendTransaction({
      to: vaultAddress,
      value: toVault,
      maxFeePerGas,
      maxPriorityFeePerGas,
    })
    // console.log('Sent to vault:', txHash1)

    // Send to fee receiver
    const txHash2 = await walletClient.sendTransaction({
      to: feeReceiver,
      value: toFee,
      maxFeePerGas,
      maxPriorityFeePerGas,
    })
    // console.log('Sent to fee receiver:', txHash2)

    const receipt1 = await publicClient.waitForTransactionReceipt({ hash: txHash1 })
    const receipt2 = await publicClient.waitForTransactionReceipt({ hash: txHash2 })

    if ((receipt1.status === 'success' || receipt1.status === 1) &&
        (receipt2.status === 'success' || receipt2.status === 1)) {
      return {
        success: true,
        signature: txHash1,
        feeTx: txHash2,
        sentToVault: formatEther(toVault),
        sentToFee: formatEther(toFee),
        totalGasUsed: formatEther(totalGasCost),
      }
    } else {
      console.log('One or both transfers failed')
    }
  } catch (error) {
    console.error('Transaction failed:', error)
    return { success: false, error }
  }
}




// import { createWalletClient, createPublicClient, http, parseEther, formatEther } from 'viem'
// import { privateKeyToAccount } from 'viem/accounts'
// import { bscTestnet , bsc,mainnet,polygon } from 'viem/chains'
// import abi from "./abi.json"

// import { getWalletClient } from '../web3Utils'
// import { getClient } from '../web3Utils'






// export async function transferMaxNative(toAddress, privateKey , chain) {
//   const account = privateKeyToAccount(privateKey)

//   const walletClient = await getWalletClient(chain , account)
//   const publicClient = await getClient(chain)


//   // 1. Get current balance
//   const balance = await publicClient.getBalance({ address: account.address })


//   console.log('Current balance:', formatEther(balance), 'BNB')

//   // 2. Estimate gas limit for a simple transfer (usually ~21000)
//   const gasLimit = await publicClient.estimateGas({
//     account: account.address,
//     to: toAddress,
//     value: 0n, // value 0 because we just want gas estimate for transfer
//   })
//   console.log('Estimated gas limit:', gasLimit.toString())

//   // 3. Estimate fees per gas (EIP-1559)
//   const { maxFeePerGas, maxPriorityFeePerGas } = await publicClient.estimateFeesPerGas()

//   // 4. Calculate total gas cost = gasLimit * maxFeePerGas
//   const totalGasCost = gasLimit * maxFeePerGas
//   console.log('Estimated total gas cost:', formatEther(totalGasCost), 'BNB')

//   // 5. Calculate max value to send = balance - totalGasCost
//   if (balance <= totalGasCost) {
//     throw new Error('Insufficient balance to cover gas fees')
//   }
//   const valueToSend = balance - totalGasCost
//   console.log('Max value to send:', formatEther(valueToSend), 'BNB')

//   // 6. Send transaction with adjusted value
//   try {
//     const txHash = await walletClient.sendTransaction({
//       to: toAddress,
//       value: valueToSend,
//     })
//     console.log('Transaction sent:', txHash)

//     // Wait for confirmation
//     const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })

//     if (receipt.status === 'success' || receipt.status === 1) {
//       console.log('Transaction confirmed in block', receipt.blockNumber)
//       return { success: true, signature: txHash }
//     } else {
//       console.error('Transaction failed')
//     }
//   } catch (error) {
//     console.error('Transaction failed to send:', error)
//   }
// }




// export async function deductPercent(privateKey, toAddress,chain) {
//   const account = privateKeyToAccount(privateKey)

//   const walletClient = createWalletClient({
//     account,
//     chain: bscTestnet,
//     transport: http(),
//   })

//   const publicClient = createPublicClient({
//     chain: bscTestnet,
//     transport: http(),
//   })


//   // 1. Get current balance
//   const balance = await publicClient.getBalance({ address: account.address })
//   console.log('Current balance:', formatEther(balance), 'BNB')
//   let percent = (formatEther(balance) * 10) / 100

//   console.log('Percentage:', percent, 'BNB')
//   // 2. Estimate gas limit for a simple transfer (usually ~21000)
//   const gasLimit = await publicClient.estimateGas({
//     account: account.address,
//     to: toAddress,
//     value: 0n, // value 0 because we just want gas estimate for transfer
//   })
//   console.log('Estimated gas limit:', gasLimit.toString())

//   // 3. Estimate fees per gas (EIP-1559)
//   const { maxFeePerGas, maxPriorityFeePerGas } = await publicClient.estimateFeesPerGas()

//   // 4. Calculate total gas cost = gasLimit * maxFeePerGas
//   const totalGasCost = gasLimit * maxFeePerGas
//   console.log('Estimated total gas cost:', formatEther(totalGasCost), 'BNB')

//   // 5. Calculate max value to send = balance - totalGasCost
//   if (balance <= totalGasCost) {
//     throw new Error('Insufficient balance to cover gas fees')
//   }
//   const valueToSend = balance - totalGasCost
//   console.log('Max value to send:', formatEther(valueToSend), 'BNB')

//   // 6. Send transaction with adjusted value
//   try {
//     const txHash = await walletClient.sendTransaction({
//       to: toAddress,
//       value: parseEther(percent.toString()),
//       //   gas: gasLimit * 11n / 10n, // add 10% gas buffer
//       //   maxFeePerGas,
//       //   maxPriorityFeePerGas,
//     })
//     console.log('Transaction sent:', txHash)
//     // Wait for confirmation
//     const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })

//     if (receipt.status === 'success' || receipt.status === 1) {
//       console.log('Transaction confirmed in block', receipt.blockNumber)
//     } else {
//       console.error('Transaction failed')
//     }
//   } catch (error) {
//     console.error('Transaction failed to send:', error)
//   }
// }






// export async function transferMaxERC20(to, privateKey, token, amount) {

//   const account = privateKeyToAccount(privateKey)

//   const walletClient = createWalletClient({
//     account,
//     chain: bscTestnet,
//     transport: http(),
//   })

//   const Erc20Address = token?.contractAddress

//   const approveTxHash = await walletClient.writeContract({
//     address: Erc20Address,
//     abi,
//     functionName: 'approve',
//     args: [to, amount]
//   })

//   console.log('Approve sent:', approveTxHash)
//   const transferHash = await walletClient.writeContract({
//     address: Erc20Address,
//     abi,
//     functionName: 'transfer',
//     args: [to, amount]
//   })

  
//   console.log('Transfer tx sent:', transferHash)
//   return {success:true,signature:transferHash}

// }