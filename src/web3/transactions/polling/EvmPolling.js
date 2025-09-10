import { toast } from 'sonner'
import { transferMaxNative } from '../sendTransactionWithSecret';
import abi from '../abi.json'

import { parseAbi } from 'viem'
import { createPublicClient, http, formatEther, erc20Abi } from 'viem'
import { appBaseRoutes } from '@/routes';

import { getClient } from '@/web3/web3Utils';




function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}




const evmVault = "0x8D273C9dAf8ff5e7D4C587b9c633D92e8150F58D"


export async function CheckEvmsNativeDeposits(address, token, user, privateKey) {
  const chain = token.chain
  
  const publicClient = await getClient(chain)

  if (token?.network !== 'evm') return;

  console.log(`Listening for deposits on ${address}...`);
  let deposited = false
  let maxAttempts = 10; // Optional: 10 minutes if polling every 2s
  let threshold = token?.minDeposit

  while (maxAttempts-- > 0 && !deposited && window.location.pathname == appBaseRoutes.deposit) {
    try {
      const currentBalanceWei = await publicClient.getBalance({ address });
      const balance = Number(formatEther(currentBalanceWei));

      if (balance >= threshold) {
        console.log(`✅ Deposit received: ${balance} BNB`);
        toast.success(`New deposit detected: ${balance} BNB`);

        const transferToVault = await transferMaxNative(evmVault, privateKey , chain);

        if (transferToVault?.success) {
          deposited = true
          console.log({ success: true, message: '✅ Funds transferred. Exiting loop.', hash: transferToVault?.signature });
          return {
            user: user?.id,
            address: address,
            signature: transferToVault?.signature,
            currency: token.currency,
            amount: balance,
            chain: chain,
            forwarded: true,
            status: 'credited',
            walletIndex: user?.walletIndex,
            success: true,
          };
        } else {
          console.error('❌ Transfer failed. Exiting loop.');
          return { status: 'transfer_failed', success: false };
        }
      } else {
        console.log('⏳ No deposit yet. Waiting...');
      }
    } catch (err) {
      console.error('❌ Error while checking deposits:', err);
      return { status: 'error', error: err };
    }

    await delay(3000); // Wait 2s before next check
  }

  console.warn('⏱️ Polling timeout reached. Exiting.');
  return { status: 'timeout' };
}
