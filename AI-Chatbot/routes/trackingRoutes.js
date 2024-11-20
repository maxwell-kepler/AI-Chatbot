// routes/trackingRoutes.js
const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const patternService = require('../services/patterns/patternService');

console.log('Tracking controller methods:', {
    getEmotionalHistory: !!trackingController.getEmotionalHistory,
    getConversationSummaries: !!trackingController.getConversationSummaries,
    getEmotionalPatterns: !!trackingController.getEmotionalPatterns
}, '\n');

router.get('/firebase/:firebaseId/emotional-history', trackingController.getEmotionalHistory);
router.get('/firebase/:firebaseId/conversation-summaries', trackingController.getConversationSummaries);
router.get('/firebase/:firebaseId/emotional-patterns', trackingController.getEmotionalPatterns);
router.get('/firebase/:firebaseId/crisis-events', trackingController.getCrisisEvents);
router.get('/firebase/:firebaseId/resource-access', trackingController.getResourceAccessHistory);
router.post('/firebase/:firebaseId/test-pattern', async (req, res, next) => {
    try {
        const { firebaseId } = req.params;
        const { emotionalState, content } = req.body;

        console.log('Testing pattern recording:', {
            firebaseId,
            emotionalState,
            content
        });

        await patternService.recordEmotionalState(
            firebaseId,
            emotionalState,
            content
        );

        res.json({
            success: true,
            message: 'Test pattern recorded'
        });
    } catch (error) {
        console.error('Error in test pattern route:', error);
        next(error);
    }
});

router.get('/firebase/:firebaseId/verify-patterns', async (req, res, next) => {
    try {
        const { firebaseId } = req.params;

        const [patterns] = await db.execute(
            `SELECT * FROM Emotional_Patterns WHERE user_ID = ?`,
            [firebaseId]
        );

        res.json({
            success: true,
            data: patterns
        });
    } catch (error) {
        console.error('Error verifying patterns:', error);
        next(error);
    }
});

module.exports = router;