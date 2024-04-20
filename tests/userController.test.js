const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

describe('User API Endpoints', () => {
    let token; // Define a variable to store the JWT token

    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/db_ms-backend-test-betest', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        // Generate a JWT token for authentication
        token = jwt.sign({ id: 'user_id_here' }, jwtConfig.secret, {
            expiresIn: '1h'
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/auth/api/register')
            .send({
                "username": "karumakarum2",
                "email": "akayasha@example22.com",
                "accountNumber": "12345622",
                "identityNumber": "66622"
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Registration successful.');
    });
    
    it('should get all users', async () => {
        const res = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${token}`); // Include the token in the request headers
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should get a user by id', async () => {
        const user = await User.findOne();
        const res = await request(app)
            .get(`/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`); // Include the token in the request headers
        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toEqual(String(user._id));
    });

    

    it('should get a user by identity number', async () => {
        const user = await User.findOne();
        const res = await request(app)
            .get(`/users/identity/${user.identityNumber}`)
            .set('Authorization', `Bearer ${token}`); // Include the token in the request headers
        expect(res.statusCode).toEqual(200);
        expect(res.body.identityNumber).toEqual(user.identityNumber);
    });

    it('should get a user by account number', async () => {
        const user = await User.findOne();
        const res = await request(app)
            .get(`/users/account/${user.accountNumber}`)
            .set('Authorization', `Bearer ${token}`); // Include the token in the request headers
        expect(res.statusCode).toEqual(200);
        expect(res.body.accountNumber).toEqual(user.accountNumber);
    });

    it('should update a user', async () => {
        const user = await User.findOne();
        const res = await request(app)
            .put(`/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`) // Include the token in the request headers
            .send({ username: 'Updated User' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('User updated successfully.');
    });

    it('should delete a user', async () => {
        const user = await User.findOne();
        const res = await request(app)
            .delete(`/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`); // Include the token in the request headers
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('User deleted successfully!');
    });
    
});
