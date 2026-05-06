const symmetricService = require('../services/symmetricService');
const SUPPORTED_ALGORITHMS = ['DES', '3DES', 'AES'];
const SUPPORTED_MODES = ['ECB', 'CBC'];

const normalizeAlgorithm = (algorithm) => {
  if (!algorithm) return '3DES';
  return String(algorithm).toUpperCase();
};

const normalizeMode = (mode) => String(mode || '').toUpperCase();

const validateAlgorithm = (algorithm) => {
  const normalized = normalizeAlgorithm(algorithm);
  if (!SUPPORTED_ALGORITHMS.includes(normalized)) {
    throw new Error('Algorithm must be DES, 3DES, or AES');
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
    const selectedAlgorithm = validateAlgorithm(algorithm);
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
      ? symmetricService.encrypt(rawInput, key, mode, iv, selectedAlgorithm)
      : symmetricService.decrypt(rawInput, key, mode, iv, selectedAlgorithm);

    const operationLabel = operation === 'encrypt' ? 'encryption' : 'decryption';

    res.json({
      success: true,
      [outputField]: result,
      algorithm: selectedAlgorithm,
      mode,
      message: `${selectedAlgorithm} ${operationLabel} with ${mode} mode successful`
    });
  } catch (error) {
    sendClientError(res, error.message);
  }
};

// Hàm generate random key
const generateKey = (req, res) => {
  try {
    const algorithm = validateAlgorithm(req.body?.algorithm);
    const key = symmetricService.generateRandomKey(algorithm);

    res.json({
      success: true,
      key: key,
      algorithm,
      message: `${algorithm} key generated successfully`
    });
  } catch (error) {
    sendClientError(res, error.message);
  }
};

// Hàm generate random IV
const generateIV = (req, res) => {
  try {
    const algorithm = validateAlgorithm(req.body?.algorithm);
    const iv = symmetricService.generateRandomIV(algorithm);

    res.json({
      success: true,
      iv: iv,
      algorithm,
      message: `IV for ${algorithm} generated successfully`
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
