const express = require('express');
const metricsRouter = require('./routes/metrics.router');
const healthRouter = require('./routes/health.router');

const app = express();


app.use('/metrics', metricsRouter);
app.use('health', healthRouter);
module.exports = app;
