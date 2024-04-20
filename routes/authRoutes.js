const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');
const AuthService = require('../services/authService'); 


// Route for user registration (createUser)
router.post('/api/register', async (req, res) => {
    try {
        // Get user data from the request
        const { username, email, accountNumber, identityNumber } = req.body;

        // Validate input
        if (!username || !email || !accountNumber || !identityNumber) {
            return res.status(400).send({ message: 'Username, email, account number, and identity number are required.' });
        }

        // Create user using UserService
        const newUser = await UserService.createUser(username, email, accountNumber, identityNumber);

        // Send success response
        res.status(201).send({ message: 'Registration successful.', user: newUser });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).send({ message: 'Failed to register user.' });
    }
});


// Route for user login
router.post('/login', async (req, res) => {
    try {
        // Get user credentials from the request
        const { id, userName } = req.body;

        // Validate input
        if (!id || !userName) {
            return res.status(400).send({ message: 'User id and username are required.' });
        }

        // Authenticate user using AuthService
        const user = await AuthService.authenticateUser(id, userName);

        if (!user) {
            return res.status(401).send({ message: 'Invalid user id or username.' });
        }

        // Generate JWT token
        const token = await AuthService.generateToken(user); 

        // Send success response with JWT token
        res.status(200).send({ message: 'Login successful.', token }); 
    } catch (error) {
        console.error('Error during user authentication:', error);
        res.status(500).send({ message: 'Internal server error.' });
    }
});


// Route to generate JWT token using userName and id (optional)
router.post('/generate-token', async (req, res) => {
    try {
        // Get userName and id from the request
        const { userName, id } = req.body;

        // Validate input
        if (!userName || !id) {
            return res.status(400).send({ message: 'Username and id are required.' });
        }

        // Generate JWT token
        const token = AuthService.generateToken({ userName, _id: id });

        // Send success response with JWT token
        res.status(200).send({ message: 'JWT token generated successfully.', token });
    } catch (error) {
        console.error('Error during JWT token generation:', error);
        res.status(500).send({ message: 'Internal server error.' });
    }
});

module.exports = router;
