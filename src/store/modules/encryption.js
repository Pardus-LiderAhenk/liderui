// encryption.js
import CryptoJS from 'crypto-js';

// let secretKey = process.env.VUE_APP_STORE_KEY;
let secretKey = "";
export function encryptData(data) {
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  return encryptedData;
}

export function decryptData(encryptedData) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}


