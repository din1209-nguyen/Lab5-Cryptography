const crypto = require('crypto');

// DES yêu cầu Key đúng 8 bytes (64-bit), expect hex string
const formatKey = (key) => {
    if (typeof key !== 'string') {
        throw new Error('DES key must be a hex string');
    }
    
    let hexKey = key;
    // Nếu key không phải hex string, chuyển đổi từ text
    if (!/^[0-9a-fA-F]*$/.test(key)) {
        hexKey = Buffer.from(key).toString('hex');
    }
    
    if (hexKey.length !== 16) {
        throw new Error(`DES key must be 8 bytes (16 hex characters). Got ${hexKey.length} characters.`);
    }
    return Buffer.from(hexKey, 'hex');
};

const encryptDES = (plaintext, key, mode = 'des-ecb') => {
    try {
        const formattedKey = formatKey(key);
        // Cho DES-ECB, IV là Buffer rỗng
        const iv = Buffer.alloc(0);
        const cipher = crypto.createCipheriv(mode, formattedKey, iv);
        cipher.setAutoPadding(true);
        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (err) {
        throw new Error(`Encryption error: ${err.message}`);
    }
};

const decryptDES = (ciphertext, key, mode = 'des-ecb') => {
    try {
        const formattedKey = formatKey(key);
        // Cho DES-ECB, IV là Buffer rỗng
        const iv = Buffer.alloc(0);
        const decipher = crypto.createDecipheriv(mode, formattedKey, iv);
        decipher.setAutoPadding(true);
        let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (err) {
        throw new Error(`Decryption error: ${err.message}`);
    }
};

const generateRandomKey = () => {
    return crypto.randomBytes(8).toString('hex');
};

module.exports = { encryptDES, decryptDES, generateRandomKey };