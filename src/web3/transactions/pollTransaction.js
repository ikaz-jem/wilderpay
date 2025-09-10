// import { createPublicClient, http, formatEther, erc20Abi } from 'viem'
// import { parseAbi } from 'viem'
// import { mainnet, bsc, bscTestnet, polygon } from 'viem/chains'
// import abi from './abi.json'
// import { transferMaxERC20, transferMaxNative } from './sendTransactionWithSecret'


import { checkSolanaNativeDeposits } from './polling/SolanaPolling'
import { CheckEvmsNativeDeposits } from './polling/EvmPolling'
import { CheckBep20Deposits } from './polling/Beb20Polling'


export async function checkDeposit(address, token, user, privateKey) {
  if (token?.isNative) {
    // console.log('Token Is Native !')
    if (token?.network == "evm" && token?.currency !== "XRP"){
      const success = await CheckEvmsNativeDeposits(address, token, user, privateKey)
      return success
    }
   
    if (token?.network == "solana"){
      // console.log('solana network')
      const success = await checkSolanaNativeDeposits(address,token, user,privateKey )
      return success
    }
  } else {
    if (token?.network == "evm" && token?.currency =="XRP"){
      const success = await CheckBep20Deposits(address, token, user, privateKey)
      return success
    }
    // console.log('Token - not Native !')
    // const success = await CheckErc20Balance(address, token, user, privateKey)
  }
}






// async function CheckErc20Balance(userAddress, token,user,privateKey) {
// if (!userAddress || !token?.contractAddress|| !user ||!privateKey) return
//   let deposited = false
//   let maxAttempts = 100;


//   while (maxAttempts-- > 0 && !deposited) {
//     try {

//       const Erc20Address = token?.contractAddress
//       const currentBalanceWei = await publicClient.readContract({
//         address: Erc20Address,
//         abi,
//         functionName: 'balanceOf',
//         args: [userAddress]
//       })

  
//       const balance = Number(formatEther(currentBalanceWei));

//       if (balance >= 1) {
//         console.log(`✅ Deposit received: ${balance} ${token?.name}`);
//         toast.success(`New deposit detected: ${balance} ${token?.name}`);



//         const transferToVault = await transferMaxERC20(
//           '0xF4Cbc0147930C3F1E9920A2dB64BE02EcB4192aD',
//           privateKey,token,currentBalanceWei
//         );

//         if (transferToVault?.success) {
//           deposited = true
//           console.log({ success: true, message: '✅ Funds transferred. Exiting loop.', hash: transferToVault?.signature });
//           return {
//             user: user?.id,
//             address: userAddress,
//             signature: transferToVault?.signature,
//             currency: token.currency,
//             amount: balance,
//             chain: token?.chain,
//             forwarded: true,
//             status: 'credited',
//             walletIndex: user?.walletIndex,
//             success: true,
//           };
//         } else {
//           console.error('❌ Transfer failed. Exiting loop.');
//           return { status: 'transfer_failed', success: false };
//         }
//       } else {
//         console.log('⏳ No deposit yet. Waiting...');
//       }
//     } catch (err) {
//       console.error('❌ Error while checking deposits:', err);
//       return { status: 'error', error: err };
//     }

//     await delay(3000); // Wait 2s before next check
//   }

//   console.warn('⏱️ Polling timeout reached. Exiting.');
//   return { status: 'timeout' };

// }

