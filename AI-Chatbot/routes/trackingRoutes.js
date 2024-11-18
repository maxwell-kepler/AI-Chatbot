// routes/trackingRoutes.js
const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');

console.log('Tracking controller methods:', {
    getEmotionalHistory: !!trackingController.getEmotionalHistory,
    getConversationSummaries: !!trackingController.getConversationSummaries,
    getEmotionalPatterns: !!trackingController.getEmotionalPatterns
}, '\n');

router.get('/firebase/:firebaseId/emotional-history', trackingController.getEmotionalHistory);
router.get('/firebase/:firebaseId/conversation-summaries', trackingController.getConversationSummaries);
router.get('/firebase/:firebaseId/emotional-patterns', trackingController.getEmotionalPatterns);

module.exports = router;