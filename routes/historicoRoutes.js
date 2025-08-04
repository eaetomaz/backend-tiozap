const express = require('express');
const router = express.Router();
const historricoController = require('../controllers/historicoController');

router.get('/', historricoController.listar);
router.post('/', historricoController.criar);

module.exports = router;