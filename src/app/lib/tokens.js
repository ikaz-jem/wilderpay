import {v4 as uuid} from 'uuid'

export const generateVerificationToken = () => {
  const token = uuid(); // unique string
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours in ms
  return { token, expiresAt };
};