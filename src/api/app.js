const express = require('express');
const metricsRouter = require('./routes/metrics.router');

const app = express();


app.use('/metrics', metricsRouter);
module.exports = app;
