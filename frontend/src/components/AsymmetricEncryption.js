import React, { useState } from 'react';
import './AsymmetricEncryption.css';

function AsymmetricEncryption({ onBack }) {
  const [keySize, setKeySize] = useState(2048);
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [operation, setOperation] = useState('generate');
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [encryptionType, setEncryptionType] = useState('public');

  const handleGenerateKeyPair = async () => {
    setLoading(true);
    setError('');

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
        setResult('');
        setPlaintext('');
        setCiphertext('');
      } else {
        setError('Error generating key pair');
      }
    } catch (err) {
      setError('Error generating key pair: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEncrypt = async () => {
    if (!plaintext) {
      setError('Please enter plaintext');
      return;
    }

    if (!keyInput) {
      setError('Please provide a key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/crypto/rsa/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plaintext, key: keyInput, keyType: encryptionType })
      });

      const data = await response.json();
      if (data.error) {
        setError('Error encrypting: ' + data.error);
      } else {
        setResult(data.result);
        setCiphertext(data.result);
      }
    } catch (err) {
      setError('Error encrypting: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!ciphertext) {
      setError('Please enter ciphertext');
      return;
    }

    if (!keyInput) {
      setError('Please provide a private key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/crypto/rsa/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ciphertext, key: keyInput })
      });

      const data = await response.json();
      if (data.error) {
        setError('Error decrypting: ' + data.error);
      } else {
        setResult(data.result);
        setPlaintext(data.result);
      }
    } catch (err) {
      setError('Error decrypting: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPlaintext('');
    setCiphertext('');
    setKeyInput('');
    setResult('');
    setError('');
  };

  return (
    <div className="asymmetric-encryption">
      <div className="crypto-container">
        <div className="crypto-header">
          <button className="back-button" onClick={onBack}>
            ← Back to Menu
          </button>
          <h2>Asymmetric Encryption (RSA)</h2>
        </div>

        <div className="tabs">
          <button
            className={`tab ${operation === 'generate' ? 'active' : ''}`}
            onClick={() => {
              setOperation('generate');
              setResult('');
              setError('');
            }}
          >
            Generate Keys
          </button>
          <button
            className={`tab ${operation === 'encrypt' ? 'active' : ''}`}
            onClick={() => {
              setOperation('encrypt');
              setResult('');
              setError('');
            }}
          >
            Encrypt
          </button>
          <button
            className={`tab ${operation === 'decrypt' ? 'active' : ''}`}
            onClick={() => {
              setOperation('decrypt');
              setResult('');
              setError('');
            }}
          >
            Decrypt
          </button>
        </div>

        {operation === 'generate' && (
          <div className="tab-content">
            <div className="control-group">
              <label>Key Size (bits)</label>
              <select value={keySize} onChange={(e) => setKeySize(Number(e.target.value))}>
                <option value={1024}>1024</option>
                <option value={2048}>2048</option>
                <option value={4096}>4096</option>
              </select>
            </div>

            <button
              className="generate-button"
              onClick={handleGenerateKeyPair}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Key Pair'}
            </button>

            {publicKey && privateKey && (
              <div className="keys-display">
                <div className="key-box">
                  <div className="key-header">
                    <h3>Public Key</h3>
                    <button className="copy-btn" onClick={() => handleCopyKey(publicKey)}>
                      {copied ? '✓' : 'Copy'}
                    </button>
                  </div>
                  <textarea readOnly value={publicKey} />
                </div>

                <div className="key-box">
                  <div className="key-header">
                    <h3>Private Key</h3>
                    <button className="copy-btn" onClick={() => handleCopyKey(privateKey)}>
                      {copied ? '✓' : 'Copy'}
                    </button>
                  </div>
                  <textarea readOnly value={privateKey} />
                </div>
              </div>
            )}
          </div>
        )}

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
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  placeholder="Enter text to encrypt"
                  rows="4"
                />
              </div>

              <div className="input-group">
                <label>{encryptionType === 'public' ? 'Public Key' : 'Private Key'}</label>
                <textarea
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Paste your key here"
                  rows="4"
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {result && (
              <div className="result-box">
                <h3>Encrypted Result:</h3>
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

        {operation === 'decrypt' && (
          <div className="tab-content">
            <div className="input-grid">
              <div className="input-group">
                <label>Ciphertext</label>
                <textarea
                  value={ciphertext}
                  onChange={(e) => setCiphertext(e.target.value)}
                  placeholder="Enter encrypted text"
                  rows="4"
                />
              </div>

              <div className="input-group">
                <label>Private Key</label>
                <textarea
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Paste your private key here"
                  rows="4"
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {result && (
              <div className="result-box">
                <h3>Decrypted Result:</h3>
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
