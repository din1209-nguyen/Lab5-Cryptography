const RSAService = require('../services/rsaService');
const rsaService = new RSAService();

const RSAController = {
  
  // Xử lý request tạo cặp khóa RSA mới
  generateKeys: (req, res) => {
    try {
      // Gọi service method để tạo cặp khóa (2048 bits)
      const keyPair = rsaService.generateKeyPair();
      
      // Trả về response với publicKey và privateKey ở top-level
      res.status(200).json({
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
      });
    } 
    catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mã hóa dữ liệu sử dụng khóa RSA
  encrypt: (req, res) => {
    try {
      const { plaintext, publicKey, privateKey } = req.body;

      if (!plaintext) {
        return res.status(400).json({ success: false, message: 'plaintext là bắt buộc' });
      }

      // Đề bài yêu cầu User inputs Plaintext and Public Key (or Private Key)
      let encrypted;
      if (publicKey) {
        encrypted = rsaService.encrypt(plaintext, publicKey, 'public');
      } else if (privateKey) {
        encrypted = rsaService.encrypt(plaintext, privateKey, 'private');
      } else {
        return res.status(400).json({ success: false, message: 'Phải cung cấp publicKey hoặc privateKey để mã hóa' });
      }

      res.status(200).json({
        success: true,
        data: { ciphertext: encrypted },
        message: 'Mã hóa dữ liệu thành công',
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  
};


module.exports = RSAController;