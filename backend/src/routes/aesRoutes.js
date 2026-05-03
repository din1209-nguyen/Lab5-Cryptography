const express = require('express');
const router = express.Router();
const aesController = require('../controllers/aesController');

router.post('/encrypt', aesController.encryptAES);
router.post('/decrypt', aesController.decryptAES);

module.exports = router;