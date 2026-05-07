const express = require('express');
const router = express.Router();
const symmetricController = require('../controllers/symmetricController');

// Route generate random key
router.post('/generate-key', symmetricController.generateKey);

// Route generate random IV
router.post('/generate-iv', symmetricController.generateIV);

// Route mã hóa
router.post('/encrypt', symmetricController.encrypt);

// Route giải mã
router.post('/decrypt', symmetricController.decrypt);

module.exports = router;
