// routes/conversationRoutes.js
const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

console.log('Conversation controller methods:', {
    createConversation: !!conversationController.createConversation,
    addMessage: !!conversationController.addMessage,
    recordCrisisEvent: !!conversationController.recordCrisisEvent,
    updateConversationStatus: !!conversationController.updateConversationStatus,
    updateRiskLevel: !!conversationController.updateRiskLevel,
    getConversationMessages: !!conversationController.getConversationMessages,
    generateSummary: !!conversationController.generateSummary,
    getLatestSummary: !!conversationController.getLatestSummary
});

router.post('/', conversationController.createConversation);
router.post('/:conversationId/messages', conversationController.addMessage);
router.post('/:conversationId/crisis-events', conversationController.recordCrisisEvent);
router.put('/:conversationId/status', conversationController.updateConversationStatus);
router.put('/:conversationId/risk-level', conversationController.updateRiskLevel);
router.get('/:conversationId/messages', conversationController.getConversationMessages);
router.get('/:conversationId/summary', conversationController.generateSummary);
router.get('/:conversationId/summary/latest', conversationController.getLatestSummary);

module.exports = router;