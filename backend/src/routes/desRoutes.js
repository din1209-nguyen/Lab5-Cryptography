const express = require('express');
const router = express.Router();
const desController = require('../controllers/desController');

router.post('/encrypt', desController.handleEncrypt);
router.post('/decrypt', desController.handleDecrypt);

module.exports = router;