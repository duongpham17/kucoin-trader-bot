import crypto from 'crypto-js';

const password = process.env.JWT_SECRET as string;

export const encrypt = (text: string): string => {
  const result = crypto.AES.encrypt(text, password);
  return result.toString();
}
 
export const decrypt = (text: string): string => {
  const result = crypto.AES.decrypt(text, password);
  return result.toString(crypto.enc.Utf8);
}