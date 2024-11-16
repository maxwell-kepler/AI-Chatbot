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
router.get('/:conversationId/messages', conversationController.getConversationMessages);
router.get('/:conversationId/summary', conversationController.generateSummary);
router.post('/:conversationId/messages', conversationController.addMessage);
router.put('/:conversationId/status', conversationController.updateConversationStatus);

module.exports = router;