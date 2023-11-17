const {Kafka, logLevel} = require('kafkajs');

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
   * Maps string log levels to Kafka log level constants.
   * @param {string} level - The string log level.
   * @return {number} Corresponding Kafka log level.
   */
  static mapLogLevel(level) {
    const levels = {
      'error': logLevel.ERROR,
      'warn': logLevel.WARN,
      'info': logLevel.INFO,
      'debug': logLevel.DEBUG,
      'nothing': logLevel.NOTHING,
    };
    return levels[level] || logLevel.INFO; // Default to INFO if not matched
  }

  /**
   * Initializes the Kafka instance if it's not already created.
   * @param {string} clientId - The client ID for the Kafka client.
   * @param {string[]} brokers - The list of broker addresses.
   * @param {function} logCreator - Function to create the logger (optional).
   * @param {string} loggingLevel - Logging level (optional).
   */
  static initialize(clientId, brokers, logCreator, loggingLevel) {
    if (!this.instance) {
      const kafkaConfig = {clientId, brokers};

      // Add logCreator if they are defined
      if (logCreator !== undefined) {
        kafkaConfig.logCreator = logCreator;
      }

      // Add logLevel if defined, mapping from string to Kafka log level
      if (loggingLevel !== undefined) {
        kafkaConfig.logLevel = this.mapLogLevel(loggingLevel);
      }

      try {
        this.instance = new Kafka(kafkaConfig);
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
