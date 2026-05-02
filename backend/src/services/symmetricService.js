const crypto = require('crypto');

// Hàm tạo random key cho 3DES (24 bytes = 192 bits)
const generateRandomKey = () => {
  return crypto.randomBytes(24).toString('hex');
};

// Hàm tạo random IV (8 bytes = 64 bits)
const generateRandomIV = () => {
  return crypto.randomBytes(8).toString('hex');
};

// Hàm mã hóa 3DES
const encrypt = (plaintext, key, mode, iv = null) => {
  try {
    // Chuyển đổi hex key thành Buffer
    const keyBuffer = Buffer.from(key, 'hex');

    // Kiểm tra độ dài key
    if (keyBuffer.length !== 24) {
      throw new Error(`3DES key must be 24 bytes (48 hex characters), got ${keyBuffer.length} bytes`);
    }

    // Kiểm tra mode hợp lệ
    if (!['ECB', 'CBC'].includes(mode)) {
      throw new Error(`Mode must be ECB or CBC, got ${mode}`);
    }

    // Xác định cipher algorithm - sử dụng tên chính xác des-ede3
    const cipherAlgo = mode === 'ECB' ? 'des-ede3-ecb' : 'des-ede3-cbc';

    // Kiểm tra IV cho CBC mode
    let ivBuffer = null;
    if (mode === 'CBC') {
      if (!iv) {
        throw new Error('IV is required for CBC mode');
      }
      ivBuffer = Buffer.from(iv, 'hex');
      if (ivBuffer.length !== 8) {
        throw new Error(`IV must be 8 bytes (16 hex characters), got ${ivBuffer.length} bytes`);
      }
    }

    // Tạo cipher
    const cipher = mode === 'ECB' 
      ? crypto.createCipheriv(cipherAlgo, keyBuffer, '')
      : crypto.createCipheriv(cipherAlgo, keyBuffer, ivBuffer);

    // Mã hóa plaintext
    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');

    return ciphertext;
  } catch (error) {
    throw new Error(`Encryption error: ${error.message}`);
  }
};

// Hàm giải mã 3DES
const decrypt = (ciphertext, key, mode, iv = null) => {
  try {
    // Chuyển đổi hex key thành Buffer
    const keyBuffer = Buffer.from(key, 'hex');

    // Kiểm tra độ dài key
    if (keyBuffer.length !== 24) {
      throw new Error(`3DES key must be 24 bytes (48 hex characters), got ${keyBuffer.length} bytes`);
    }

    // Kiểm tra mode hợp lệ
    if (!['ECB', 'CBC'].includes(mode)) {
      throw new Error(`Mode must be ECB or CBC, got ${mode}`);
    }

    // Xác định cipher algorithm - sử dụng tên chính xác des-ede3
    const cipherAlgo = mode === 'ECB' ? 'des-ede3-ecb' : 'des-ede3-cbc';

    // Kiểm tra IV cho CBC mode
    let ivBuffer = null;
    if (mode === 'CBC') {
      if (!iv) {
        throw new Error('IV is required for CBC mode');
      }
      ivBuffer = Buffer.from(iv, 'hex');
      if (ivBuffer.length !== 8) {
        throw new Error(`IV must be 8 bytes (16 hex characters), got ${ivBuffer.length} bytes`);
      }
    }

    // Tạo decipher
    const decipher = mode === 'ECB'
      ? crypto.createDecipheriv(cipherAlgo, keyBuffer, '')
      : crypto.createDecipheriv(cipherAlgo, keyBuffer, ivBuffer);

    // Giải mã ciphertext
    let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
    plaintext += decipher.final('utf8');

    return plaintext;
  } catch (error) {
    throw new Error(`Decryption error: ${error.message}`);
  }
};

module.exports = {
  generateRandomKey,
  generateRandomIV,
  encrypt,
  decrypt
};
