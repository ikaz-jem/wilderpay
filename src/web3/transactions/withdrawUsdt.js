import TronWeb from 'tronweb'
import { getWalletClient, getClient } from '../web3Utils'
import { privateKeyToAccount } from 'viem/accounts'
import { parseUnits } from 'viem'
import erc20Abi from './abi.json'

const USDT_ADDRESSES = {
  bsc: '0x55d398326f99059fF775485246999027B3197955',
  bscTestnet: '0x7Ef95a0FeF9b99f9c1a40B7D6586A7D4C9A37F14',
}

const TRON_USDT_CONTRACT = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj'

export async function withdrawUsdt({ toAddress, privateKey, chain, amount }) {
  if (chain === 'trc') {
    // ✅ TRON/TRC20 Flow
    const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io',
      privateKey,
    })

    const contract = await tronWeb.contract().at(TRON_USDT_CONTRACT)
    const decimals = 6
    const amountInUnits = (Number(amount) * 10 ** decimals).toString()

    try {
      const tx = await contract.methods
        .transfer(toAddress, amountInUnits)
        .send()

      console.log('TRON USDT Tx:', tx)
      return { success: true, txHash: tx }
    } catch (err) {
      console.error('TRON transfer error:', err)
    return { success: false, error: err }

    }

  } else if (chain === 'bsc' || chain === 'bscTestnet') {
    // ✅ BSC/BEP20 Flow
    const tokenAddress = USDT_ADDRESSES[chain]
    const decimals = 18
    const account = privateKeyToAccount(privateKey)

    const walletClient = await getWalletClient(chain, account)
    const publicClient = await getClient(chain)

    const amountInUnits = parseUnits(amount.toString(), decimals)

    try {
      const txHash = await walletClient.writeContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [toAddress, amountInUnits],
        account,
      })

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })
      console.log('BSC USDT Tx confirmed:', receipt)
      return { success: true, txHash, block: receipt.blockNumber }

    } catch (err) {
      console.error('BSC transfer error:', err)
     return { success: false, error: err }
    }
  } else {
     return { success: false, error: `Unsupported chain: ${chain}` }
  }
}
