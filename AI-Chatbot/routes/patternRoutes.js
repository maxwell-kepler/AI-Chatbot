// routes/patternRoutes.js
const express = require('express');
const router = express.Router();
const patternController = require('../controllers/patternController');

if (process.env.NODE_ENV !== 'test') {
    console.log('Pattern} controller methods:', {
        recordEmotionalPattern: !!patternController.recordEmotionalPattern,
        getUserPatterns: !!patternController.getUserPatterns,
        getEmotionalTrends: !!patternController.getEmotionalTrends
    }, '\n');
}


router.post('/record', patternController.recordEmotionalPattern);
router.get('/user/:userId/patterns', patternController.getUserPatterns);
router.get('/user/:userId/trends', patternController.getEmotionalTrends);

module.exports = router;