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

            // Get or wait for the MySQL user_ID using the firebase_ID
            let retries = 5;
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

                // If this is the first attempt, wait longer to allow for user creation
                const waitTime = retries === 5 ? 1000 : 200;
                await new Promise(resolve => setTimeout(resolve, waitTime));
                retries--;
            }

            if (users.length === 0) {
                await connection.rollback();
                // Return a 409 Conflict status to indicate temporary unavailability
                return res.status(409).json({
                    success: false,
                    error: 'User record not yet available. Please retry.',
                    retryable: true
                });
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

    isValidStatusTransition = (currentStatus, newStatus) => {
        // If transitioning to the same status, consider it valid
        if (currentStatus === newStatus) {
            return true;
        }

        const validTransitions = {
            'active': ['liminal', 'completed'],
            'liminal': ['active', 'completed'],
            'completed': [] // Cannot transition out of completed
        };

        return validTransitions[currentStatus]?.includes(newStatus) || false;
    }

    updateConversationStatus = async (req, res, next) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const { conversationId } = req.params;
            const { status, summary } = req.body;

            // Validate the new status
            const validStatuses = ['active', 'liminal', 'completed'];
            if (!validStatuses.includes(status)) {
                throw new Error('Invalid status provided');
            }

            // Get current conversation state
            const [conversations] = await connection.execute(
                'SELECT status FROM Conversations WHERE conversation_ID = ?',
                [conversationId]
            );

            if (conversations.length === 0) {
                throw new Error(`Conversation ${conversationId} not found`);
            }

            const currentStatus = conversations[0].status;

            // Skip update if status is the same and it's not completed
            if (currentStatus === status && status !== 'completed') {
                return res.json({
                    success: true,
                    message: 'Conversation status unchanged',
                    data: {
                        status: currentStatus,
                        summary: summary || null
                    }
                });
            }

            // Validate status transition
            if (!this.isValidStatusTransition(currentStatus, status)) {
                throw new Error(`Invalid status transition from ${currentStatus} to ${status}`);
            }

            // Update conversation
            const updateData = {
                status,
                summary: summary || null,
                end_time: status === 'completed' ? formatDateForMySQL(new Date()) : null
            };

            const updateQuery = `
                UPDATE Conversations 
                SET status = ?,
                    summary = ?,
                    end_time = ?
                WHERE conversation_ID = ?
            `;

            await connection.execute(
                updateQuery,
                [updateData.status, updateData.summary, updateData.end_time, conversationId]
            );

            await connection.commit();

            res.json({
                success: true,
                message: 'Conversation status updated successfully',
                data: updateData
            });

        } catch (error) {
            await connection.rollback();
            console.error('Error in updateConversationStatus:', error);
            next(error);
        } finally {
            connection.release();
        }
    }

    getConversationMessages = async (req, res, next) => {
        try {
            const { conversationId } = req.params;

            const [messages] = await db.execute(
                `SELECT 
                    message_ID,
                    conversation_ID,
                    content,
                    sender_type,
                    timestamp,
                    emotional_state
                FROM Messages 
                WHERE conversation_ID = ?
                ORDER BY timestamp ASC`,
                [conversationId]
            );

            res.json({
                success: true,
                data: messages
            });

        } catch (error) {
            console.error('Error fetching conversation messages:', error);
            next(error);
        }
    }

    generateSummary = async (req, res, next) => {
        try {
            const { conversationId } = req.params;

            // Fetch all messages for this conversation
            const [messages] = await db.execute(
                `SELECT 
                    content,
                    sender_type,
                    emotional_state
                FROM Messages 
                WHERE conversation_ID = ?
                ORDER BY timestamp ASC`,
                [conversationId]
            );

            if (messages.length === 0) {
                return res.json({
                    success: true,
                    data: {
                        summary: "No messages in conversation."
                    }
                });
            }

            // Create a summary based on the messages
            let summary = 'Conversation Summary:\n';

            let emotionalStates = new Set();
            let userMessages = [];
            let aiResponses = [];

            messages.forEach(message => {
                if (message.emotional_state) {
                    try {
                        const state = JSON.parse(message.emotional_state);
                        if (state.state) {
                            state.state.forEach(s => emotionalStates.add(s));
                        }
                    } catch (e) {
                        console.error('Error parsing emotional state:', e);
                    }
                }

                if (message.sender_type === 'user') {
                    userMessages.push(message.content);
                } else {
                    aiResponses.push(message.content);
                }
            });

            // Add emotional states if any were detected
            if (emotionalStates.size > 0) {
                summary += `\nEmotional States Detected: ${Array.from(emotionalStates).join(', ')}\n`;
            }

            // Add key points from user messages
            summary += '\nKey Points Discussed:\n';
            userMessages.slice(-3).forEach(message => {
                summary += `- ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}\n`;
            });

            // Add main themes from AI responses
            if (aiResponses.length > 0) {
                summary += '\nMain Themes from Responses:\n';
                aiResponses.slice(-2).forEach(response => {
                    summary += `- ${response.substring(0, 100)}${response.length > 100 ? '...' : ''}\n`;
                });
            }

            res.json({
                success: true,
                data: {
                    summary
                }
            });

        } catch (error) {
            console.error('Error generating summary:', error);
            next(error);
        }
    }
}

module.exports = new ConversationController();