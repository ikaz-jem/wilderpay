// lib/hdwallet.js

import bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair as SolanaKeypair } from '@solana/web3.js';


export async function createOrGetSolWallet (index){
    const mnemonic = process.env.HD_MNEMONIC;
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const solanaPath = `m/44'/501'/0'/${index}'`;
    const { key: solanaPrivateKey } = derivePath(solanaPath, seed.toString('hex'));
    // `solanaPrivateKey` is 32 bytes → valid for fromSeed
    const solanaWallet = SolanaKeypair.fromSeed(solanaPrivateKey); // Keypair = public + private
    // Extract the full secret key (64 bytes: private + public)
    const secretKeyHex = Buffer.from(solanaWallet.secretKey).toString('hex');
    // 🔐 Outputs
    console.log({publicKey:solanaWallet.publicKey.toBase58() ,privateKey:secretKeyHex });

    return {publicKey:solanaWallet.publicKey.toBase58() ,privateKey:secretKeyHex }


}
createOrGetSolWallet(0)