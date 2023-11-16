const express = require('express');
const healthController = require('../controllers/health.controller');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', healthController.checkHealth);

module.exports = router;
