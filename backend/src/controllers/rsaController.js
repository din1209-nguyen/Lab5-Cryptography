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

  // Giải mã dữ liệu sử dụng RSA
  decrypt: (req, res) => {
    try {
      // Lấy dữ liệu mã hóa và khóa từ request body
      const { ciphertext, privateKey, publicKey } = req.body;

      // Kiểm tra dữ liệu đầu vào bắt buộc
      if (!ciphertext) {
        return res.status(400).json({
          success: false,
          message: 'ciphertext là bắt buộc',
        });
      }

      if (!privateKey && !publicKey) {
        return res.status(400).json({
          success: false,
          message: 'Phải cung cấp privateKey hoặc publicKey để giải mã',
        });
      }

      const key = privateKey || publicKey;
      const keyType = privateKey ? 'private' : 'public';

      try {
        if (privateKey) {
          rsaService.setPrivateKey(privateKey);
        }
        if (publicKey) {
          rsaService.setPublicKey(publicKey);
        }
        // Thực hiện giải mã thông qua service
        const decrypted = rsaService.decrypt(ciphertext, key, keyType);
        res.status(200).json({
          success: true,
          data: {
            decrypted: decrypted,
          },
          message: 'Giải mã dữ liệu thành công',
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    } 
    catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Tạo chữ ký số (Digital Signature) cho dữ liệu
  sign: (req, res) => {
    try {
      // Lấy dữ liệu cần ký và khóa riêng tư từ body
      const { data, privateKey } = req.body;

      if (!data) {
        return res.status(400).json({
          success: false,
          message: 'data là bắt buộc',
        });
      }

      // Cập nhật khóa riêng tư nếu có
      if (privateKey) {
        rsaService.setPrivateKey(privateKey);
      }

      // Gọi hàm sign sử dụng thuật toán SHA-256
      const signature = rsaService.sign(data, privateKey);

      res.status(200).json({
        success: true,
        data: {
          signature: signature,
        },
        message: 'Tạo chữ ký thành công',
      });
    } 
    catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Xác minh tính hợp lệ của chữ ký số
  verify: (req, res) => {
    try {
      // Lấy dữ liệu gốc, chữ ký và khóa công khai để đối chiếu
      const { data, signature, publicKey } = req.body;

      if (!data) {
        return res.status(400).json({
          success: false,
          message: 'data là bắt buộc',
        });
      }

      if (!signature) {
        return res.status(400).json({
          success: false,
          message: 'signature là bắt buộc',
        });
      }

      // Thiết lập khóa công khai cho service nếu được cung cấp
      if (publicKey) {
        rsaService.setPublicKey(publicKey);
      }

      // Kiểm tra tính toàn vẹn của dữ liệu qua chữ ký
      const isValid = rsaService.verify(data, signature, publicKey);

      // Trả về kết quả kiểm tra (true/false)
      res.status(200).json({ isValid });
    } 
    catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy khóa công khai hiện tại đang lưu trong service
  getPublicKey: (req, res) => {
    try {
      const publicKey = rsaService.getPublicKey();

      // Kiểm tra nếu chưa khởi tạo cặp khóa nào
      if (!publicKey) {
        return res.status(404).json({ 
          error: 'Chưa có khóa công khai. Vui lòng tạo khóa trước.' 
        });
      }

      res.status(200).json({ publicKey });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};


module.exports = RSAController;