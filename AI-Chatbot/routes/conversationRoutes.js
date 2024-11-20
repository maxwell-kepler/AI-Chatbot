// routes/conversationRoutes.js
const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

if (process.env.NODE_ENV !== 'test') {
    console.log('Conversation controller methods:', {
        createConversation: !!conversationController.createConversation,
        addMessage: !!conversationController.addMessage,
        recordCrisisEvent: !!conversationController.recordCrisisEvent,
        updateConversationStatus: !!conversationController.updateConversationStatus,
        updateRiskLevel: !!conversationController.updateRiskLevel,
        getConversationMessages: !!conversationController.getConversationMessages,
        generateSummary: !!conversationController.generateSummary,
        getLatestSummary: !!conversationController.getLatestSummary
    }, '\n');
}

router.post('/', conversationController.createConversation);
router.post('/:conversationId/messages', conversationController.addMessage);
router.post('/:conversationId/crisis-events', conversationController.recordCrisisEvent);
router.put('/:conversationId/status', conversationController.updateConversationStatus);
router.put('/:conversationId/risk-level', conversationController.updateRiskLevel);
router.get('/:conversationId/messages', conversationController.getConversationMessages);
router.get('/:conversationId/summary', conversationController.generateSummary);
router.get('/:conversationId/summary/latest', conversationController.getLatestSummary);
router.post('/:conversationId/crisis-events', conversationController.recordCrisisEvent);
router.put('/:conversationId/crisis-events/:eventId/resolution', conversationController.updateCrisisResolution);
router.get('/:conversationId/crisis-events', conversationController.getCrisisEvents);


module.exports = router;