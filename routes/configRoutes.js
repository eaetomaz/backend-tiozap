const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const verificarToken = require('../middleware/verificarToken');

router.get('/', verificarToken, configController.listar);
router.put('/:id', verificarToken, configController.atualizar);

module.exports = router;