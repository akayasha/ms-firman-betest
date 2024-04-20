const kafka = require('kafka-node');

// Create Kafka producer
const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new Producer(client);

// Callback function to handle Kafka producer ready event
producer.on('ready', () => {
    console.log('Kafka producer is ready');
});

// Callback function to handle Kafka producer error event
producer.on('error', err => {
    console.error('Kafka producer error:', err);
});

module.exports = {
    producer
};
