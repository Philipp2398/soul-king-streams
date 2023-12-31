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
   * Validates the parameters for clientId andbrokers.
   * @param {string} clientId - The client ID for the Kafka client.
   * @param {string[]} brokers - The list of broker addresses.
   */
  static validateConstructorParams(clientId, brokers) {
    if (!clientId) {
      throw new Error('Client ID is required.');
    }

    if (!brokers) {
      throw new Error('Brokers array is undefined.');
    }

    if (brokers.length === 0) {
      throw new Error('Brokers array is empty.');
    }

    if (!brokers.every((broker) => typeof broker === 'string')) {
      throw new Error('Brokers array contains invalid elements (non-string).');
    }
  }

  /**
   * Initializes the Kafka client with provided configurations.
   * @param {string} clientId - The client ID for the Kafka client.
   * @param {string[]} brokers - The list of broker addresses.
   * @param {boolean} fromBeginning - Whether to consume from the beginning.
   * @param {function} logCreator - Function to create the logger (optional).
   * @param {string} loggingLevel - Logging level (optional).
   */
  static initialize(
      clientId,
      brokers,
      fromBeginning,
      logCreator,
      loggingLevel,
  ) {
    if (!this.instance) {
      this.validateConstructorParams(clientId, brokers);

      const kafkaConfig = {clientId, brokers};

      // Additional configuration based on optional parameters
      if (logCreator) {
        kafkaConfig.logCreator = logCreator;
      }

      if (loggingLevel) {
        kafkaConfig.logLevel = KafkaSingleton.mapLogLevel(loggingLevel);
      }

      try {
        this.instance = new Kafka(kafkaConfig);
        this.instance.fromBeginning = fromBeginning;
      } catch (error) {
        console.error('Failed to initialize Kafka client:', error);
        throw error;
      }
    }
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
    return levels[level] || logLevel.INFO;
  }

  /**
   * Validates if the subclass has implemented the onMessage method.
   */
  validateOnMessageImplementation() {
    if (this.onMessage === BaseListener.prototype.onMessage) {
      throw new Error('Subclasses must implement the onMessage method.');
    }
  }

  /**
   * Returns the Kafka instance.
   * @return {Kafka} The Kafka instance.
   */
  static getInstance() {
    if (!this.instance) {
      throw new Error('KafkaSingleton instance has not been initialized.');
    }
    return this.instance;
  }
}

module.exports = KafkaSingleton;
