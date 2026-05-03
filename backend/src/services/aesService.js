const CryptoJS = require("crypto-js");

// Nơi chỉ tập trung xử lý thuật toán AES
const encrypt = (plaintext, secretKey) => {
    return CryptoJS.AES.encrypt(plaintext, secretKey).toString();
};

const decrypt = (ciphertext, secretKey) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = {
    encrypt,
    decrypt
};