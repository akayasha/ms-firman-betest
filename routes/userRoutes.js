const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new user
router.post('/users', UserController.createUser);

// Get all users
router.get('/users', authMiddleware,UserController.getUsers);

// Get a user by ID
router.get('/users/:userId',authMiddleware, UserController.getUserById);

// Update a user
router.put('/users/:userId', authMiddleware,UserController.updateUser);

// Delete a user
router.delete('/users/:userId', authMiddleware,UserController.deleteUser);

router.get('/users/identity/:identityNumber',authMiddleware, UserController.getUserByIdentityNumber);

// Get user by account number
router.get('/users/account/:accountNumber',authMiddleware, UserController.getUserByAccountNumber);



module.exports = router;