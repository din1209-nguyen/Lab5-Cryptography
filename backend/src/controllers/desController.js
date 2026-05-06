const desService = require('../services/desService');

const handleEncrypt = (req, res) => {
    const { plaintext, key } = req.body;
    if (!plaintext || !key) return res.status(400).json({ error: 'Missing data' });
    
    try {
        const ciphertext = desService.encryptDES(plaintext, key);
        res.json({ ciphertext });
    } catch (err) {
        res.status(500).json({ error: 'Encryption failed' });
    }
};

const handleDecrypt = (req, res) => {
    const { ciphertext, key } = req.body;
    try {
        const plaintext = desService.decryptDES(ciphertext, key);
        res.json({ plaintext });
    } catch (err) {
        res.status(400).json({ error: 'Decryption failed. Check your key!' });
    }
};

module.exports = { handleEncrypt, handleDecrypt };