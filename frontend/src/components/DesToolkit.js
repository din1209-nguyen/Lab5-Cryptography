import React, { useState } from 'react';
import axios from 'axios';

const DesToolkit = () => {
    const [plaintext, setPlaintext] = useState('');
    const [ciphertext, setCiphertext] = useState('');
    const [key, setKey] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const generateKey = () => {
        // Tạo key 8 bytes ngẫu nhiên dưới dạng hex (16 ký tự)
        const randomBytes = Array.from({ length: 8 }, () => 
            Math.floor(Math.random() * 256)
        ).map(b => b.toString(16).padStart(2, '0')).join('');
        setKey(randomBytes);
        setSuccess('✓ Key generated: 8 bytes (16 hex characters)');
        setTimeout(() => setSuccess(''), 3000);
    };

    const encrypt = async () => {
        if (!plaintext.trim() || !key.trim()) {
            setError('❌ Please enter plaintext and key');
            return;
        }
        
        try {
            setError('');
            setSuccess('');
            const res = await axios.post('http://localhost:5000/api/des/encrypt', { plaintext, key });
            setCiphertext(res.data.ciphertext);
            setSuccess('✓ Encryption successful');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Encryption failed';
            setError(`❌ ${errorMsg}`);
            console.error('Encrypt error:', err);
        }
    };

    const decrypt = async () => {
        if (!ciphertext.trim() || !key.trim()) {
            setError('❌ Please enter ciphertext and key');
            return;
        }
        
        try {
            setError('');
            setSuccess('');
            const res = await axios.post('http://localhost:5000/api/des/decrypt', { ciphertext, key });
            setPlaintext(res.data.plaintext);
            setSuccess('✓ Decryption successful');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Decryption failed';
            setError(`❌ ${errorMsg}`);
            console.error('Decrypt error:', err);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>🔐 DES Encryption</h2>
            
            <div style={{ marginBottom: '10px' }}>
                <label>Key (16 hex characters = 8 bytes):</label><br />
                <input 
                    placeholder="e.g., 0102030405060708" 
                    value={key} 
                    onChange={(e) => setKey(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
                <button onClick={generateKey} style={{ marginTop: '5px', padding: '8px 12px' }}>
                    🔑 Generate Random Key
                </button>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
                <label>Plaintext:</label><br />
                <textarea 
                    placeholder="Enter text to encrypt" 
                    value={plaintext} 
                    onChange={(e) => setPlaintext(e.target.value)}
                    style={{ width: '100%', height: '80px', padding: '8px', marginTop: '5px', fontFamily: 'monospace' }}
                />
                <button onClick={encrypt} style={{ marginTop: '5px', padding: '8px 12px' }}>
                    Encrypt ➡️
                </button>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
                <label>Ciphertext:</label><br />
                <textarea 
                    placeholder="Encrypted text will appear here" 
                    value={ciphertext} 
                    onChange={(e) => setCiphertext(e.target.value)}
                    style={{ width: '100%', height: '80px', padding: '8px', marginTop: '5px', fontFamily: 'monospace' }}
                />
                <button onClick={decrypt} style={{ marginTop: '5px', padding: '8px 12px' }}>
                    ⬅️ Decrypt
                </button>
            </div>
            
            {error && <div style={{ color: 'red', marginTop: '10px', padding: '8px', backgroundColor: '#ffe0e0', borderRadius: '4px' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginTop: '10px', padding: '8px', backgroundColor: '#e0ffe0', borderRadius: '4px' }}>{success}</div>}
        </div>
    );
};

export default DesToolkit;