import React, { useState } from 'react';
import './HashFunctions.css';

function HashFunctions({ onBack }) {
  const [algorithm, setAlgorithm] = useState('SHA256');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleHash = async () => {
    if (!inputText) {
      setError('Please enter text to hash');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/crypto/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm, input: inputText })
      });

      const data = await response.json();
      if (data.error) {
        setError('Error hashing: ' + data.error);
      } else {
        setResult(data.result);
      }
    } catch (err) {
      setError('Error hashing: ' + err.message);
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
    setInputText('');
    setResult('');
    setError('');
  };

  return (
    <div className="hash-functions">
      <div className="crypto-container">
        <div className="crypto-header">
          <button className="back-button" onClick={onBack}>
            ← Back to Menu
          </button>
          <h2>Hash Functions</h2>
        </div>

        <div className="hash-content">
          <div className="control-group">
            <label>Select Algorithm</label>
            <div className="algorithm-buttons">
              <button
                className={`algo-button ${algorithm === 'MD5' ? 'active' : ''}`}
                onClick={() => {
                  setAlgorithm('MD5');
                  setResult('');
                  setError('');
                }}
              >
                <div className="algo-name">MD5</div>
                <div className="algo-desc">128-bit hash (Deprecated)</div>
              </button>

              <button
                className={`algo-button ${algorithm === 'SHA256' ? 'active' : ''}`}
                onClick={() => {
                  setAlgorithm('SHA256');
                  setResult('');
                  setError('');
                }}
              >
                <div className="algo-name">SHA-256</div>
                <div className="algo-desc">256-bit hash (Recommended)</div>
              </button>
            </div>
          </div>

          <div className="input-section">
            <div className="input-group">
              <label>Text to Hash</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to calculate hash value"
                rows="6"
              />
              <div className="input-info">
                <span>Input length: {inputText.length} characters</span>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {result && (
            <div className="result-box">
              <div className="result-header">
                <h3>{algorithm} Hash Digest:</h3>
                <div className="result-info">
                  Output length: {result.length} characters
                </div>
              </div>
              <div className="result-content">
                <div className="hash-result">
                  <p>{result}</p>
                </div>
                <button className="copy-button" onClick={handleCopyResult}>
                  {copied ? '✓ Copied!' : 'Copy Hash'}
                </button>
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button
              className="execute-button"
              onClick={handleHash}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Calculate Hash'}
            </button>
            <button className="reset-button" onClick={handleReset}>
              Reset
            </button>
          </div>

          {result && (
            <div className="algorithm-info">
              <h4>Algorithm Information:</h4>
              {algorithm === 'MD5' && (
                <div className="info-box warning">
                  <p>
                    <strong>MD5:</strong> Produces a 128-bit (16-byte) hash value. Though widely used,
                    MD5 has been found to be cryptographically weak and collision vulnerabilities
                    have been demonstrated. <strong>NOT recommended for cryptographic purposes.</strong>
                  </p>
                </div>
              )}
              {algorithm === 'SHA256' && (
                <div className="info-box safe">
                  <p>
                    <strong>SHA-256:</strong> Part of the SHA-2 family, produces a 256-bit (32-byte) hash
                    value. It is currently considered secure and is widely used in cryptographic
                    applications. <strong>Recommended for security-critical operations.</strong>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HashFunctions;
