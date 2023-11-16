const express = require('express');
const metricsController = require('../controllers/metrics.controller');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', metricsController.getMetrics.bind(metricsController));

module.exports = router;
