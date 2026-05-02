import React, { useState } from 'react';
import './SymmetricEncryption.css';

function SymmetricEncryption({ onBack }) {
  const [mode, setMode] = useState('ECB');
  const [operation, setOperation] = useState('encrypt');
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [iv, setIv] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Hàm generate random key
  const handleGenerateKey = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/crypto/symmetric/generate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success && data.key) {
        setSecretKey(data.key);
        setError('');
      } else {
        setError(data.message || 'Error generating key');
      }
    } catch (err) {
      setError('Error generating key: ' + err.message);
    }
  };

  // Hàm generate random IV
  const handleGenerateIV = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/crypto/symmetric/generate-iv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success && data.iv) {
        setIv(data.iv);
        setError('');
      } else {
        setError(data.message || 'Error generating IV');
      }
    } catch (err) {
      setError('Error generating IV: ' + err.message);
    }
  };

  // Hàm thực hiện encryption/decryption
  const handleExecute = async () => {
    if (!secretKey) {
      setError('Please provide or generate a secret key');
      return;
    }

    if (mode === 'CBC' && !iv) {
      setError('Please provide or generate an IV for CBC mode');
      return;
    }

    if (operation === 'encrypt' && !plaintext) {
      setError('Please enter plaintext');
      return;
    }

    if (operation === 'decrypt' && !ciphertext) {
      setError('Please enter ciphertext');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        mode,
        key: secretKey,
        ...(operation === 'encrypt'
          ? { plaintext }
          : { ciphertext })
      };

      // Thêm IV nếu mode là CBC
      if (mode === 'CBC') {
        payload.iv = iv;
      }

      const endpoint = operation === 'encrypt' ? 'encrypt' : 'decrypt';
      const response = await fetch(
        `http://localhost:5000/api/crypto/symmetric/${endpoint}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();
      if (data.success) {
        if (operation === 'encrypt') {
          setResult(data.ciphertext);
          setCiphertext(data.ciphertext);
        } else {
          setResult(data.plaintext);
          setPlaintext(data.plaintext);
        }
      } else {
        setError(data.message || 'Error processing request');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPlaintext('');
    setCiphertext('');
    setSecretKey('');
    setIv('');
    setResult('');
    setError('');
  };

  return (
    <div className="symmetric-encryption">
      <div className="crypto-container">
        <div className="crypto-header">
          <button className="back-button" onClick={onBack}>
            ← Back to Menu
          </button>
          <h2>3DES Encryption (Triple DES)</h2>
        </div>

        <div className="controls-grid">
          <div className="control-group">
            <label>Mode</label>
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                setIv('');
                setResult('');
                setError('');
              }}
              disabled={result !== ''}
            >
              <option value="ECB">ECB (Electronic Codebook)</option>
              <option value="CBC">CBC (Cipher Block Chaining)</option>
            </select>
          </div>

          <div className="control-group">
            <label>Operation</label>
            <div className="operation-buttons">
              <button
                className={`op-button ${operation === 'encrypt' ? 'active' : ''}`}
                onClick={() => {
                  setOperation('encrypt');
                  setResult('');
                  setCiphertext('');
                }}
              >
                Encrypt
              </button>
              <button
                className={`op-button ${operation === 'decrypt' ? 'active' : ''}`}
                onClick={() => {
                  setOperation('decrypt');
                  setResult('');
                  setPlaintext('');
                }}
              >
                Decrypt
              </button>
            </div>
          </div>
        </div>

        <div className="input-grid">
          <div className="input-group">
            <label>Secret Key (Hex) - 24 bytes (48 hex characters)</label>
              <textarea
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter your 3DES key in hexadecimal format (48 hex characters)"
                rows="4"
              />
            <button className="gen-button" onClick={handleGenerateKey}>
              Generate Random Key
            </button>
          </div>

          {mode === 'CBC' && (
            <div className="input-group">
                <label>IV (Hex) - 8 bytes (16 hex characters)</label>
              <textarea
                value={iv}
                onChange={(e) => setIv(e.target.value)}
                  placeholder="Initialization Vector in hexadecimal format (16 hex characters)"
                rows="4"
              />
              <button className="gen-button" onClick={handleGenerateIV}>
                Generate Random IV
              </button>
            </div>
          )}

          <div className="input-group">
            <label>{operation === 'encrypt' ? 'Plaintext' : 'Ciphertext'}</label>
            <textarea
              value={operation === 'encrypt' ? plaintext : ciphertext}
              onChange={(e) =>
                operation === 'encrypt'
                  ? setPlaintext(e.target.value)
                  : setCiphertext(e.target.value)
              }
              placeholder={`Enter ${
                operation === 'encrypt' ? 'plaintext' : 'ciphertext'
              }`}
              rows="4"
            />
          </div>
        </div>

        <div className="info-box">
            <h4>ℹ️ 3DES Information:</h4>
          <ul>
              <li><strong>Algorithm:</strong> Triple DES (3DES)</li>
              <li><strong>Key Size:</strong> 24 bytes (192 bits)</li>
              <li><strong>Block Size:</strong> 8 bytes (64 bits)</li>
              <li><strong>IV Size:</strong> 8 bytes (64 bits)</li>
            <li><strong>ECB Mode:</strong> Electronic Codebook (no IV needed)</li>
            <li><strong>CBC Mode:</strong> Cipher Block Chaining (IV required)</li>
          </ul>
        </div>

        {error && <div className="error-message">{error}</div>}

        {result && (
          <div className="result-box">
            <h3>Result:</h3>
            <div className="result-content">
              <p>{result}</p>
              <button className="copy-button" onClick={handleCopyResult}>
                {copied ? '✓ Copied!' : 'Copy Result'}
              </button>
            </div>
          </div>
        )}

        <div className="action-buttons">
          <button
            className="execute-button"
            onClick={handleExecute}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Execute'}
          </button>
          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default SymmetricEncryption;
