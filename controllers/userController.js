const UserService = require('../services/userService');
const kafkaProducer = require('../config/kafkaProducer'); 
const User = require('../models/user');


class UserController {

    static async createUser(req, res) {
        try {
            const { username, email } = req.body;

            const newUser = await UserService.createUser(username, email);

            // Publish user data to Kafka
            const payload = [
                { topic: 'kafka_firmanIsmail_topic', messages: JSON.stringify(newUser) }
            ];

            kafkaProducer.producer.send(payload, (err, data) => {
                if (err) {
                    console.error('Error publishing user data to Kafka:', err);
                } else {
                    console.log('User data published to Kafka:', data);
                }
            });

            res.status(201).send(newUser);
        } catch (err) {
            res.status(500).send({ message: err.message || 'Some error occurred while creating the user.' });
        }
    }

    static async getUsers(req, res) {
        try {
            const users = await User.find();
            res.send(users);
        } catch (err) {
            res.status(500).send({ message: err.message || 'Some error occurred while retrieving users.' });
        }
    }

    static async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).send({ message: 'User not found.' });
            }
            res.send(user);
        } catch (err) {
            res.status(500).send({ message: err.message || 'Error retrieving user with id ' + req.params.userId });
        }
    }

    static async updateUser(req, res) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
            if (!updatedUser) {
                return res.status(404).send({ message: 'User not found.' });
            }

            // Publish user data to Kafka
            const payload = [
                { topic: 'kafka_firmanIsmail_topic', messages: JSON.stringify(newUser) }
            ];

            kafkaProducer.producer.send(payload, (err, data) => {
                if (err) {
                    console.error('Error publishing user data to Kafka:', err);
                } else {
                    console.log('User data published to Kafka:', data);
                }
            });

            res.send(updatedUser);
        } catch (err) {
            res.status(500).send({ message: err.message || 'Error updating user with id ' + req.params.userId });
        }
    }

    static async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.userId);
            if (!user) {
                return res.status(404).send({ message: 'User not found.' });
            }
            res.send({ message: 'User deleted successfully!' });
        } catch (err) {
            res.status(500).send({ message: err.message || 'Error deleting user with id ' + req.params.userId });
        }
    }

     // Get user by identity number
     static async getUserByIdentityNumber(req, res) {
        try {
            const { identityNumber } = req.params; 
            const user = await UserService.getUserByIdentityNumber(identityNumber);
            if (!user) {
                return res.status(404).send({ message: 'User not found.' });
            }
            res.send(user);
        } catch (err) {
            res.status(500).send({ message: err.message || 'Error retrieving user by identity number.' });
        }
    }
    
    static async getUserByAccountNumber(req, res) {
        try {
            const { accountNumber } = req.params; 
            const user = await UserService.getUserByAccountNumber(accountNumber);
            if (!user) {
                return res.status(404).send({ message: 'User not found.' });
            }
            res.send(user);
        } catch (err) {
            res.status(500).send({ message: err.message || 'Error retrieving user by account number.' });
        }
    }
}


module.exports = UserController;
