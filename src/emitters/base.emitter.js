const KafkaSingleton = require('#lib/kafka/kafkaSingleton');
const {
  totalMessagesEmittedCounter, errorMessageEmittedCounter,
} = require('#lib/metrics/metrics.js');

/**
 * Base class for Kafka message emitters.
 */
class BaseEmitter {
  /**
   * Constructs a BaseEmitter instance.
   * @param {string} topic The Kafka topic to emit messages to.
   * @param {string[]} kafkaBrokers List of Kafka brokers.
   */
  constructor(topic, kafkaBrokers) {
    this.topic = topic;
    const kafkaInstance = new KafkaSingleton(kafkaBrokers).getInstance();
    this.producer = kafkaInstance.producer();
  }

  /**
   * Connects to the Kafka broker.
   */
  async connect() {
    await this.producer.connect();
  }

  /**
   * Emits a message to the Kafka topic.
   * @param {Object} message The message to be emitted.
   */
  async emit(message) {
    try {
      const formattedMessage = this.formatMessage(message);

      await this.producer.send({
        topic: this.topic,
        messages: [{value: JSON.stringify(formattedMessage)}],
      });
      totalMessagesEmittedCounter.inc();
    } catch (error) {
      // Handle or log the error
      console.error('Error in emitting message:', error);
      errorMessageEmittedCounter.inc();
      throw error;
    }
  }

  /**
   * Disconnects from the Kafka broker.
   */
  async disconnect() {
    await this.producer.disconnect();
  }

  /**
   * Formats the message to be emitted. Can be overridden by subclasses.
   * @param {Object} message The message to format.
   * @return {Object} The formatted message.
   */
  formatMessage(message) {
    // Add validation or default formatting logic here
    return message;
  }
}

module.exports = BaseEmitter;
