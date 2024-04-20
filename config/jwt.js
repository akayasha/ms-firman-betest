const crypto = require('crypto');

// Generate a strong, random secret key
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Export the generated secret key
module.exports = {
    secret: generateSecretKey()
};