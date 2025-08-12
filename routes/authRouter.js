const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.gerarToken);

module.exports = router;