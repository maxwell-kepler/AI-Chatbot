// controllers/conversationController.js
const db = require('../config/database');
const { formatDateForMySQL, getCurrentTime } = require('../utils/dateFormatter');
const summaryService = require('../services/summary/summaryService');
const patternService = require('../services/patterns/patternService');
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
        if (process.env.NODE_ENV !== 'test') {
            console.log('Create conversation request received:', req.body);
        }
        try {
            await connection.beginTransaction();

            const { userId: firebaseId, status } = req.body;
            const startTime = formatDateForMySQL(new Date());

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

                if (process.env.NODE_ENV !== 'test') {
                    console.log(`User lookup attempt (${retries} retries left):`, {
                        firebaseId,
                        found: users.length > 0
                    });
                }

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
            if (process.env.NODE_ENV !== 'test') {
                console.log('Creating conversation with:', {
                    mysqlUserId,
                    status,
                    startTime: formattedStartTime
                });
            }

            const [result] = await connection.execute(
                `INSERT INTO Conversations 
                (user_ID, status, start_time) 
                VALUES (?, ?, ?)`,
                [
                    mysqlUserId,
                    status || 'active',
                    getCurrentTime()
                ]
            );
            await connection.commit();

            const response = {
                success: true,
                message: 'Conversation created successfully',
                conversationId: result.insertId,
                startTime
            };

            if (process.env.NODE_ENV !== 'test') {
                console.log('Conversation created successfully:', response);
            }
            res.status(201).json(response);

        } catch (error) {
            await connection.rollback();
            if (process.env.NODE_ENV !== 'test') {
                console.error('Error in createConversation:', error);
            }
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

            if (!content || content.trim().length === 0) {
                await connection.rollback();
                return res.status(500).json({
                    success: false,
                    error: 'Message content cannot be empty'
                });
            }

            // Get user ID for the conversation first
            const [conversations] = await connection.execute(
                'SELECT user_ID FROM Conversations WHERE conversation_ID = ?',
                [conversationId]
            );

            if (conversations.length === 0) {
                throw new Error(`Conversation ${conversationId} not found`);
            }

            const userId = conversations[0].user_ID;

            // Add the message
            const [result] = await connection.execute(
                `INSERT INTO Messages 
                (conversation_ID, content, sender_type, emotional_state, timestamp) 
                VALUES (?, ?, ?, ?, ?)`,
                [
                    conversationId,
                    content,
                    senderType,
                    emotionalState ? JSON.stringify(emotionalState) : null,
                    formatDateForMySQL(timestamp || new Date())
                ]
            );

            // Only record patterns for user messages with emotional state
            if (senderType === 'user' && emotionalState) {
                try {
                    const patternResult = await patternService.recordEmotionalState(
                        userId,
                        emotionalState,
                        content
                    );

                    if (!patternResult.success) {
                        console.warn('Failed to record emotional pattern:', patternResult.error);
                    }
                } catch (patternError) {
                    console.error('Error recording pattern:', patternError);
                }
            }

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
                    timestamp: formatDateForMySQL(timestamp || new Date())
                }
            });

        } catch (error) {
            await connection.rollback();
            next(error);
        } finally {
            connection.release();
        }
    };

    isValidStatusTransition = (currentStatus, newStatus) => {
        // If transitioning to the same status, consider it valid
        if (currentStatus === newStatus) {
            return true;
        }

        const validTransitions = {
            'active': ['liminal', 'completed'],
            'liminal': ['active', 'completed'],
            'completed': ['active', 'liminal']
        };

        return validTransitions[currentStatus]?.includes(newStatus) || false;
    }

    updateConversationStatus = async (req, res, next) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const { conversationId } = req.params;
            const { status } = req.body;

            // Validate the new status
            const validStatuses = ['active', 'liminal', 'completed'];
            if (!validStatuses.includes(status)) {
                throw new Error('Invalid status provided');
            }

            // Get current conversation state
            const [conversations] = await connection.execute(
                'SELECT status, end_time FROM Conversations WHERE conversation_ID = ?',
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
                    data: { status: currentStatus }
                });
            }

            // Validate status transition
            if (!this.isValidStatusTransition(currentStatus, status)) {
                throw new Error(`Invalid status transition from ${currentStatus} to ${status}`);
            }

            // Special handling for completion
            if (status === 'completed') {
                await connection.execute(
                    `UPDATE Conversations 
                    SET status = ?, 
                        end_time = ? 
                    WHERE conversation_ID = ?`,
                    [
                        status,
                        getCurrentTime(),
                        conversationId
                    ]
                );

                // Generate and store final summary
                const summaryResult = await summaryService.generateSummary(conversationId);
                if (summaryResult.success) {
                    const parsedSummary = parseSummary(summaryResult.summary);
                    if (parsedSummary.success) {
                        console.log('Storing parsed summary:', parsedSummary);

                        const emotions = JSON.stringify(parsedSummary.parsed.emotions || []);
                        const mainConcerns = JSON.stringify(parsedSummary.parsed.main_concerns || []);
                        const progressNotes = JSON.stringify(parsedSummary.parsed.progress_notes || []);
                        const recommendations = JSON.stringify(parsedSummary.parsed.recommendations || []);

                        await connection.execute(
                            `INSERT INTO Conversation_Summaries 
                            (conversation_ID, emotions, main_concerns, progress_notes, 
                            recommendations, raw_summary)
                            VALUES (?, ?, ?, ?, ?, ?)`,
                            [
                                conversationId,
                                emotions,
                                mainConcerns,
                                progressNotes,
                                recommendations,
                                summaryResult.summary
                            ]
                        );
                        console.log('Successfully stored summary in database');
                    } else {
                        console.error('Failed to parse summary:', parsedSummary.error);
                    }
                } else {
                    console.error('Failed to generate summary:', summaryResult.error);
                }
            } else {
                // Regular status update
                await connection.execute(
                    'UPDATE Conversations SET status = ?, end_time = NULL WHERE conversation_ID = ?',
                    [status, conversationId]
                );
            }

            await connection.commit();

            res.json({
                success: true,
                message: 'Conversation status updated successfully',
                data: {
                    status,
                    end_time: status === 'completed' ? new Date().toISOString() : null
                }
            });

        } catch (error) {
            await connection.rollback();
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
            if (process.env.NODE_ENV !== 'test') {
                console.error('Error fetching conversation messages:', error);
            }
            next(error);
        }
    }


    generateSummary = async (req, res, next) => {
        try {
            const { conversationId } = req.params;

            // Generate AI summary using the updated service
            const summaryResult = await summaryService.generateSummary(conversationId);

            if (!summaryResult.success) {
                throw new Error(summaryResult.error || 'Failed to generate summary');
            }

            // Parse the summary
            const parsedResult = parseSummary(summaryResult.summary);

            if (!parsedResult.success) {
                throw new Error('Failed to parse summary structure');
            }

            const connection = await db.getConnection();
            try {
                await connection.beginTransaction();

                // Save new summary
                await connection.execute(
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
                throw error;
            } finally {
                connection.release();
            }
        } catch (error) {
            next(error);
        }
    }

    getLatestSummary = async (req, res, next) => {
        try {
            const { conversationId } = req.params;

            const [summaries] = await db.execute(
                `SELECT * FROM Conversation_Summaries 
                WHERE conversation_ID = ?
                ORDER BY created_at DESC
                LIMIT 1`,
                [conversationId]
            );

            res.json({
                success: true,
                data: summaries[0] || null
            });

        } catch (error) {
            next(error);
        }
    }

    recordCrisisEvent = async (req, res, next) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const { conversationId } = req.params;
            const { userId: firebaseId, severityLevel, notes, actionTaken, timestamp } = req.body;

            const [users] = await connection.execute(
                'SELECT user_ID FROM Users WHERE firebase_ID = ?',
                [firebaseId]
            );

            if (users.length === 0) {
                throw new Error('User not found');
            }

            const mysqlUserId = users[0].user_ID;

            const [result] = await connection.execute(
                `INSERT INTO Crisis_Events 
                (conversation_ID, user_ID, severity_level, action_taken, timestamp)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    conversationId,
                    mysqlUserId,
                    severityLevel,
                    actionTaken || 'Crisis resources provided', // Default action
                    formatDateForMySQL(timestamp)
                ]
            );

            await connection.commit();

            res.status(201).json({
                success: true,
                data: {
                    eventId: result.insertId,
                    conversationId,
                    severityLevel,
                    timestamp
                }
            });

        } catch (error) {
            await connection.rollback();
            next(error);
        } finally {
            connection.release();
        }
    }

    updateCrisisResolution = async (req, res, next) => {
        const connection = await db.getConnection();
        try {
            const { conversationId, eventId } = req.params;
            const { resolutionNotes, actionTaken } = req.body;

            const [result] = await connection.execute(
                `UPDATE Crisis_Events 
                SET resolution_notes = ?,
                    action_taken = ?,
                    resolved_at = CURRENT_TIMESTAMP
                WHERE event_ID = ? AND conversation_ID = ?`,
                [resolutionNotes, actionTaken, eventId, conversationId]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Crisis event not found'
                });
            }

            res.json({
                success: true,
                message: 'Crisis resolution updated successfully'
            });

        } catch (error) {
            next(error);
        } finally {
            connection.release();
        }
    }

    getCrisisEvents = async (req, res, next) => {
        try {
            const { conversationId } = req.params;

            const [events] = await db.execute(
                `SELECT 
                    event_ID,
                    severity_level,
                    action_taken,
                    timestamp,
                    resolution_notes,
                    resolved_at
                FROM Crisis_Events 
                WHERE conversation_ID = ?
                ORDER BY timestamp DESC`,
                [conversationId]
            );

            res.json({
                success: true,
                data: events
            });

        } catch (error) {
            next(error);
        }
    }

    updateRiskLevel = async (req, res, next) => {
        const connection = await db.getConnection();
        try {
            const { conversationId } = req.params;
            const { riskLevel } = req.body;

            if (!['low', 'medium', 'high'].includes(riskLevel)) {
                throw new Error('Invalid risk level');
            }

            await connection.execute(
                'UPDATE Conversations SET risk_level = ? WHERE conversation_ID = ?',
                [riskLevel, conversationId]
            );

            res.json({
                success: true,
                data: {
                    conversationId,
                    riskLevel
                }
            });

        } catch (error) {
            next(error);
        } finally {
            connection.release();
        }
    }
}

module.exports = new ConversationController();