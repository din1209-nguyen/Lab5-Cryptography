const tripleDesService = require('../services/tripleDesService');

// Hàm generate random key
const generateKey = (req, res) => {
  try {
    const key = tripleDesService.generateRandomKey();
    
    res.json({
      success: true,
      key: key,
      keyLength: 24,
      message: '3DES key generated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating key: ' + error.message
    });
  }
};

// Hàm generate random IV
const generateIV = (req, res) => {
  try {
    const iv = tripleDesService.generateRandomIV();
    
    res.json({
      success: true,
      iv: iv,
      ivLength: 8,
      message: 'IV generated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating IV: ' + error.message
    });
  }
};

// Hàm mã hóa 3DES
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

    let ciphertext;

    if (mode === 'ECB') {
      ciphertext = tripleDesService.encryptECB(plaintext, key);
    } else if (mode === 'CBC') {
      ciphertext = tripleDesService.encryptCBC(plaintext, key, iv);
    }

    res.json({
      success: true,
      ciphertext: ciphertext,
      message: `3DES encryption with ${mode} mode successful`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Encryption error: ' + error.message
    });
  }
};

// Hàm giải mã 3DES
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

    let plaintext;

    if (mode === 'ECB') {
      plaintext = tripleDesService.decryptECB(ciphertext, key);
    } else if (mode === 'CBC') {
      plaintext = tripleDesService.decryptCBC(ciphertext, key, iv);
    }

    res.json({
      success: true,
      plaintext: plaintext,
      message: `3DES decryption with ${mode} mode successful`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Decryption error: ' + error.message
    });
  }
};

module.exports = {
  generateKey,
  generateIV,
  encrypt,
  decrypt
};
