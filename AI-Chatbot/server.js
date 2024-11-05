//src/server.js
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`\n${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Test endpoint - NOTE: This should be defined BEFORE any route prefixes
app.get('/api/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({
        message: 'Backend is working!',
        timestamp: new Date().toISOString()
    });
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT user_id, email, username, first_name, last_name, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM categories'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
});

app.get('/api/resources', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM resources'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({
            message: 'Failed to fetch resources',
            error: error.message
        });
    }
});


// Create new user
app.post('/api/users', async (req, res) => {
    try {
        const { email, password, username, firstName, lastName } = req.body;

        // Validation
        if (!email || !password || !username) {
            return res.status(400).json({
                message: 'Missing required fields',
                required: ['email', 'password', 'username'],
                received: { email, username }
            });
        }

        // Create user
        const [result] = await db.execute(
            'INSERT INTO users (user_id, email, password_hash, username, first_name, last_name) VALUES (UUID(), ?, ?, ?, ?, ?)',
            [email, password, username, firstName, lastName]
        );

        // Fetch created user
        const [users] = await db.execute(
            'SELECT user_id, email, username, first_name, last_name, created_at FROM users WHERE email = ?',
            [email]
        );

        res.status(201).json({
            message: 'User created successfully',
            user: users[0]
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            message: 'Failed to create user',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: err.message
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\nServer running on http://0.0.0.0:${PORT}`);
    console.log('Available endpoints:');
    console.log('- GET  /api/test');
    console.log('- GET  /api/users');
    console.log('- POST /api/users');
});