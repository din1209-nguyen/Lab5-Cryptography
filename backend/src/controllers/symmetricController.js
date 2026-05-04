const symmetricService = require('../services/symmetricService');
const SUPPORTED_ALGORITHMS = ['DES', '3DES', 'AES'];
const SUPPORTED_MODES = ['ECB', 'CBC'];

const normalizeAlgorithm = (algorithm) => {
  if (!algorithm) return '3DES';
  return String(algorithm).toUpperCase();
};

const normalizeMode = (mode) => String(mode || '').toUpperCase();

const ensure3DES = (algorithm) => {
  const normalized = normalizeAlgorithm(algorithm);
  if (!SUPPORTED_ALGORITHMS.includes(normalized)) {
    throw new Error('Algorithm must be DES, 3DES, or AES');
  }
  if (normalized !== '3DES') {
    throw new Error(`Algorithm ${normalized} is not implemented yet. Please use 3DES.`);
  }
  return normalized;
};

const validateModeAndIV = (mode, iv) => {
  if (!SUPPORTED_MODES.includes(mode)) {
    throw new Error('Mode must be ECB or CBC');
  }
  if (mode === 'CBC' && !iv) {
    throw new Error('IV is required for CBC mode');
  }
};

const sendClientError = (res, message) => {
  res.status(400).json({
    success: false,
    message
  });
};

const processCrypto = (req, res, operation) => {
  try {
    const { key, iv, algorithm } = req.body;
    const selectedAlgorithm = ensure3DES(algorithm);
    const mode = normalizeMode(req.body.mode);
    const inputField = operation === 'encrypt' ? 'plaintext' : 'ciphertext';
    const outputField = operation === 'encrypt' ? 'ciphertext' : 'plaintext';
    const rawInput = req.body[inputField];

    if (!rawInput) {
      return sendClientError(res, `${inputField.charAt(0).toUpperCase()}${inputField.slice(1)} is required`);
    }

    if (!key) {
      return sendClientError(res, 'Key is required');
    }

    validateModeAndIV(mode, iv);

    const result = operation === 'encrypt'
      ? symmetricService.encrypt(rawInput, key, mode, iv)
      : symmetricService.decrypt(rawInput, key, mode, iv);

    const operationLabel = operation === 'encrypt' ? 'encryption' : 'decryption';

    res.json({
      success: true,
      [outputField]: result,
      algorithm: selectedAlgorithm,
      mode,
      message: `3DES ${operationLabel} with ${mode} mode successful`
    });
  } catch (error) {
    sendClientError(res, error.message);
  }
};

// Hàm generate random key
const generateKey = (req, res) => {
  try {
    const algorithm = ensure3DES(req.body?.algorithm);
    const key = symmetricService.generateRandomKey();

    res.json({
      success: true,
      key: key,
      algorithm,
      message: '3DES key generated successfully'
    });
  } catch (error) {
    sendClientError(res, error.message);
  }
};

// Hàm generate random IV
const generateIV = (req, res) => {
  try {
    const algorithm = ensure3DES(req.body?.algorithm);
    const iv = symmetricService.generateRandomIV();

    res.json({
      success: true,
      iv: iv,
      algorithm,
      message: 'IV for 3DES generated successfully'
    });
  } catch (error) {
    sendClientError(res, error.message);
  }
};

// Hàm mã hóa
const encrypt = (req, res) => {
  processCrypto(req, res, 'encrypt');
};

// Hàm giải mã
const decrypt = (req, res) => {
  processCrypto(req, res, 'decrypt');
};

module.exports = {
  generateKey,
  generateIV,
  encrypt,
  decrypt
};
