const {
  checkHealth,
  checkKafkaConnection,
  checkResourceUsage,
  determineOverallHealth,
} = require('@controllers/health.controller');

const KafkaSingleton = require('@root/lib/kafka/kafkaSingleton.js');
// const KafkaSingleton = require('../../../../lib/kafka/kafkaSingleton');


describe('Health Controller', () => {
  describe.skip('checkHealth()', () => {
    it.skip('should return a healthy status when everything is okay', () => {
      // Implement the test
    });

    it.skip('should return an unhealthy status when a health check fails', () => {
      // Implement the test
    });
  });

  // Test checkKafkaConnection() function
  describe.skip('checkKafkaConnection()', () => {
    it.skip('should return a healthy status when Kafka connection is okay', () => {
      const kafkaInstance = new KafkaSingleton(kafkaBrokers).getInstance();

      const result = checkKafkaConnection();
      expect(result).toEqual({
        status: 'OK', message: 'Kafka connection running.',
      });
    });

    it.skip('should return an unhealthy status when Kafka connection check fails', () => {
      const kafkaInstance = undefined;

      const result = checkKafkaConnection();
      expect(result).toEqual({
        status: 'unhealthy', message: 'Kafka connection issue.',
      });
    });
  });

  // Test checkResourceUsage() function
  describe.skip('checkResourceUsage()', () => {
    it('should return a healthy status when resource usage is normal', () => {
      const result = checkResourceUsage();
      expect(result).toEqual({
        status: 'OK', message: 'Resource usage is within acceptable limits.',
      });
    });

    it('should return a degraded status when cpu usage is high', () => {
      function highCPU() {
        let result = 0;

        for (let i = 0; i<10000; i++) {
          for (let j=0; j<10000; j++) {
            result += i + j;
          };
        };
      }

      highCPU();
      const result = checkResourceUsage();
      expect(result).toEqual({
        status: 'degraded', message: 'CPU usage is high.',
      });
    });

    it('should return a degraded status when memeroy usage is high', () => {
      function highMemory() {
        const largeArray = [];
        for (let i = 0; i < 1000000; i++) {
          largeArray.push(new Array(1000).fill('Node.js'));
        }
      }

      // highMemory();
      const result = checkResourceUsage();
      expect(result).toEqual({
        status: 'degraded', message: 'Memory usage is high.',
      });
    });

    it('should throw an error when resource check fails', () => {
      // Implement the test
    });
  });

  // Test determineOverallHealth() function
  describe.skip('determineOverallHealth()', () => {
    it.skip('should return a healthy status when all checks pass', () => {
      // Implement the test
    });

    it.skip('should return an unhealthy status when any check fails', () => {
      // Implement the test
    });
  });
});
