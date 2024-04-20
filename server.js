const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middleware/authMiddleware'); 
require('dotenv').config();
const dbConfig = require('./config/database');
const PORT = process.env.PORT || 3000; 

// Initialize Express app
const app = express();

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose.connect(dbConfig.url, dbConfig.options)
    .then(() => {
        console.log("Successfully connected to the database");
        // Define routes after successful database connection
        app.use('/auth', authRoutes);
        app.use('/', userRoutes); 

        // Set port, listen for requests
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });

module.exports = app;
