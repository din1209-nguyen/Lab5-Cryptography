const desService = require('../services/desService');

const handleEncrypt = (req, res) => {
    const { plaintext, key } = req.body;
    if (!plaintext || !key) {
        return res.status(400).json({ error: 'Missing plaintext or key' });
    }
    
    try {
        const ciphertext = desService.encryptDES(plaintext, key);
        res.json({ success: true, ciphertext });
    } catch (err) {
        console.error('Encryption error:', err);
        res.status(400).json({ error: err.message });
    }
};

const handleDecrypt = (req, res) => {
    const { ciphertext, key } = req.body;
    if (!ciphertext || !key) {
        return res.status(400).json({ error: 'Missing ciphertext or key' });
    }
    
    try {
        const plaintext = desService.decryptDES(ciphertext, key);
        res.json({ success: true, plaintext });
    } catch (err) {
        console.error('Decryption error:', err);
        res.status(400).json({ error: err.message });
    }
};

module.exports = { handleEncrypt, handleDecrypt };