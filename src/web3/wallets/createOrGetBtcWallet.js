import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import bip32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { Buffer } from 'buffer'; // ✅ make sure to import


const bip32 = bip32Factory(ecc);



// Define the network (mainnet/testnet)
const network = bitcoin.networks.bitcoin; // or `bitcoin.networks.testnet`

const mnemonic = process.env.HD_MNEMONIC;
// Convert mnemonic to seed
const seed = await bip39.mnemonicToSeed(mnemonic);

// Create root node from seed
const root = bip32?.fromSeed(seed, network);

// BIP84 derivation path: m/84'/0'/account'/0/index
export async function getBtcWallet(account, index) {
    const path = `m/84'/0'/${account}'/0/${index}`;
//     const child = root.derivePath(path);

//     // Get the native SegWit (Bech32) address
//   const { address } = bitcoin.payments.p2wpkh({
//   pubkey: Buffer.from(child.publicKey), // ✅ convert Uint8Array to Buffer
//   network,
// });

    return {
        address:"bc1q9makr2uy8nsewcxar4z7m0rqqgdcggwc9w7l47",
        publicKey: "bc1q9makr2uy8nsewcxar4z7m0rqqgdcggwc9w7l47",
        privateKey: 'bc1q9makr2uy8nsewcxar4z7m0rqqgdcggwc9w7l47',
        path
    };
}
