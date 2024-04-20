const User = require('../models/user'); 
const kafkaProducer = require('../config/kafkaProducer'); 

class UserService {

    static async createUser(username, email, accountNumber, identityNumber) {
        try {

            // Save user to the database
            const newUser = new User({
                userName: username,
                emailAddress: email,
                accountNumber: accountNumber, 
                identityNumber: identityNumber, 
            });

            // Save user to MongoDB
            const savedUser = await newUser.save();

            // Publish user data to Kafka
            const payload = [
                { topic: 'kafka_firmanIsmail_topic', messages: JSON.stringify(savedUser) }
            ];

            kafkaProducer.producer.send(payload, (err, data) => {
                if (err) {
                    console.error('Error publishing user data to Kafka:', err);
                } else {
                    console.log('User data published to Kafka:', data);
                }
            });

            return savedUser;
        } catch (error) {
            throw new Error('Failed to create user: ' + error.message);
        }
    }
    

    static async getUserByIdentityNumber(identityNumber) {
        try {
            const user = await User.findOne({ identityNumber: identityNumber });
            return user;
        } catch (error) {
            throw new Error('Failed to get user by identity number: ' + error.message);
        }
    }

    static async getUserByAccountNumber(accountNumber) {
        try{
            const user = await User.findOne({ accountNumber: accountNumber});
            return user;
        }catch (error) {
            throw new Error('Failed to get user by identity number: ' + error.message);
        }
    }
}

module.exports = UserService;
