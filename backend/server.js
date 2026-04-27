// ============================================
// Cryptography Toolkit - Backend Server
// ============================================
// File này là entry point chính của backend
// Khởi tạo Express server và import tất cả routes

// Nhập module express - web framework
const express = require('express');

// Nhập module cors - cho phép requests từ frontend
const cors = require('cors');

// Nhập module body-parser - parse JSON request body
const bodyParser = require('body-parser');

// Nhập dotenv - tải biến môi trường từ .env file
require('dotenv').config();

// Nhập RSA routes từ src/routes
const rsaRoutes = require('./src/routes/rsaRoutes');

// ============================================
// Khởi tạo Express Application
// ============================================
// Tạo instance express app
const app = express();

// Lấy PORT từ biến môi trường hoặc sử dụng 5000 nếu không có
const PORT = process.env.PORT || 5000;

// ============================================
// Cấu hình Middleware
// ============================================
// Middleware CORS - cho phép requests từ frontend
// Cấu hình cho phép tất cả origins (có thể hạn chế lại khi deploy)
app.use(cors());

// Middleware body-parser - parse JSON request body
// limit: Giới hạn kích thước payload 10MB
app.use(bodyParser.json({ limit: '10mb' }));

// Middleware body-parser - parse URL-encoded request body
// limit: Giới hạn kích thước payload 10MB
// extended: true cho phép parse mảng và object
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// ============================================
// Health Check Route
// ============================================
// Endpoint để kiểm tra server có chạy không
app.get('/api/health', (req, res) => {
  // Trả về response thành công
  res.status(200).json({
    // status: Trạng thái của server
    status: 'ok',
    // message: Thông điệp xác nhận
    message: 'Server is running',
    // timestamp: Thời gian hiện tại
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// Routes
// ============================================
// Sử dụng RSA routes tại path /api/crypto/rsa
// Ví dụ: POST /api/crypto/rsa/generate
app.use('/api/crypto/rsa', rsaRoutes);

// ============================================
// Error Handling Middleware
// ============================================
// Middleware xử lý 404 - Route không tìm thấy
// Được gọi khi không có route nào khớp với request
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

// ============================================
// Khởi động Server
// ============================================
// Lắng nghe trên PORT đã định nghĩa
app.listen(PORT, () => {
  // In thông điệp xác nhận server đã khởi động
  console.log(`\n🚀 Server đang chạy trên http://localhost:${PORT}`);
  console.log(`📍 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Routes:`);
  console.log(`   - POST   /api/crypto/rsa/generate  - Tạo cặp khóa RSA`);
  console.log(`   - POST   /api/crypto/rsa/encrypt   - Mã hóa dữ liệu`);
  console.log(`   - POST   /api/crypto/rsa/decrypt   - Giải mã dữ liệu`);
  console.log(`   - POST   /api/crypto/rsa/sign      - Tạo chữ ký số`);
  console.log(`   - POST   /api/crypto/rsa/verify    - Xác minh chữ ký`);
  console.log(`   - GET    /api/crypto/rsa/public-key - Lấy khóa công khai\n`);
});

// ============================================
// Xuất Module
// ============================================
// Xuất app để sử dụng trong testing (nếu cần)
module.exports = app;
