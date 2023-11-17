# Soul King Streams

## Description
Soul King Streams is a Node.js microservice skeleton designed to streamline inter-service communication through Kafka and provide monitoring capabilities via Express.js endpoints. This tool simplifies development, testing, and maintenance processes. The microservice includes two vital API endpoints: `/metrics` for monitoring metrics and `/health` for health status checks. It features well-structured classes for handling Kafka messages and an Express.js application setup for monitoring.

## Installation
Ensure Node.js and npm are installed on your system. Install Soul King Streams with the following command:

```bash
npm i soul-king-streams
```

## Usage
After installation, import the necessary components from Soul King Streams into your Node.js application. The package exports `BaseEmitter`, `BaseListener`, `KafkaSingleton`, and an Express.js application setup (`app`).

### Importing Components
```javascript
const { BaseEmitter, BaseListener, KafkaSingleton, app } = require('soul-king-streams');
```

### Setting Up KafkaSingleton
Before using `BaseEmitter` and `BaseListener`, you must initialize `KafkaSingleton` with your client ID and Kafka broker addresses.

```javascript
// Initialize the Kafka client
const clientId = 'my-app-client';
const brokers = ['broker1:9092', 'broker2:9092'];

KafkaSingleton.initialize(clientId, brokers);

// Later in your application, when you need to use Kafka
try {
  const kafka = KafkaSingleton.getInstance();
  // Use the kafka instance for producing or consuming messages
} catch (error) {
  console.error(error.message);
}
```

### API Endpoints
- `/metrics`: Access monitoring metrics.
- `/health`: Check the health status of the service.

### Kafka Emitter and Listener
Use `BaseEmitter` and `BaseListener` for handling Kafka messages, after setting up `KafkaSingleton`.

#### BaseEmitter Example:
```javascript
// You need to initialize the KafkaSingleton first
const { BaseEmitter } = require('soul-king-streams');

// Assuming the Kafka brokers are defined somewhere
const kafkaBrokers = ['broker1:9092', 'broker2:9092'];
const topic = 'my-topic';

// Create an instance of BaseEmitter
const emitter = new BaseEmitter(topic, kafkaBrokers);

// Connect to Kafka
await emitter.connect();

// Emit a message
const message = { key: 'value' }; // Replace with your actual message
await emitter.emit(message);

// Disconnect after done
await emitter.disconnect();
```

#### BaseListener Example:
```javascript
// You need to initialize the KafkaSingleton first
const { BaseListener } = require('soul-king-streams');

class MyKafkaListener extends BaseListener {
  async onMessage(data) {
    // Implement your message handling logic here
    console.log(`Received message on ${data.topic}:`, data.message.value.toString());
    // Add more processing logic as needed
  }
}

const myListener = new MyKafkaListener({
  groupId: 'my-group',
  topic: 'my-topic',
  clientId: 'my-client-id',
  kafkaBrokers: ['broker1:9092', 'broker2:9092']
});

// Connect to the Kafka topic
myListener.connect()
  .then(() => console.log('Connected to Kafka topic.'))
  .catch(error => console.error('Failed to connect:', error));

// Remember to gracefully disconnect when your application is closing
process.on('SIGINT', async () => {
  await myListener.disconnect();
  console.log('Disconnected from Kafka.');
});


```

### Express.js Application Setup
The `app` component configures Express.js for the monitoring endpoints.

```javascript
const { app } = require('soul-king-streams');

const PORT = 3000

app.listen(PORT, () => {
	console.log(`Server running on ${ PORT }`);
})
```

## Configuration
Configure Kafka brokers, topics, and Express.js settings according to your project's requirements.

## Contributing
Contributions are welcome. Please open an issue for major changes and submit pull requests for contributions.

## License
GNU Affero General Public License (AGPL)

