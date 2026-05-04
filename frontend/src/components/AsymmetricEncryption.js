import React, { useState } from 'react';
import './AsymmetricEncryption.css';

function AsymmetricEncryption({ onBack }) {
  const [operation, setOperation] = useState('generate');
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');
  const [copiedResult, setCopiedResult] = useState(false);

  const [keySize, setKeySize] = useState(2048);
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [generateError, setGenerateError] = useState('');

  const [encryptPlaintext, setEncryptPlaintext] = useState('');
  const [encryptKeyInput, setEncryptKeyInput] = useState('');
  const [encryptResult, setEncryptResult] = useState('');
  const [encryptError, setEncryptError] = useState('');
  const [encryptionType, setEncryptionType] = useState('public');

  const [decryptCiphertext, setDecryptCiphertext] = useState('');
  const [decryptKeyInput, setDecryptKeyInput] = useState('');
  const [decryptResult, setDecryptResult] = useState('');
  const [decryptError, setDecryptError] = useState('');
  const [decryptionType, setDecryptionType] = useState('private');

  // Xử lý Generate
  const handleGenerateKeyPair = async () => {
    setLoading(true);
    setGenerateError('');

    try {
      const response = await fetch('http://localhost:5000/api/crypto/rsa/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keySize })
      });

      const data = await response.json();
      if (data.publicKey && data.privateKey) {
        setPublicKey(data.publicKey);
        setPrivateKey(data.privateKey);
      } else {
        setGenerateError('Error generating key pair');
      }
    } catch (err) {
      setGenerateError('Error generating key pair: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Encrypt
  const handleEncrypt = async () => {
    if (!encryptPlaintext) {
      setEncryptError('Please enter plaintext');
      return;
    }
    if (!encryptKeyInput) {
      setEncryptError('Please provide a key');
      return;
    }

    setLoading(true);
    setEncryptError('');

    try {
      const payload = { plaintext: encryptPlaintext };
      if (encryptionType === 'public') {
        payload.publicKey = encryptKeyInput;
      } else {
        payload.privateKey = encryptKeyInput;
      }

      const response = await fetch('http://localhost:5000/api/crypto/rsa/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!data.success) {
        setEncryptError('Lỗi mã hóa: ' + (data.message || data.error || JSON.stringify(data)));
      } else {
        setEncryptResult(data.data.ciphertext);
      }
    } catch (err) {
      setEncryptError('Error encrypting: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Decrypt
  const handleDecrypt = async () => {
    if (!decryptCiphertext) {
      setDecryptError('Please enter ciphertext');
      return;
    }
    if (!decryptKeyInput) {
      setDecryptError('Please provide a key');
      return;
    }

    setLoading(true);
    setDecryptError('');

    try {
      const body = { ciphertext: decryptCiphertext };
      if (decryptionType === 'private') {
        body.privateKey = decryptKeyInput;
      } else {
        body.publicKey = decryptKeyInput;
      }

      const response = await fetch('http://localhost:5000/api/crypto/rsa/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!data.success) {
        setDecryptError(data.message || data.error || JSON.stringify(data));
      } else {
        setDecryptResult(data.data.decrypted);
      }
    } catch (err) {
      setDecryptError('Error decrypting: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResult = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedResult(true);
    setCopiedKey('');
    setTimeout(() => setCopiedResult(false), 2000);
  };

  const handleCopyKey = (keyType, key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(keyType);
    setCopiedResult(false);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  // Reset tuỳ theo tab hiện tại
  const handleReset = () => {
    if (operation === 'encrypt') {
      setEncryptPlaintext('');
      setEncryptKeyInput('');
      setEncryptResult('');
      setEncryptError('');
    } else if (operation === 'decrypt') {
      setDecryptCiphertext('');
      setDecryptKeyInput('');
      setDecryptResult('');
      setDecryptError('');
    }
    setCopiedResult(false);
  };

  return (
    <div className="asymmetric-encryption">
      <div className="crypto-container">
        <div className="crypto-header">
          <button className="back-button" onClick={onBack}>
            ← Trở về
          </button>
          <h2>Mã hóa bất đối xứng RSA</h2>
        </div>

        <div className="tabs">
          <button
            className={`tab ${operation === 'generate' ? 'active' : ''}`}
            onClick={() => setOperation('generate')}
          >
            Generate Keys
          </button>
          <button
            className={`tab ${operation === 'encrypt' ? 'active' : ''}`}
            onClick={() => setOperation('encrypt')}
          >
            Encrypt
          </button>
          <button
            className={`tab ${operation === 'decrypt' ? 'active' : ''}`}
            onClick={() => setOperation('decrypt')}
          >
            Decrypt
          </button>
        </div>

        {/* TAB GENERATE */}
        {operation === 'generate' && (
          <div className="tab-content">
            <div className="control-group">
              <label>Key Size (bits)</label>
              <select value={keySize} onChange={(e) => setKeySize(Number(e.target.value))}>
                <option value={2048}>2048</option>
              </select>
            </div>

            <button
              className="generate-button"
              onClick={handleGenerateKeyPair}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Key Pair'}
            </button>

            {generateError && <div className="error-message">{generateError}</div>}

            {publicKey && privateKey && (
              <div className="keys-display">
                <div className="key-box">
                  <div className="key-header">
                    <h3>Public Key</h3>
                    <button className="copy-btn" onClick={() => handleCopyKey('public', publicKey)}>
                      {copiedKey === 'public' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <textarea readOnly value={publicKey} rows="14" />
                </div>

                <div className="key-box">
                  <div className="key-header">
                    <h3>Private Key</h3>
                    <button className="copy-btn" onClick={() => handleCopyKey('private', privateKey)}>
                      {copiedKey === 'private' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <textarea readOnly value={privateKey} rows="14" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB ENCRYPT */}
        {operation === 'encrypt' && (
          <div className="tab-content">
            <div className="control-group">
              <label>Encrypt with Key Type</label>
              <div className="key-type-buttons">
                <button
                  className={`type-btn ${encryptionType === 'public' ? 'active' : ''}`}
                  onClick={() => setEncryptionType('public')}
                >
                  Public Key
                </button>
                <button
                  className={`type-btn ${encryptionType === 'private' ? 'active' : ''}`}
                  onClick={() => setEncryptionType('private')}
                >
                  Private Key
                </button>
              </div>
            </div>

            <div className="input-grid">
              <div className="input-group">
                <label>Plaintext</label>
                <textarea
                  value={encryptPlaintext}
                  onChange={(e) => setEncryptPlaintext(e.target.value)}
                  placeholder="Enter text to encrypt"
                  rows="10"
                />
              </div>

              <div className="input-group">
                <label>{encryptionType === 'public' ? 'Public Key' : 'Private Key'}</label>
                <textarea
                  value={encryptKeyInput}
                  onChange={(e) => setEncryptKeyInput(e.target.value)}
                  placeholder="Paste your key here"
                  rows="10"
                />
              </div>
            </div>

            <p className="hint">
              Mặc định: dùng Public Key để mã hóa và Private Key để giải mã. Tùy chọn "Private Key" ở đây chỉ dùng khi bạn muốn thử kiểu mã hóa ngược như chữ ký số.
            </p>

            {encryptError && <div className="error-message">{encryptError}</div>}

            {encryptResult && (
              <div className="result-box">
                <div className="result-header">
                  <h3>Encrypted Result:</h3>
                  <button className="copy-button" onClick={() => handleCopyResult(encryptResult)}>
                    {copiedResult ? '✓ Copied!' : 'Copy Result'}
                  </button>
                </div>
                <div className="result-content">
                  <textarea readOnly value={encryptResult} rows="12" className="result-textarea" />
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button
                className="execute-button"
                onClick={handleEncrypt}
                disabled={loading}
              >
                {loading ? 'Encrypting...' : 'Encrypt'}
              </button>
              <button className="reset-button" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        )}

        {/* TAB DECRYPT */}
        {operation === 'decrypt' && (
          <div className="tab-content">
            <div className="control-group">
              <label>Decrypt with Key Type</label>
              <div className="key-type-buttons">
                <button
                  className={`type-btn ${decryptionType === 'private' ? 'active' : ''}`}
                  onClick={() => setDecryptionType('private')}
                >
                  Private Key
                </button>
                <button
                  className={`type-btn ${decryptionType === 'public' ? 'active' : ''}`}
                  onClick={() => setDecryptionType('public')}
                >
                  Public Key
                </button>
              </div>
              <p className="hint">
                Nếu dữ liệu được mã hóa bằng Public Key thì giải mã bằng Private Key. Nếu mã hóa bằng Private Key thì giải mã bằng Public Key.
              </p>
            </div>

            <div className="input-grid">
              <div className="input-group">
                <label>Ciphertext</label>
                <textarea
                  value={decryptCiphertext}
                  onChange={(e) => setDecryptCiphertext(e.target.value)}
                  placeholder="Enter encrypted text"
                  rows="10"
                />
              </div>

              <div className="input-group">
                <label>{decryptionType === 'private' ? 'Private Key' : 'Public Key'}</label>
                <textarea
                  value={decryptKeyInput}
                  onChange={(e) => setDecryptKeyInput(e.target.value)}
                  placeholder={`Paste your ${decryptionType === 'private' ? 'private' : 'public'} key here`}
                  rows="10"
                />
              </div>
            </div>

            {decryptError && <div className="error-message">{decryptError}</div>}

            {decryptResult && (
              <div className="result-box">
                <div className="result-header">
                  <h3>Decrypted Result:</h3>
                  <button className="copy-button" onClick={() => handleCopyResult(decryptResult)}>
                    {copiedResult ? '✓ Copied!' : 'Copy Result'}
                  </button>
                </div>
                <div className="result-content">
                  <textarea readOnly value={decryptResult} rows="12" className="result-textarea" />
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button
                className="execute-button"
                onClick={handleDecrypt}
                disabled={loading}
              >
                {loading ? 'Decrypting...' : 'Decrypt'}
              </button>
              <button className="reset-button" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AsymmetricEncryption;