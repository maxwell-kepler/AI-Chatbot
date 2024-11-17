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
router.get('/:conversationId/status', async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const [conversation] = await db.execute(
            'SELECT status, last_activity FROM Conversations WHERE conversation_ID = ?',
            [conversationId]
        );

        if (!conversation.length) {
            return res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
        }

        res.json({
            success: true,
            data: {
                status: conversation[0].status,
                lastActivity: conversation[0].last_activity
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;