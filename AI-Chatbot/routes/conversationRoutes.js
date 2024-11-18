// routes/conversationRoutes.js
const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

console.log('Conversation controller methods:', {
    createConversation: !!conversationController.createConversation,
    addMessage: !!conversationController.addMessage,
    updateConversationStatus: !!conversationController.updateConversationStatus,
    getConversationMessages: !!conversationController.getConversationMessages,
    generateSummary: !!conversationController.generateSummary
});

router.post('/', conversationController.createConversation);
router.post('/:conversationId/messages', conversationController.addMessage);
router.put('/:conversationId/status', conversationController.updateConversationStatus);
router.get('/:conversationId/messages', conversationController.getConversationMessages);
router.get('/:conversationId/summary', conversationController.generateSummary);
router.get('/:conversationId/summary/latest', conversationController.getLatestSummary);

module.exports = router;