const crypto = require('crypto');

class RSAService {
  
  constructor() {
    // Độ dài khóa RSA - 2048 bits (tiêu chuẩn bảo mật)
    this.keySize = 2048;
    
    // Lưu trữ khóa công khai
    this.publicKey = null;
    
    // Lưu trữ khóa riêng tư
    this.privateKey = null;
  }

  // Tạo cặp khóa RSA công khai và riêng tư
  generateKeyPair() {
    try {
      // Sử dụng crypto.generateKeyPairSync để tạo cặp khóa RSA một cách đồng bộ
      // - 'rsa': Loại thuật toán sử dụng là RSA
      // - modulusLength: Độ dài của RSA modulus (2048 bits)
      // - publicKeyEncoding: Cấu hình format khóa công khai
      // - privateKeyEncoding: Cấu hình format khóa riêng tư
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        // Độ dài module RSA: 2048 bits là tiêu chuẩn bảo mật hiện đại
        modulusLength: this.keySize,
        
        // Cấu hình khóa công khai
        publicKeyEncoding: {
          // 'spki' = SubjectPublicKeyInfo: định dạng tiêu chuẩn cho khóa công khai
          type: 'spki',
          // 'pem' = Privacy Enhanced Mail: định dạng text dễ đọc và truyền tải
          format: 'pem',
        },
        
        // Cấu hình khóa riêng tư
        privateKeyEncoding: {
          // 'pkcs8' = PKCS#8: định dạng tiêu chuẩn cho khóa riêng tư
          type: 'pkcs8',
          // 'pem' = Privacy Enhanced Mail: định dạng text dễ đọc và truyền tải
          format: 'pem',
        },
      });

      // Lưu trữ khóa công khai vào instance variable
      this.publicKey = publicKey;
      
      // Lưu trữ khóa riêng tư vào instance variable
      this.privateKey = privateKey;

      return {
        publicKey: publicKey,
        privateKey: privateKey,
      };
    } 
    catch (error) {
      throw new Error(`Lỗi tạo khóa RSA: ${error.message}`);
    }
  }


  setPublicKey(publicKeyString) {
    if (!publicKeyString) {
      throw new Error('Khóa công khai không được để trống.');
    }
    this.publicKey = publicKeyString;
  }

  setPrivateKey(privateKeyString) {
    if (!privateKeyString) {
      throw new Error('Khóa riêng tư không được để trống.');
    }
    this.privateKey = privateKeyString;
  }

  getPublicKey() {
    return this.publicKey;
  }

  getPrivateKey() {
    return this.privateKey;
  }
}

module.exports = RSAService;
