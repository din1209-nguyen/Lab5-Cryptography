const express = require('express');
const rsaRoutes = require('./src/routes/rsaRoutes');
const symmetricRoutes = require('./src/routes/symmetricRoutes');

// Nhập module cors - cho phép requests từ frontend
const cors = require('cors');

// Nhập module body-parser - parse JSON request body
const bodyParser = require('body-parser');

// Nhập dotenv - tải biến môi trường từ .env file
require('dotenv').config();


const app = express();

// Lấy PORT từ biến môi trường hoặc sử dụng 5000 nếu không có
const PORT = process.env.PORT || 5000;

// Middleware CORS - cho phép requests từ frontend
app.use(cors());

// Middleware body-parser - parse JSON request body
// limit: Giới hạn kích thước payload 10MB
app.use(bodyParser.json({ limit: '10mb' }));

// Middleware body-parser - parse URL-encoded request body
// limit: Giới hạn kích thước payload 10MB
// extended: true cho phép parse mảng và object
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


// Sử dụng RSA routes tại path /api/crypto/rsa
app.use('/api/crypto/rsa', rsaRoutes);

// Sử dụng Symmetric (DES, 3DES, AES) routes tại path /api/crypto/symmetric
app.use('/api/crypto/symmetric', symmetricRoutes);

// Middleware xử lý 404 - Route không tìm thấy
app.use((req, res) => {
  // Trả về response lỗi với HTTP status 404
  res.status(404).json({
    // success: Boolean để chỉ request thất bại
    success: false,
    // message: Thông điệp lỗi
    message: 'Route không tìm thấy',
    // path: Đường dẫn được yêu cầu
    path: req.path,
  });
});

// Lắng nghe trên PORT đã định nghĩa
app.listen(PORT, () => {
  console.log(`\n🚀 Server đang chạy trên http://localhost:${PORT}`);
});

module.exports = app;
