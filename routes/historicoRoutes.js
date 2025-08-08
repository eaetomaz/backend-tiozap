const express = require('express');
const router = express.Router();
const historricoController = require('../controllers/historicoController');
const { validarCriacaoHistorico } = require('../validators/historicoValidator');
const verificarToken = require('../middleware/verificarToken');

router.get('/', verificarToken, historricoController.listar);
router.post('/', verificarToken, validarCriacaoHistorico, historricoController.criar);

module.exports = router;