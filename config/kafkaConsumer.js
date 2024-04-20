const kafka = require('kafka-node');
const User = require('./models/User');

// Create Kafka consumer
const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new Consumer(client, [{ topic: 'new-user-topic', partition: 0 }], { autoCommit: true });

// Callback function to handle Kafka message consumption
consumer.on('message', async message => {
    try {
        // Parse JSON message
        const newUser = JSON.parse(message.value);

        // Save user data to MongoDB
        const user = new User({
            username: newUser.username,
            email: newUser.email,
            // Add other user data you want to save
        });
        await user.save();

        console.log('New user data saved:', newUser);
    } catch (error) {
        console.error('Error processing Kafka message:', error);
    }
});

// Callback function to handle Kafka consumer error
consumer.on('error', err => {
    console.error('Kafka consumer error:', err);
});

module.exports = {
    consumer
};
