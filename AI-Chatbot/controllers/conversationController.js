// controllers/conversationController.js
const db = require('../config/database');
const { formatDateForMySQL } = require('../utils/dateFormatter');

class ConversationController {
    createConversation = async (req, res, next) => {
        const connection = await db.getConnection();
        console.log('Create conversation request received:', req.body);

        try {
            await connection.beginTransaction();

            const { userId: firebaseId, status, startTime } = req.body;

            if (!firebaseId) {
                throw new Error('userId is required');
            }

            // Get or wait for the MySQL user_ID using the firebase_ID with shorter retry intervals
            let retries = 5; // Increase retries but decrease interval
            let users;

            while (retries > 0) {
                [users] = await connection.execute(
                    'SELECT user_ID FROM Users WHERE firebase_ID = ?',
                    [firebaseId]
                );

                console.log(`User lookup attempt (${retries} retries left):`, {
                    firebaseId,
                    found: users.length > 0
                });

                if (users.length > 0) break;

                await new Promise(resolve => setTimeout(resolve, 200));
                retries--;
            }

            if (users.length === 0) {
                throw new Error(`User not found after multiple retries: ${firebaseId}`);
            }

            const mysqlUserId = users[0].user_ID;
            const formattedStartTime = formatDateForMySQL(startTime || new Date());

            console.log('Creating conversation with:', {
                mysqlUserId,
                status,
                startTime: formattedStartTime
            });

            const [result] = await connection.execute(
                'INSERT INTO Conversations (user_ID, status, start_time) VALUES (?, ?, ?)',
                [mysqlUserId, status || 'active', formattedStartTime]
            );

            await connection.commit();

            const response = {
                success: true,
                message: 'Conversation created successfully',
                conversationId: result.insertId
            };

            console.log('Conversation created successfully:', response);
            res.status(201).json(response);

        } catch (error) {
            await connection.rollback();
            console.error('Error in createConversation:', error);
            next(error);
        } finally {
            connection.release();
        }
    }

    addMessage = async (req, res, next) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const { conversationId } = req.params;
            const { content, senderType, emotionalState, timestamp } = req.body;

            console.log('Adding message to conversation:', {
                conversationId,
                senderType,
                contentLength: content?.length,
                hasEmotionalState: !!emotionalState
            });

            // Input validation
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

            const formattedTimestamp = formatDateForMySQL(timestamp || new Date());

            try {
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

                const response = {
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
                };

                console.log('Message added successfully:', {
                    messageId: result.insertId,
                    conversationId
                });

                res.status(201).json(response);

            } catch (dbError) {
                console.error('Database error while adding message:', dbError);
                throw new Error(`Failed to add message: ${dbError.message}`);
            }

        } catch (error) {
            await connection.rollback();
            console.error('Error processing addMessage:', error);
            next(error);
        } finally {
            connection.release();
        }
    }
}

const conversationController = new ConversationController();
module.exports = conversationController;