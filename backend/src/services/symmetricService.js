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

const get3DESContext = (key, mode, iv = null) => {
  const keyBuffer = parseHexBuffer(key, 'Key');

  if (keyBuffer.length !== 24) {
    throw new Error(`3DES key must be 24 bytes (48 hex characters), got ${keyBuffer.length} bytes`);
  }

  validateMode(mode);

  const cipherAlgo = mode === 'ECB' ? 'des-ede3-ecb' : 'des-ede3-cbc';
  let ivBuffer = null;

  if (mode === 'CBC') {
    if (!iv) {
      throw new Error('IV is required for CBC mode');
    }
    ivBuffer = parseHexBuffer(iv, 'IV');
    if (ivBuffer.length !== 8) {
      throw new Error(`IV must be 8 bytes (16 hex characters), got ${ivBuffer.length} bytes`);
    }
  }

  return {
    keyBuffer,
    ivBuffer,
    cipherAlgo
  };
};

const run3DES = (operation, text, key, mode, iv = null) => {
  const { keyBuffer, ivBuffer, cipherAlgo } = get3DESContext(key, mode, iv);
  const isEncrypt = operation === 'encrypt';

  const cryptoTransform = isEncrypt
    ? (mode === 'ECB'
      ? crypto.createCipheriv(cipherAlgo, keyBuffer, '')
      : crypto.createCipheriv(cipherAlgo, keyBuffer, ivBuffer))
    : (mode === 'ECB'
      ? crypto.createDecipheriv(cipherAlgo, keyBuffer, '')
      : crypto.createDecipheriv(cipherAlgo, keyBuffer, ivBuffer));

  const inputEncoding = isEncrypt ? 'utf8' : 'hex';
  const outputEncoding = isEncrypt ? 'hex' : 'utf8';

  let transformed = cryptoTransform.update(text, inputEncoding, outputEncoding);
  transformed += cryptoTransform.final(outputEncoding);

  return transformed;
};

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
    return run3DES('encrypt', plaintext, key, mode, iv);
  } catch (error) {
    throw new Error(`Encryption error: ${error.message}`);
  }
};

// Hàm giải mã 3DES
const decrypt = (ciphertext, key, mode, iv = null) => {
  try {
    return run3DES('decrypt', ciphertext, key, mode, iv);
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
