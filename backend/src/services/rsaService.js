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


  // Mã hóa plaintext sử dụng RSA
  encrypt(plaintext, key = null, keyType = 'public') {
    try {
      // Xác định khóa sẽ sử dụng: nếu truyền key thì dùng key, ngược lại dùng publicKey/privateKey đã lưu
      const useKey = key || (keyType === 'public' ? this.publicKey : this.privateKey);

      if (!useKey) {
        throw new Error('Không có khóa phù hợp. Vui lòng tạo hoặc cung cấp khóa.');
      }

      if (typeof plaintext !== 'string') {
        throw new Error('Văn bản cần mã hóa phải là chuỗi (string).');
      }

      const buffer = Buffer.from(plaintext, 'utf8');

      // Chọn hàm mã hóa dựa trên keyType
      let encryptedBuffer;
      if (keyType === 'public') {
        // Mã hóa bằng khóa công khai
        encryptedBuffer = crypto.publicEncrypt(
          { key: useKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
          buffer
        );
      } else if (keyType === 'private') {
        // Mã hóa bằng khóa riêng tư (privateEncrypt)
        encryptedBuffer = crypto.privateEncrypt(
          { key: useKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
          buffer
        );
      } else {
        throw new Error('keyType không hợp lệ. Sử dụng "public" hoặc "private".');
      }

      return encryptedBuffer.toString('base64');
    } catch (error) {
      // Nếu có lỗi, ném ra lỗi chi tiết
      throw new Error(`Lỗi mã hóa: ${error.message}`);
    }
  }


  // Giải mã dữ liệu mã hóa sử dụng RSA
  decrypt(encryptedText, key = null, keyType = 'private') {
    try {
      const useKey = key || (keyType === 'private' ? this.privateKey : this.publicKey);

      if (!useKey) {
        throw new Error('Không có khóa phù hợp để giải mã.');
      }

      if (typeof encryptedText !== 'string') {
        throw new Error('Dữ liệu mã hóa phải là chuỗi (string).');
      }

      const buffer = Buffer.from(encryptedText, 'base64');

      let decryptedBuffer;
      if (keyType === 'private') {
        // Giải mã bằng khóa riêng tư
        decryptedBuffer = crypto.privateDecrypt(
          { key: useKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
          buffer
        );
      } else if (keyType === 'public') {
        // Giải mã bằng khóa công khai (publicDecrypt)
        decryptedBuffer = crypto.publicDecrypt(
          { key: useKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
          buffer
        );
      } else {
        throw new Error('keyType không hợp lệ. Sử dụng "private" hoặc "public".');
      }

      return decryptedBuffer.toString('utf8');
    } catch (error) {
      // Nếu có lỗi, ném ra lỗi chi tiết
      throw new Error(`Lỗi giải mã: ${error.message}`);
    }
  }

  // Tạo chữ ký số (digital signature) cho dữ liệu
  sign(data, privateKey = null) {
    try {
      // Xác định khóa riêng tư sẽ sử dụng
      // Ưu tiên khóa được truyền vào, nếu không có thì dùng this.privateKey
      const key = privateKey || this.privateKey;

      // Kiểm tra xem có khóa riêng tư không
      if (!key) {
        // Ném lỗi nếu không có khóa riêng tư
        throw new Error('Không có khóa riêng tư để ký.');
      }

      // Kiểm tra data có phải là string không
      if (typeof data !== 'string') {
        // Ném lỗi nếu data không phải string
        throw new Error('Dữ liệu ký phải là chuỗi (string).');
      }

      // Tạo một object Sign sử dụng SHA-256 hash algorithm
      // 'sha256': Thuật toán hash mạnh, phổ biến, và an toàn
      const signer = crypto.createSign('sha256');

      // Cập nhật signer với dữ liệu cần ký
      // 'utf8': Encoding của string dữ liệu
      signer.update(data, 'utf8');

      // Tạo chữ ký sử dụng khóa riêng tư
      // 'base64': Format đầu ra (dễ truyền tải và lưu trữ)
      const signature = signer.sign(key, 'base64');

      return signature;
    } 
    catch (error) {
      throw new Error(`Lỗi tạo chữ ký: ${error.message}`);
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
