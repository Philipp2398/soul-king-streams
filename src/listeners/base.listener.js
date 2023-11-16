const KafkaSingleton = require('#lib/kafka/kafkaSingleton');
const {
  totalMessagesConsumedCounter, errorMessagesConsumedCounter,
} = require('#lib/metrics/metrics.js');
/**
 * Base class for Kafka topic listeners.
 */
class BaseListener {
  static ON_MESSAGE_NOT_IMPLEMENTED = Symbol('ON_MESSAGE_NOT_IMPLEMENTED');
  /**
   * Constructor for BaseListener
   * @param {Object} config Configuration object for the listener
   * @param {string} config.groupId Group ID for the Kafka consumer
   * @param {string} config.topic Kafka topic to subscribe to
   * @param {string[]} [config.kafkaBrokers] Kafka broker addresses
   * @param {KafkaClient} [config.kafkaClient] Instance of KafkaClient
   * @param {boolean} [config.fromBeginning=false]
   * Start consuming from the beginning
   */
  constructor({
    groupId, topic, clientId, kafkaBrokers, kafkaClient, fromBeginning = false,
  }) {
    if (!groupId || !topic) {
      throw new Error('groupId and topic are required for BaseListener');
    }

    this.groupId = groupId;
    this.topic = topic;
    this.fromBeginning = fromBeginning;

    // Initialize KafkaSingleton if necessary
    if (!kafkaClient && clientId && kafkaBrokers) {
      KafkaSingleton.initialize(clientId, kafkaBrokers);
    }

    // Obtain Kafka instance from the singleton
    const kafkaInstance = KafkaSingleton.getInstance();
    this.consumer = kafkaInstance.consumer({groupId: this.groupId});

    if (this.onMessage === BaseListener.prototype.onMessage) {
      throw new Error(
          'Subclasses of BaseListener must implement the onMessage method',
      );
    }
  }

  /**
   * Connects to the Kafka topic.
   */
  async connect() {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topic: this.topic,
        fromBeginning: this.fromBeginning,
      });

      await this.consumer.run({
        eachMessage: async ({topic, partition, message}) => {
          try {
            await this.onMessage({topic, partition, message});

            // Increment total messages consumed counter
            totalMessagesConsumedCounter.inc();
          } catch (error) {
            console.error('Error processing message:', err);

            // Increment error messages consumed counter
            errorMessagesConsumedCounter.inc();

            throw error;
          }
        },
      });
    } catch (error) {
      console.error('Error in Kafka connection:', error);
      // Consider additional error handling/recovery logic here
    }
  }

  /**
   * Disconnects from the Kafka topic.
   */
  async disconnect() {
    await this.consumer.disconnect();
  }

  /**
   * Method to handle incoming Kafka messages.
   * Needs to be implemented by subclasses.
   * @param {Object} data Message data
   */
  async onMessage(data) {
    throw new Error(
        'onMessage method needs to be implemented in subclasses',
    );
  }
}

module.exports = BaseListener;
