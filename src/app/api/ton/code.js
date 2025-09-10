  export const runtime = 'nodejs';
  import fs from "fs"
  import { derivePath } from 'ed25519-hd-key';
  import TonWeb from 'tonweb';
  import * as bip39 from 'bip39';
  import crypto from 'node:crypto';
  
  try {
    const mnemonic = process.env.HD_MNEMONIC;
    if (!mnemonic) {
      return new Response(JSON.stringify({ error: 'HD_MNEMONIC not set' }), { status: 400 });
    }

    const seed = await bip39.mnemonicToSeed(mnemonic);
    const path = `m/44'/607'/0'/0'`;
    const { key } = derivePath(path, seed.toString('hex'));
    const tonSeed = key.slice(0, 32);

    const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(tonSeed);

    // Initialize TonWeb with HTTP provider and optional API key
    const tonWeb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {
      apiKey: process.env.TONCENTER_API_KEY,
    }));

    const tonWallet = tonWeb.wallet.create({ publicKey: keyPair.publicKey });

    const tonAddress = await tonWallet.getAddress();

    return new Response(
      JSON.stringify({
        address: tonAddress.toString(true, true, true),
        publicKey: Buffer.from(keyPair.publicKey).toString('hex'),
        secretKey: Buffer.from(keyPair.secretKey).toString('hex'),
        path,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error getting TON address:', error);
    return new Response(
      JSON.stringify({ error: `Failed to retrieve TON address: ${error.message}` }),
      { status: 500 }
    );
  }