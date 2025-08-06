const express = require('express');
const router = express.Router();
const historricoController = require('../controllers/historicoController');
const { validarCriacaoHistorico } = require('../validators/historicoValidator');
const { validationResult } = require('express-validator');

router.get('/', historricoController.listar);
router.post('/', validarCriacaoHistorico, historricoController.criar);

module.exports = router;