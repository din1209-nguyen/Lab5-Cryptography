const symmetricService = require('../services/symmetricService');

// Hàm generate random key
const generateKey = (req, res) => {
  try {
    const key = symmetricService.generateRandomKey();

    res.json({
      success: true,
      key: key,
      algorithm: '3DES',
      message: '3DES key generated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Hàm generate random IV
const generateIV = (req, res) => {
  try {
    const iv = symmetricService.generateRandomIV();

    res.json({
      success: true,
      iv: iv,
      algorithm: '3DES',
      message: 'IV for 3DES generated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Hàm mã hóa
const encrypt = (req, res) => {
  try {
    const { plaintext, key, mode, iv } = req.body;

    // Kiểm tra input
    if (!plaintext) {
      return res.status(400).json({
        success: false,
        message: 'Plaintext is required'
      });
    }

    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'Key is required'
      });
    }

    if (!mode || (mode !== 'ECB' && mode !== 'CBC')) {
      return res.status(400).json({
        success: false,
        message: 'Mode must be ECB or CBC'
      });
    }

    if (mode === 'CBC' && !iv) {
      return res.status(400).json({
        success: false,
        message: 'IV is required for CBC mode'
      });
    }

    const ciphertext = symmetricService.encrypt(plaintext, key, mode, iv);

    res.json({
      success: true,
      ciphertext: ciphertext,
      algorithm: '3DES',
      mode: mode,
      message: `3DES encryption with ${mode} mode successful`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Hàm giải mã
const decrypt = (req, res) => {
  try {
    const { ciphertext, key, mode, iv } = req.body;

    // Kiểm tra input
    if (!ciphertext) {
      return res.status(400).json({
        success: false,
        message: 'Ciphertext is required'
      });
    }

    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'Key is required'
      });
    }

    if (!mode || (mode !== 'ECB' && mode !== 'CBC')) {
      return res.status(400).json({
        success: false,
        message: 'Mode must be ECB or CBC'
      });
    }

    if (mode === 'CBC' && !iv) {
      return res.status(400).json({
        success: false,
        message: 'IV is required for CBC mode'
      });
    }

    const plaintext = symmetricService.decrypt(ciphertext, key, mode, iv);

    res.json({
      success: true,
      plaintext: plaintext,
      algorithm: '3DES',
      mode: mode,
      message: `3DES decryption with ${mode} mode successful`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  generateKey,
  generateIV,
  encrypt,
  decrypt
};
