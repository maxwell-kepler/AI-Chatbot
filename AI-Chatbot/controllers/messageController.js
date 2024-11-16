// controllers/messageController.js
import { formatDateForMySQL } from '../utils/dateUtils';
const db = require('../config/database');

class MessageController {
    async addMessage(req, res, next) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const { conversationId } = req.params;
            const { content, senderType, emotionalState, timestamp } = req.body;

            // Validate input
            if (!content || !senderType) {
                throw new Error('Content and senderType are required');
            }

            // Verify conversation exists
            const [conversations] = await connection.execute(
                'SELECT conversation_ID FROM Conversations WHERE conversation_ID = ?',
                [conversationId]
            );

            if (conversations.length === 0) {
                throw new Error(`Conversation ${conversationId} not found`);
            }

            // Format timestamp
            const formattedTimestamp = formatDateForMySQL(timestamp || new Date());

            // Insert message
            const [result] = await connection.execute(
                `INSERT INTO Messages 
                (conversation_ID, content, sender_type, emotional_state, timestamp) 
                VALUES (?, ?, ?, ?, ?)`,
                [
                    conversationId,
                    content,
                    senderType,
                    emotionalState ? JSON.stringify(emotionalState) : null,
                    formattedTimestamp
                ]
            );

            await connection.commit();

            res.status(201).json({
                success: true,
                message: 'Message added successfully',
                data: {
                    messageId: result.insertId,
                    conversationId,
                    content,
                    senderType,
                    emotionalState,
                    timestamp: formattedTimestamp
                }
            });

        } catch (error) {
            await connection.rollback();
            console.error('Database error in addMessage:', error);
            next(error);
        } finally {
            connection.release();
        }
    }
}

module.exports = new MessageController();