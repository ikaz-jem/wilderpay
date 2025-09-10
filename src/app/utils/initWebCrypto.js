import { Crypto } from '@peculiar/webcrypto';
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = new Crypto();
}