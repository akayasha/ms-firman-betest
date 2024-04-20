const jwt = require('jsonwebtoken'); 
const jwtConfig = require('../config/jwt');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error(err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
