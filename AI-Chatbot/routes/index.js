// routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const conversationRoutes = require('./conversationRoutes');
const resourceRoutes = require('./resourceRoutes');
const categoryRoutes = require('./categoryRoutes');
const trackingRoutes = require('./trackingRoutes');

console.log('Mounting all routes...');

router.use('/users', userRoutes);
router.use('/conversations', conversationRoutes);
router.use('/resources', resourceRoutes);
router.use('/categories', categoryRoutes);
router.use('/tracking', trackingRoutes);

console.log('All routes mounted successfully');

module.exports = router;