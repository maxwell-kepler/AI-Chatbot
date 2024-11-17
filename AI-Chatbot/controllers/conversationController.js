// controllers/conversationController.js
const db = require('../config/database');
const { formatDateForMySQL } = require('../utils/dateFormatter');
const summaryService = require('../services/summary/summaryService');
const { parseSummary } = require('../utils/summaryParser');

class ConversationController {
    constructor() {
        // Bind all methods to ensure proper 'this' context
        this.createConversation = this.createConversation.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.updateConversationStatus = this.updateConversationStatus.bind(this);
        this.getConversationMessages = this.getConversationMessages.bind(this);
        this.generateSummary = this.generateSummary.bind(this);
    }

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

    // Get messages method
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
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const { conversationId } = req.params;

            // Fetch messages
            const [messages] = await connection.execute(
                `SELECT 
                    content,
                    sender_type,
                    emotional_state,
                    timestamp
                FROM Messages 
                WHERE conversation_ID = ?
                ORDER BY timestamp ASC`,
                [conversationId]
            );

            if (messages.length === 0) {
                await connection.rollback();
                return res.json({
                    success: true,
                    data: {
                        summary: "No messages in conversation."
                    }
                });
            }

            // Generate AI summary
            const aiSummaryResult = await summaryService.generateSummary(messages);

            if (!aiSummaryResult.success) {
                throw new Error('Failed to generate AI summary');
            }

            // Parse the summary into structured format
            const parsedResult = parseSummary(aiSummaryResult.summary);

            if (!parsedResult.success) {
                throw new Error('Failed to parse summary structure');
            }

            // Save structured summary
            const [dbInsertResult] = await connection.execute(
                `INSERT INTO Conversation_Summaries 
                (conversation_ID, emotions, main_concerns, progress_notes, 
                recommendations, raw_summary)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    conversationId,
                    JSON.stringify(parsedResult.parsed.emotions),
                    JSON.stringify(parsedResult.parsed.main_concerns),
                    JSON.stringify(parsedResult.parsed.progress_notes),
                    JSON.stringify(parsedResult.parsed.recommendations),
                    parsedResult.raw
                ]
            );

            // Update conversation with summary reference
            await connection.execute(
                'UPDATE Conversations SET summary_ID = ? WHERE conversation_ID = ?',
                [dbInsertResult.insertId, conversationId]
            );

            await connection.commit();

            res.json({
                success: true,
                data: {
                    summary: parsedResult.raw,
                    structured: parsedResult.parsed
                }
            });

        } catch (error) {
            await connection.rollback();
            console.error('Error generating structured summary:', error);
            next(error);
        } finally {
            connection.release();
        }
    }
}

module.exports = new ConversationController();