import { generateSeed, deriveKeypair, deriveAddress } from 'ripple-keypairs';


import * as bip39 from "bip39"
import { derivePath } from "ed25519-hd-key"
import xrpl from "xrpl"

// 🔐 Your master mnemonic (generate once and store securely!)
const MASTER_MNEMONIC = process.env.HD_MNEMONIC

export async function getXrpWallet(account,index ) {
  // 1. Convert mnemonic -> seed
  const seed = await bip39.mnemonicToSeed(MASTER_MNEMONIC)

  // 2. Build BIP44 path for XRP with user index
  const path = `m/44'/144'/0'/${account}'/${index}'`

  // 3. Derive private key
  const { key } = derivePath(path, seed.toString("hex"))

  // 4. Make XRPL wallet from private key
  const wallet = xrpl.Wallet.fromEntropy(key)

   return {
        address: wallet.address,
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
        path: path
    };
}

// Example usage
// ;(async () => {
//   const userId = 1234567890  // could be user ID or timestamp
//   const wallet = await getUserWallet(userId)

//   console.log("User Wallet Address:", wallet.address)
//   console.log("Seed:", wallet.seed)           // only if you need it
//   console.log("Private Key:", wallet.privateKey) // careful storing this!
// })()


// const secret = process.env.ENCRYPTION_SECRET;



// // Generate a unique seed for the user
// const userSeed = generateSeed(); // e.g., "s████████████████"

// console.log({userSeed})
// // Derive keypair
// const keypair = deriveKeypair('sEdSSMLMnTQiHjhTAmstrTEaXHJEL7y');
// const address = deriveAddress(keypair.publicKey);

// console.log('User address:', address);
// console.log('Private key (hex):', keypair.privateKey);
// console.log('Seed (save this):', userSeed);

// async function getBalance(address) {
//   const balances = await api.getBalances(address);
//   console.log(`Balances for ${address}:`, balances);
// }

// getBalance(address);



