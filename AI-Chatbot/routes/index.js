// routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const conversationRoutes = require('./conversationRoutes');
const resourceRoutes = require('./resourceRoutes');
const categoryRoutes = require('./categoryRoutes');
const trackingRoutes = require('./trackingRoutes');
const patternRoutes = require('./patternRoutes');

if (process.env.NODE_ENV !== 'test') {
    console.log('Mounting all routes...');
}

router.use('/users', userRoutes);
router.use('/conversations', conversationRoutes);
router.use('/resources', resourceRoutes);
router.use('/categories', categoryRoutes);
router.use('/tracking', trackingRoutes);
router.use('/patterns', patternRoutes);

if (process.env.NODE_ENV !== 'test') {
    console.log('All routes mounted successfully');
}
module.exports = router;