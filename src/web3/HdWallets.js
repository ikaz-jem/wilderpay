import bip39 from 'bip39';
import { ethers } from 'ethers';
import { derivePath } from 'ed25519-hd-key';
import { Keypair as SolanaKeypair } from '@solana/web3.js';
import TonWeb from 'tonweb';
import bs58 from 'bs58';

// 1. Generate ONE mnemonic
const mnemonic = bip39.generateMnemonic();
console.log(mnemonic)
/*
const seed = await bip39.mnemonicToSeed("zoo police spell hobby blur label hand case arena abandon broken fault");

// console.log("🌱 Mnemonic:", mnemonic);
console.log("🟢 Seed:", seed);

// ---- EVM (ETH/BSC) - secp256k1
// const evmWallet = ethers.HDNodeWallet.fromSeed(seed).derivePath("m/44'/60'/0'/0/0");
// console.log("🟢 Ethereum/BSC Address:", evmWallet.address , evmWallet.privateKey);

// ---- Solana - ed25519
const solanaPath = "m/44'/501'/0'/0'";
const { key: solanaPrivateKey } = derivePath(solanaPath, seed.toString('hex'));

// `solanaPrivateKey` is 32 bytes → valid for fromSeed
const solanaWallet = SolanaKeypair.fromSeed(solanaPrivateKey); // Keypair = public + private

// Extract the full secret key (64 bytes: private + public)
const secretKeyHex = Buffer.from(solanaWallet.secretKey).toString('hex');

// 🔐 Outputs
console.log("🟡 Solana Address:", solanaWallet.publicKey.toBase58());
console.log("🔐 Secret Key (hex):", secretKeyHex);

// const tonPath = "m/44'/607'/0'/0'";
// const { key: tonSeed } = derivePath(tonPath, seed.toString('hex')); // 32 bytes

// // === Generate TON wallet from derived seed ===
// const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(tonSeed);
// const tonWeb = new TonWeb();
// const tonWallet = tonWeb.wallet.create({ publicKey: keyPair.publicKey });
// const tonAddress = await tonWallet.getAddress();

// // === Output ===
// console.log("🔐 TON Secret Key (hex):", Buffer.from(keyPair.secretKey).toString('hex'));
// console.log("🔓 TON Public Key (hex):", Buffer.from(keyPair.publicKey).toString('hex'));
// console.log("🔵 TON Address:", tonAddress.toString(true, true, true));
*/