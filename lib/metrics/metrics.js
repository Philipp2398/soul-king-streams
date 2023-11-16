const promClient = require('prom-client');

// Define your metrics here
const totalMessagesEmittedCounter = new promClient.Counter({
  name: 'kafka_total_messages_emitted',
  help: 'Total number of messages emitted to Kafka',
});

const errorMessageEmittedCounter = new promClient.Counter({
  name: 'kafka_error_messages_emitted',
  help: 'Total number of error messages emitted to Kafka',
});

const totalMessagesConsumedCounter = new promClient.Counter({
  name: 'kafka_total_messages_consumed',
  help: 'Total number of messages consumed from Kafka',
});

const errorMessagesConsumedCounter = new promClient.Counter({
  name: 'kafka_error_messages_consumed',
  help: 'Total number of error messages consumed from Kafka',
});

module.exports = {
  totalMessagesEmittedCounter,
  errorMessageEmittedCounter,
  totalMessagesConsumedCounter,
  errorMessagesConsumedCounter,
};
