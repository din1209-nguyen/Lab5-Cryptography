const crypto = require('crypto');

const SUPPORTED_MODES = ['ECB', 'CBC'];

const parseHexBuffer = (hexValue, fieldName) => {
  try {
    return Buffer.from(hexValue, 'hex');
  } catch (error) {
    throw new Error(`${fieldName} must be a valid hex string`);
  }
};

const validateMode = (mode) => {
  if (!SUPPORTED_MODES.includes(mode)) {
    throw new Error(`Mode must be ECB or CBC, got ${mode}`);
  }
};

const getCryptoContext = (key, mode, iv = null, algorithm = '3DES') => {
  const keyBuffer = parseHexBuffer(key, 'Key');
  validateMode(mode);

  let cipherAlgo = '';
  let expectedKeyLen = 0;

  // Cấu hình thông số theo từng thuật toán
  switch (algorithm.toUpperCase()) {
    case 'DES':
      expectedKeyLen = 8; // 64 bits
      cipherAlgo = `des-${mode.toLowerCase()}`;
      break;
    case '3DES':
      expectedKeyLen = 24; // 192 bits
      cipherAlgo = `des-ede3-${mode.toLowerCase()}`;
      break;
    case 'AES':
      expectedKeyLen = 16; // AES-128 (có thể chỉnh thành 32 cho AES-256)
      cipherAlgo = `aes-128-${mode.toLowerCase()}`;
      break;
    default:
      throw new Error(`Algorithm ${algorithm} not supported`);
  }

  if (keyBuffer.length !== expectedKeyLen) {
    throw new Error(`${algorithm} key must be ${expectedKeyLen} bytes, got ${keyBuffer.length} bytes`);
  }

  let ivBuffer = null;
  if (mode === 'CBC') {
    if (!iv) throw new Error('IV is required for CBC mode');
    ivBuffer = parseHexBuffer(iv, 'IV');
    if (ivBuffer.length !== 8 && algorithm !== 'AES') { // DES/3DES cần 8 bytes IV
        throw new Error('IV must be 8 bytes');
    }
    if (algorithm === 'AES' && ivBuffer.length !== 16) { // AES cần 16 bytes IV
        throw new Error('IV for AES must be 16 bytes');
    }
  }

  return { keyBuffer, ivBuffer, cipherAlgo };
};

const runCrypto = (operation, text, key, mode, iv = null, algorithm = '3DES') => {
  
  const { keyBuffer, ivBuffer, cipherAlgo } = getCryptoContext(key, mode, iv, algorithm);
  const isEncrypt = operation === 'encrypt';

  // Đối với ECB, IV phải là một Buffer rỗng (không dùng chuỗi trống '')
  const finalIv = (mode === 'ECB') ? Buffer.alloc(0) : ivBuffer;

  const cryptoTransform = isEncrypt
    ? crypto.createCipheriv(cipherAlgo, keyBuffer, finalIv)
    : crypto.createDecipheriv(cipherAlgo, keyBuffer, finalIv);

  const inputEncoding = isEncrypt ? 'utf8' : 'hex';
  const outputEncoding = isEncrypt ? 'hex' : 'utf8';

  let transformed = cryptoTransform.update(text, inputEncoding, outputEncoding);
  transformed += cryptoTransform.final(outputEncoding);

  return transformed;
};

// Hàm tạo random key cho 3DES (24 bytes = 192 bits)
const generateRandomKey = (algorithm = '3DES') => {
  let bytes = 24; // Mặc định 3DES
  if (algorithm === 'DES') bytes = 8;
  if (algorithm === 'AES') bytes = 16;
  return crypto.randomBytes(bytes).toString('hex');
};

// Hàm tạo random IV (8 bytes = 64 bits)
const generateRandomIV = (algorithm = '3DES') => {
  let bytes = 8; // DES và 3DES dùng 8 bytes IV
  if (algorithm === 'AES') bytes = 16; // AES dùng 16 bytes IV
  return crypto.randomBytes(bytes).toString('hex');
};

// Hàm mã hóa chung
const encrypt = (plaintext, key, mode, iv = null, algorithm) => {
  try {
    return runCrypto('encrypt', plaintext, key, mode, iv, algorithm);
  } catch (error) {
    throw new Error(`Encryption error: ${error.message}`);
  }
};

// Hàm giải mã chung
const decrypt = (ciphertext, key, mode, iv = null, algorithm) => {
  try {
    return runCrypto('decrypt', ciphertext, key, mode, iv, algorithm);
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
