const crypto = require('crypto');

// DES yêu cầu Key đúng 8 bytes (64-bit)
const formatKey = (key) => {
    return Buffer.from(key.padEnd(8, '0').slice(0, 8));
};

const encryptDES = (plaintext, key, mode = 'des-ecb') => {
    const formattedKey = formatKey(key);
    // Với ECB, IV là null. Nếu dùng CBC, bạn cần thêm IV 8 bytes.
    const cipher = crypto.createCipheriv(mode, formattedKey, null);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const decryptDES = (ciphertext, key, mode = 'des-ecb') => {
    const formattedKey = formatKey(key);
    const decipher = crypto.createDecipheriv(mode, formattedKey, null);
    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

const generateRandomKey = () => {
    return crypto.randomBytes(8).toString('hex').slice(0, 8);
};

module.exports = { encryptDES, decryptDES, generateRandomKey };