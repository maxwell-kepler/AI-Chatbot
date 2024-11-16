// routes/conversationRoutes.js
const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

// Sanity Check
console.log('Conversation controller methods:', {
    createConversation: !!conversationController.createConversation,
    addMessage: !!conversationController.addMessage
});

router.post('/', conversationController.createConversation);
router.post('/:conversationId/messages', conversationController.addMessage);

module.exports = router;