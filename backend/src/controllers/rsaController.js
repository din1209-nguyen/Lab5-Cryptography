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

  
};


module.exports = RSAController;