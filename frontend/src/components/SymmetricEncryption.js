import React, { useState } from 'react';
import './SymmetricEncryption.css';

function SymmetricEncryption({ onBack }) {
  const [algorithm, setAlgorithm] = useState('AES');
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

  const handleGenerateKey = async () => {
    try {
      const keyLength = algorithm === 'DES' ? 8 : algorithm === '3DES' ? 24 : 32;
      const response = await fetch('http://localhost:5000/api/crypto/generate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm, keyLength })
      });
      const data = await response.json();
      if (data.key) {
        setSecretKey(data.key);
        setError('');
      } else {
        setError('Error generating key');
      }
    } catch (err) {
      setError('Error generating key: ' + err.message);
    }
  };

  const handleGenerateIV = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/crypto/generate-iv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.iv) {
        setIv(data.iv);
      } else {
        setError('Error generating IV');
      }
    } catch (err) {
      setError('Error generating IV: ' + err.message);
    }
  };

  const handleExecute = async () => {
    if (!secretKey) {
      setError('Please provide or generate a secret key');
      return;
    }

    if ((mode === 'CBC' || mode === 'CFB' || mode === 'OFB') && !iv) {
      setError('Please provide or generate an IV for ' + mode + ' mode');
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
        algorithm,
        mode,
        key: secretKey,
        ...(operation === 'encrypt'
          ? { plaintext }
          : { ciphertext })
      };

      if (mode !== 'ECB') {
        payload.iv = iv;
      }

      const response = await fetch(
        `http://localhost:5000/api/crypto/symmetric/${operation}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();
      if (data.error) {
        setError('Error: ' + data.error);
      } else {
        setResult(data.result);
        if (operation === 'encrypt') {
          setCiphertext(data.result);
        } else {
          setPlaintext(data.result);
        }
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
          <h2>Symmetric Encryption</h2>
        </div>

        <div className="controls-grid">
          <div className="control-group">
            <label>Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              disabled={result !== ''}
            >
              <option value="DES">DES</option>
              <option value="3DES">3DES</option>
              <option value="AES">AES</option>
            </select>
          </div>

          {algorithm !== 'DES' && (
            <div className="control-group">
              <label>Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                disabled={result !== ''}
              >
                <option value="ECB">ECB</option>
                <option value="CBC">CBC</option>
                <option value="CFB">CFB</option>
                <option value="OFB">OFB</option>
              </select>
            </div>
          )}

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
            <label>Secret Key (Hex)</label>
            <textarea
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter your secret key in hexadecimal format"
              rows="4"
            />
            <button className="gen-button" onClick={handleGenerateKey}>
              Generate Random Key
            </button>
          </div>

          {(mode === 'CBC' || mode === 'CFB' || mode === 'OFB') && (
            <div className="input-group">
              <label>IV (Hex)</label>
              <textarea
                value={iv}
                onChange={(e) => setIv(e.target.value)}
                placeholder="Initialization Vector in hexadecimal format"
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
