const crypto = require('crypto');

// Hàm tạo random key cho 3DES (24 bytes = 192 bits)
const generateRandomKey = () => {
  return crypto.randomBytes(24).toString('hex');
};

// Hàm tạo random IV (8 bytes = 64 bits cho DES/3DES)
const generateRandomIV = () => {
  return crypto.randomBytes(8).toString('hex');
};

// Hàm mã hóa 3DES với ECB mode
const encryptECB = (plaintext, key) => {
  try {
    // Chuyển đổi hex key thành Buffer
    const keyBuffer = Buffer.from(key, 'hex');
    
    // Kiểm tra độ dài key
    if (keyBuffer.length !== 24) {
      throw new Error('3DES key must be 24 bytes (48 hex characters)');
    }

    // Tạo cipher với algorithm 'des3' (3DES) và mode 'ecb'
    const cipher = crypto.createCipheriv('des3-ecb', keyBuffer, '');
    
    // Mã hóa plaintext
    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    
    return ciphertext;
  } catch (error) {
    throw new Error(`Encryption error: ${error.message}`);
  }
};

// Hàm giải mã 3DES với ECB mode
const decryptECB = (ciphertext, key) => {
  try {
    // Chuyển đổi hex key thành Buffer
    const keyBuffer = Buffer.from(key, 'hex');
    
    // Kiểm tra độ dài key
    if (keyBuffer.length !== 24) {
      throw new Error('3DES key must be 24 bytes (48 hex characters)');
    }

    // Tạo decipher với algorithm 'des3' (3DES) và mode 'ecb'
    const decipher = crypto.createDecipheriv('des3-ecb', keyBuffer, '');
    
    // Giải mã ciphertext
    let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
    plaintext += decipher.final('utf8');
    
    return plaintext;
  } catch (error) {
    throw new Error(`Decryption error: ${error.message}`);
  }
};

// Hàm mã hóa 3DES với CBC mode
const encryptCBC = (plaintext, key, iv) => {
  try {
    // Chuyển đổi hex key và IV thành Buffer
    const keyBuffer = Buffer.from(key, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');
    
    // Kiểm tra độ dài key
    if (keyBuffer.length !== 24) {
      throw new Error('3DES key must be 24 bytes (48 hex characters)');
    }
    
    // Kiểm tra độ dài IV
    if (ivBuffer.length !== 8) {
      throw new Error('IV must be 8 bytes (16 hex characters)');
    }

    // Tạo cipher với algorithm 'des3' (3DES) và mode 'cbc'
    const cipher = crypto.createCipheriv('des3-cbc', keyBuffer, ivBuffer);
    
    // Mã hóa plaintext
    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    
    return ciphertext;
  } catch (error) {
    throw new Error(`Encryption error: ${error.message}`);
  }
};

// Hàm giải mã 3DES với CBC mode
const decryptCBC = (ciphertext, key, iv) => {
  try {
    // Chuyển đổi hex key và IV thành Buffer
    const keyBuffer = Buffer.from(key, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');
    
    // Kiểm tra độ dài key
    if (keyBuffer.length !== 24) {
      throw new Error('3DES key must be 24 bytes (48 hex characters)');
    }
    
    // Kiểm tra độ dài IV
    if (ivBuffer.length !== 8) {
      throw new Error('IV must be 8 bytes (16 hex characters)');
    }

    // Tạo decipher với algorithm 'des3' (3DES) và mode 'cbc'
    const decipher = crypto.createDecipheriv('des3-cbc', keyBuffer, ivBuffer);
    
    // Giải mã ciphertext
    let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
    plaintext += decipher.final('utf8');
    
    return plaintext;
  } catch (error) {
    throw new Error(`Decryption error: ${error.message}`);
  }
};

// Export các hàm
module.exports = {
  generateRandomKey,
  generateRandomIV,
  encryptECB,
  decryptECB,
  encryptCBC,
  decryptCBC
};
