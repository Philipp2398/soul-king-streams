const {Kafka} = require('kafkajs');

/**
 * Singleton class for Kafka client.
 */
class KafkaSingleton {
  /**
   * The constructor is private to prevent direct construction
   * calls with the `new` operator.
   */
  constructor() {
    throw new Error('Use KafkaSingleton.getInstance()');
  }

  /**
   * Initializes the Kafka instance if it's not already created.
   * @param {string} clientId - The client ID for the Kafka client.
   * @param {string[]} brokers - The list of broker addresses.
   */
  static initialize(clientId, brokers) {
    if (!this.instance) {
      try {
        this.instance = new Kafka({clientId, brokers});
      } catch (error) {
        console.error('Failed to initialize Kafka client:', error);
        throw error;
      }
    }
  }

  /**
   * Returns the Kafka instance.
   * @return {Kafka} The Kafka instance.
   */
  static getInstance() {
    if (!this.instance) {
      throw new Error('KafkaSingleton instance not initialized.');
    }
    return this.instance;
  }
}

module.exports = KafkaSingleton;
