const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');
const verificarToken = require('../middleware/verificarToken');

router.get('/', verificarToken, summaryController.summary);

module.exports = router;