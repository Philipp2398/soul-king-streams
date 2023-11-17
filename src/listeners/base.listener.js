const KafkaSingleton = require('#lib/kafka/kafkaSingleton');
const {
  totalMessagesConsumedCounter, errorMessagesConsumedCounter,
} = require('#lib/metrics/metrics');
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
    groupId, topics, clientId, kafkaBrokers, kafkaClient, fromBeginning = false,
  }) {
    if (!groupId || !topics || topics.length === 0) {
      throw new Error('groupId and topics are required for BaseListener');
    }

    this.groupId = groupId;
    this.topics = topics;
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
      for (const topic of this.topics) {
        await this.consumer.subscribe({
          topic: topic,
          fromBeginning: this.fromBeginning,
        });
      }

      await this.consumer.run({
        eachMessage: async ({topic, partition, message}) => {
          try {
            await this.onMessage({topic, partition, message});
            totalMessagesConsumedCounter.inc();
          } catch (error) {
            console.error('Error processing message:', error);
            errorMessagesConsumedCounter.inc();
            throw error;
          }
        },
      });
    } catch (error) {
      console.error('Error in Kafka connection:', error);
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
