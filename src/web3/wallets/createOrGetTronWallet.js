import * as bip39 from 'bip39';
import TronWeb from 'tronweb';
import HDKey from 'hdkey';


const mnemonic = process.env.HD_MNEMONIC;
const seed = await bip39.mnemonicToSeed(mnemonic);
const tronWeb = new TronWeb({ fullHost: 'https://api.trongrid.io' });

export async function getTrc20Wallet(account, index) {
  const tronPath = `m/44'/195'/${account}'/0/${index}`;
  const root = HDKey.fromMasterSeed(seed);
  const child = root.derive(tronPath);
  const privateKey = child.privateKey.toString('hex');

  const address = tronWeb.address.fromPrivateKey(privateKey);

  return {
    address, // Tron address (Base58, starts with T)
    privateKey,
    publicKey: child.publicKey.toString('hex'),
    path: tronPath,
  };
}