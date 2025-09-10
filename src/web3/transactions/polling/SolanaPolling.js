import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { toast } from 'sonner'

import { sendMaxSol } from '../sendTransaction/sendMaxSol'
import { appBaseRoutes } from '@/routes';

const solVault = "4AeeGKPHFm9uzoVJaLhJNTxBzf1UMgRXDH2843w3NBRL"

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



const dev = "https://devnet.helius-rpc.com/?api-key=e7017d59-07ed-4ad7-955a-5b16d052233e"
const mainnet = "https://mainnet.helius-rpc.com/?api-key=e7017d59-07ed-4ad7-955a-5b16d052233e"

const connection = new Connection(mainnet,'finalized')

export async function checkSolanaNativeDeposits(address,token,user,privateKey,) {
  if (token?.network !="solana") return
  
  let thresholdSOL = token?.minDeposit
  let maxAttempts = 10
  console.log(`Listening for deposits on Solana address: ${address}...`)
  
  const publicKey = new PublicKey(address)
  let deposited = false
  
  while (maxAttempts-- > 0 && !deposited && window.location.pathname == appBaseRoutes.deposit) {
    try {
      const balanceLamports = await connection.getBalance(publicKey)
      const balanceSOL = balanceLamports / LAMPORTS_PER_SOL

      if (balanceSOL >= thresholdSOL) {
        deposited = true
        console.log(`✅ Deposit received: ${balanceSOL} SOL`)
        toast.success(`✅ Deposit received: ${balanceSOL} SOL`);
        const transferedToVault = await sendMaxSol(solVault, privateKey)
        // TODO: Add your logic here, e.g., transfer funds, notify user, etc.
        if (transferedToVault?.success) {
          return {
            user: user?.id,
            address: address,
            signature: transferedToVault?.signature,
            currency: token.currency,
            amount: balanceSOL,
            chain: token?.chain,
            forwarded: true,
            status: 'credited',
            walletIndex: user?.walletIndex,
            success: true,
          }
        }else {
          console.error('❌ Transfer failed. Exiting loop.');
          return { status: 'transfer_failed', success: false };
        }
      } else {
        console.log('⏳ No deposit yet. Waiting ...')
      }
    } catch (err) {
      console.error('❌ Error while checking Solana deposits:', err)
      return { status: 'error', error: err }
    }
    await delay(5000) // Wait 3s before next check
  }
  console.warn('⏱️ Polling timeout reached. Exiting.')
  return { status: 'timeout' }
}


