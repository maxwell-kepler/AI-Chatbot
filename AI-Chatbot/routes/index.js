// routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const conversationRoutes = require('./conversationRoutes');

console.log('Mounting routes...');

router.use('/users', userRoutes);
router.use('/conversations', conversationRoutes);

console.log('Routes mounted successfully');

module.exports = router;