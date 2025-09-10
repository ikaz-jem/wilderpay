

import * as bip39 from 'bip39';
import { ethers } from 'ethers';

const mnemonic = process.env.HD_MNEMONIC;
const seed = await bip39.mnemonicToSeed(mnemonic);

export async function createOrGetEvmWallet(account,index) {
    const evmPath = `m/44'/60'/0'/${account}'/${index}'`;
    const evmWallet = ethers.HDNodeWallet.fromSeed(seed).derivePath(evmPath);
    return { address: evmWallet.address, privateKey: evmWallet.privateKey }
}


export async function getEvmWallet(account,index) {
    const evmPath = `m/44'/60'/0'/${account}'/${index}'`;
    const hdNode = ethers.HDNodeWallet.fromSeed(seed).derivePath(evmPath);
    return {
        address: hdNode.address,
        publicKey: hdNode.publicKey,
        privateKey: hdNode.privateKey,
        path: evmPath
    };
}

