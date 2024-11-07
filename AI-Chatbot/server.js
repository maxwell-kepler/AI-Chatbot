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

// Test endpoint
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
            'SELECT user_ID, name, create_at, last_login, firebase_ID FROM Users ORDER BY create_at DESC'
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

// Get all categories
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT category_ID, name, icon FROM Categories'
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

// Get all resources with tags and category info
app.get('/api/resources', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                r.*,
                c.name as category_name,
                c.icon as category_icon,
                GROUP_CONCAT(DISTINCT t.name) as tags
            FROM Resources r
            LEFT JOIN Categories c ON r.category_ID = c.category_ID
            LEFT JOIN Used_In ui ON r.resource_ID = ui.resource_ID
            LEFT JOIN Tags t ON ui.tag_ID = t.tag_ID
            GROUP BY r.resource_ID, r.name, r.description, r.category_ID, 
                     r.phone, r.address, r.hours, r.website_URL,
                     c.name, c.icon
        `);

        // Process the results to convert the comma-separated tags into arrays
        const formattedResources = rows.map(resource => ({
            ...resource,
            tags: resource.tags ? resource.tags.split(',') : []
        }));

        res.json(formattedResources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({
            message: 'Failed to fetch resources',
            error: error.message
        });
    }
});

// Get all tags
app.get('/api/tags', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT tag_ID, name FROM Tags');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({
            message: 'Failed to fetch tags',
            error: error.message
        });
    }
});

// Get resources by category
app.get('/api/categories/:categoryId/resources', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                r.*,
                c.name as category_name,
                c.icon as category_icon,
                GROUP_CONCAT(t.name) as tags
            FROM Resources r
            LEFT JOIN Categories c ON r.category_ID = c.category_ID
            LEFT JOIN Used_In ui ON r.resource_ID = ui.resource_ID
            LEFT JOIN Tags t ON ui.tag_ID = t.tag_ID
            WHERE r.category_ID = ?
            GROUP BY r.resource_ID
        `, [req.params.categoryId]);

        const formattedResources = rows.map(resource => ({
            ...resource,
            tags: resource.tags ? resource.tags.split(',') : []
        }));

        res.json(formattedResources);
    } catch (error) {
        console.error('Error fetching resources by category:', error);
        res.status(500).json({
            message: 'Failed to fetch resources',
            error: error.message
        });
    }
});

// Create new user
app.post('/api/users', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({
                message: 'Missing required fields',
                required: ['email', 'password', 'name'],
                received: { email, name }
            });
        }

        // First create Firebase login entry
        const [firebaseResult] = await db.execute(
            'INSERT INTO Firebase_Login (ID, email, password) VALUES (UUID(), ?, ?)',
            [email, password]
        );

        // Get the generated Firebase ID
        const [firebaseUser] = await db.execute(
            'SELECT ID FROM Firebase_Login WHERE email = ?',
            [email]
        );

        // Create user with Firebase reference
        const [userResult] = await db.execute(
            'INSERT INTO Users (user_ID, name, create_at, firebase_ID) VALUES (UUID(), ?, CURRENT_TIMESTAMP, ?)',
            [name, firebaseUser[0].ID]
        );

        // Fetch created user
        const [users] = await db.execute(
            'SELECT user_ID, name, create_at, firebase_ID FROM Users WHERE firebase_ID = ?',
            [firebaseUser[0].ID]
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
    console.log('- GET  /api/users');
    console.log('- GET  /api/categories');
    console.log('- GET  /api/resources');
    console.log('- GET  /api/tags');
    console.log('- GET  /api/categories/:categoryId/resources');
    console.log('- POST /api/users');
});