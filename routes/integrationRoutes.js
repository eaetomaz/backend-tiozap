const express = require("express");
const router = express.router();
const integrationController = require('../controllers/integrationController');

router.get('/connect', integrationController.connect);
router.get('/status', integrationController.status);
router.post('/send-message', integrationController.sendMessage);
router.post('/send-media', integrationController.sendMedia);

module.exports = router;