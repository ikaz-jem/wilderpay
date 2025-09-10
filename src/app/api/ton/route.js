
export const runtime = 'nodejs';

import crypto from 'crypto'; // Node.js crypto module

import { derivePath } from 'ed25519-hd-key';
import TonWeb from 'tonweb';
import * as bip39 from 'bip39';




export async function GET () {
    
    
    const mnemonic = process.env.HD_MNEMONIC;
    const seed = await bip39.mnemonicToSeed(mnemonic);
    
    const path = `m/44'/607'/0'/0'`;
    const { key } = derivePath(path, seed.toString('hex'));
    const tonSeed = key.slice(0, 32); // Ensure it's 32 bytes
    
    const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(tonSeed);
    
    const tonWeb = new TonWeb();
    
  // Create wallet with the public key from the key pair
  const tonWallet = tonWeb.wallet.create({ publicKey: keyPair.publicKey });
  
  try {
      console.log("Attempting to get TON address...");
      const tonAddress = await tonWallet.getAddress();
     Response.json( {
          address: tonAddress.toString(true, true, true),  // Format the address
          publicKey: Buffer.from(keyPair.publicKey).toString('hex'),
          secretKey: Buffer.from(keyPair.secretKey).toString('hex'),
          path,  // Include the path for reference
        })  // Get the address
   
  } catch (error) {
    console.error("Error getting TON address:", error);  // Log the actual error
    throw new Error(`Failed to retrieve TON address: ${error.message}`);
  }

}

