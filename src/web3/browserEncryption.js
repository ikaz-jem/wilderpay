// lib/crypto/encryption.js
import CryptoJS from 'crypto-js';

const secret = process.env.ENCRYPTION_SECRET;

// Encrypt private key
export function encryptPrivateKeyBrowser(privateKey) {
  return CryptoJS.AES.encrypt(privateKey, secret).toString();
}

// Decrypt private key
export function decryptPrivateKeyBrowser(cipherText) {
  const bytes = CryptoJS.AES.decrypt(cipherText, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
}
