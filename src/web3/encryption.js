import crypto from 'crypto';

const ALGO = 'aes-256-cbc';
const KEY = crypto.scryptSync(process.env.ENCRYPTION_SECRET, 'salt', 32);
const IV = Buffer.alloc(16, 0);

export function encryptPrivateKey(privateKey) {
  const cipher = crypto.createCipheriv(ALGO, KEY, IV);
  return cipher.update(privateKey, 'utf8', 'hex') + cipher.final('hex');
}

export function decryptPrivateKey(encrypted) {
  const decipher = crypto.createDecipheriv(ALGO, KEY, IV);
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
}
