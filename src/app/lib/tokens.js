import {v4 as uuid} from 'uuid'

export const generateVerificationToken = (hour) => {
  const token = uuid(); // unique string
  let expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  if (hour) {
    expiresAt = new Date(Date.now() + hour * 60 * 60 * 1000);
  }

  return { token, expiresAt };
};