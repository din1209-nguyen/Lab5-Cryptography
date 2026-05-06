import React, { useState } from 'react';
import axios from 'axios';

const DesToolkit = () => {
    const [plaintext, setPlaintext] = useState('');
    const [ciphertext, setCiphertext] = useState('');
    const [key, setKey] = useState('');

    const generateKey = () => {
        const randomKey = Math.random().toString(36).substring(2, 10);
        setKey(randomKey);
    };

    const encrypt = async () => {
        const res = await axios.post('http://localhost:5000/api/des/encrypt', { plaintext, key });
        setCiphertext(res.data.ciphertext);
    };

    const decrypt = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/des/decrypt', { ciphertext, key });
            setPlaintext(res.data.plaintext);
        } catch (err) {
            alert("Giải mã thất bại!");
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc' }}>
            <h2>DES Encryption</h2>
            <input placeholder="Key (8 chars)" value={key} onChange={(e) => setKey(e.target.value)} />
            <button onClick={generateKey}>Generate Random Key</button>
            <br /><br />
            <textarea placeholder="Plaintext" value={plaintext} onChange={(e) => setPlaintext(e.target.value)} />
            <button onClick={encrypt}>Encrypt ➡️</button>
            <br />
            <textarea placeholder="Ciphertext" value={ciphertext} onChange={(e) => setCiphertext(e.target.value)} />
            <button onClick={decrypt}>⬅️ Decrypt</button>
        </div>
    );
};

export default DesToolkit;