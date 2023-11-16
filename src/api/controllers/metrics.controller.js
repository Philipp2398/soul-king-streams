const Prometheus = require('prom-client');

class MetricsController {
  async getMetrics(req, res) {
    try {
      res.set('Content-Type', Prometheus.register.contentType);
      res.end(await Prometheus.register.metrics());
    } catch (err) {
      res.status(500).end(err);
    }
  }
}

module.exports = new MetricsController();
