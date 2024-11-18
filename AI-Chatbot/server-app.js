// server-app.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Request body:', req.body);
    next();
});

// Mount all routes under /api
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
    console.log('404 Not Found:', req.url);
    res.status(404).json({
        success: false,
        error: `Route not found: ${req.url}`
    });
});

// Error handler
app.use((err, req, res, next) => {
    // Only log errors in non-test environment
    if (process.env.NODE_ENV !== 'test') {
        console.error('Error:', err);
    }

    res.status(500).json({
        success: false,
        error: err.message
    });
});

module.exports = app;