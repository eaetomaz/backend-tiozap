const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

router.get('/', configController.listar);
router.put('/:id', configController.atualizar);

module.exports = router;