const CryptoJS = require("crypto-js");

// Nơi chỉ tập trung xử lý thuật toán AES
const encrypt = (plaintext, secretKey) => {
    return CryptoJS.AES.encrypt(plaintext, secretKey).toString();
};

const decrypt = (ciphertext, secretKey) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
        throw new Error('Decryption failed: Invalid ciphertext or key');
    }
    return decrypted;
};

module.exports = {
    encrypt,
    decrypt
};