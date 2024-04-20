const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const User = require('../models/user');

class AuthService {

    static async authenticateUser(id, userName) {
        try {
            // Find user by username
            const user = await User.findOne({_id: id, userName: userName });

            if (!user) {
                return null;
            }

        
            return user;
        } catch (error) {
            throw new Error('Failed to authenticate user: ' + error.message);
        }
    }

    static async generateToken(user) { 
        try {
            // Generate JWT token using the secret key from jwtConfig
            const token = jwt.sign({ id: user._id, userName: user.userName }, jwtConfig.secret, {
                expiresIn: '1h'
            });
    
            return token;
        } catch (error) {
            throw new Error('Failed to generate token: ' + error.message);
        }
    }
}

module.exports = AuthService;
