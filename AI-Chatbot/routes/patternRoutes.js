// routes/patternRoutes.js
const express = require('express');
const router = express.Router();
const patternController = require('../controllers/patternController');

router.post('/record', patternController.recordEmotionalPattern);
router.get('/user/:userId/patterns', patternController.getUserPatterns);
router.get('/user/:userId/trends', patternController.getEmotionalTrends);

module.exports = router;