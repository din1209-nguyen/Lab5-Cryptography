const express = require('express');
const rsaController = require('../controllers/rsaController');
const router = express.Router();

//Tạo cặp khóa RSA mới
router.post('/generate', rsaController.generateKeys);

// Mã hóa dữ liệu sử dụng RSA
router.post('/encrypt', rsaController.encrypt);

// Giải mã dữ liệu sử dụng RSA
router.post('/decrypt', rsaController.decrypt);

// Tạo chữ ký số cho dữ liệu
router.post('/sign', rsaController.sign);

// Xác minh chữ ký số cho dữ liệu
router.post('/verify', rsaController.verify);

// Lấy khóa công khai hiện tại
router.get('/public-key', rsaController.getPublicKey);


module.exports = router;
