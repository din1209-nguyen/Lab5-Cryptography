const express = require('express');
const router = express.Router();
const tripleDesController = require('../controllers/tripleDesController');

// Route generate random key
router.post('/generate-key', tripleDesController.generateKey);

// Route generate random IV
router.post('/generate-iv', tripleDesController.generateIV);

// Route mã hóa
router.post('/encrypt', tripleDesController.encrypt);

// Route giải mã
router.post('/decrypt', tripleDesController.decrypt);

module.exports = router;
