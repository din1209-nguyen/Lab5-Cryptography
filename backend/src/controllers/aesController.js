// Gọi file service vừa tạo vào đây
const aesService = require('../services/aesService');

const encryptAES = (req, res) => {
    try {
        const { plaintext, secretKey } = req.body;
        if (!plaintext || !secretKey) {
            return res.status(400).json({ error: "Vui lòng nhập đủ Plaintext và Secret Key" });
        }
        
        // Nhờ Service mã hóa hộ
        const ciphertext = aesService.encrypt(plaintext, secretKey);
        res.status(200).json({ ciphertext: ciphertext });
    } catch (error) {
        res.status(500).json({ error: "Lỗi hệ thống khi mã hóa AES" });
    }
};

const decryptAES = (req, res) => {
    try {
        const { ciphertext, secretKey } = req.body;
        if (!ciphertext || !secretKey) {
            return res.status(400).json({ error: "Vui lòng nhập đủ Ciphertext và Secret Key" });
        }

        // Nhờ Service giải mã hộ
        const originalText = aesService.decrypt(ciphertext, secretKey);

        if (!originalText) {
            return res.status(400).json({ error: "Sai khóa hoặc dữ liệu đã bị hỏng!" });
        }
        res.status(200).json({ plaintext: originalText });
    } catch (error) {
        res.status(500).json({ error: "Lỗi giải mã AES" });
    }
};

module.exports = { encryptAES, decryptAES };