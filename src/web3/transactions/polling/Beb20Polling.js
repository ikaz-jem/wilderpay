import { toast } from 'sonner';
import { transferMaxERC20 } from '../sendTransactionWithSecret';
import { appBaseRoutes } from '@/routes';
import { getClient } from '@/web3/web3Utils';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const evmVault = "0x869f93287924025C682Cb68f0c755170b5a0F3e1";

/**
 * Polls a BEP-20 deposit address for incoming funds and forwards them to vault
 */
export async function CheckBep20Deposits(address, token, user, privateKey) {
  const chain = token.chain;
  const publicClient = await getClient(chain); // your viem client

  if (token?.network !== 'evm') return;

  console.log(`Listening for BEP-20 deposits on ${address}...`);
  let deposited = false;
  let maxAttempts = 10;
  const threshold = token?.minDeposit ?? 0;

  while (maxAttempts-- > 0 && !deposited && window.location.pathname === appBaseRoutes.deposit) {
    try {
      let balance;

      if (!token.contractAddress) {
        // Native BNB
        const balanceWei = await publicClient.getBalance({ address });
        balance = Number(balanceWei) / 10 ** 18;
      } else {
        // BEP-20 token
        const erc20Balance = await publicClient.readContract({
          address: token.contractAddress,
          abi: [
            {
              inputs: [{ internalType: "address", name: "owner", type: "address" }],
              name: "balanceOf",
              outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
              stateMutability: "view",
              type: "function"
            }
          ],
          functionName: 'balanceOf',
          args: [address]
        });

        const decimals = token.decimals ?? 18;
        balance = Number(erc20Balance) / 10 ** decimals;
      }

      if (balance >= threshold) {
        console.log(`✅ Deposit received: ${balance} ${token.currency}`);
        toast.success(`New deposit detected: ${balance} ${token.currency}`);

        const transferToVault = true
        // const transferToVault = await transferMaxERC20(evmVault, privateKey, token, balance);

        if (transferToVault?.success) {
          deposited = true;
          console.log({ success: true, message: '✅ Funds transferred. Exiting loop.', hash: transferToVault.signature });
          return {
            user: user?.id,
            address: address,
            signature: transferToVault.signature,
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
      console.error('❌ Error while checking BEP-20 deposits:', err);
      return { status: 'error', error: err };
    }

    await delay(3000);
  }

  console.warn('⏱️ Polling timeout reached. Exiting.');
  return { status: 'timeout' };
}
