// controllers/trackingController.js
const db = require('../config/database');

class TrackingController {
    getEmotionalHistory = async (req, res, next) => {
        try {
            const { firebaseId } = req.params;
            console.log('Fetching emotional history for firebaseId:', firebaseId);

            const [users] = await db.execute(
                'SELECT user_ID FROM Users WHERE firebase_ID = ?',
                [firebaseId]
            );

            if (users.length === 0) {
                console.log('No user found for firebaseId:', firebaseId);
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            const userId = users[0].user_ID;
            console.log('Found userId:', userId);

            const query = `
                SELECT m.emotional_state, m.timestamp
                FROM Messages m
                JOIN Conversations c ON m.conversation_ID = c.conversation_ID
                WHERE c.user_ID = ? AND m.emotional_state IS NOT NULL
                ORDER BY m.timestamp DESC
                LIMIT 100
            `;

            console.log('Executing query:', query);
            const [messages] = await db.execute(query, [userId]);
            console.log('Retrieved messages:', messages);

            const emotionalData = messages.map(msg => {
                let emotionalState;
                if (msg.emotional_state) {
                    try {
                        emotionalState = typeof msg.emotional_state === 'string'
                            ? JSON.parse(msg.emotional_state)
                            : msg.emotional_state;
                    } catch (e) {
                        console.warn('Error parsing emotional state:', e);
                        emotionalState = { state: ['unknown'] };
                    }
                } else {
                    emotionalState = { state: ['unknown'] };
                }

                return {
                    timestamp: msg.timestamp,
                    emotionalState
                };
            });

            console.log('Sending processed emotional data:', emotionalData);

            res.json({
                success: true,
                data: emotionalData
            });

        } catch (error) {
            console.error('Error in getEmotionalHistory:', error);
            next(error);
        }
    };

    getConversationSummaries = async (req, res, next) => {
        try {
            const { firebaseId } = req.params;
            console.log('Fetching summaries for firebaseId:', firebaseId);

            const [users] = await db.execute(
                'SELECT user_ID FROM Users WHERE firebase_ID = ?',
                [firebaseId]
            );

            if (users.length === 0) {
                console.log('No user found for firebaseId:', firebaseId);
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            const userId = users[0].user_ID;
            console.log('Found userId:', userId);

            const query = `
            SELECT 
                c.conversation_ID,
                c.start_time,
                c.end_time,
                c.risk_level,
                cs.emotions,
                cs.main_concerns,
                cs.progress_notes,
                cs.recommendations,
                cs.raw_summary
            FROM Conversations c
            LEFT JOIN Conversation_Summaries cs ON c.conversation_ID = cs.conversation_ID
            WHERE c.user_ID = ? AND c.status = 'completed'
            ORDER BY c.end_time DESC
            LIMIT 10
        `;

            console.log('Executing query:', query);
            console.log('With userId:', userId);

            const [summaries] = await db.execute(query, [userId]);
            console.log('Retrieved summaries:', summaries);

            const processedSummaries = summaries.map(summary => {
                const processed = {
                    ...summary,
                    raw_summary: summary.raw_summary || 'No summary available'
                };

                ['emotions', 'main_concerns', 'progress_notes', 'recommendations'].forEach(field => {
                    try {
                        processed[field] = summary[field] ? JSON.parse(summary[field]) : [];
                    } catch (e) {
                        console.warn(`Error parsing ${field} for conversation ${summary.conversation_ID}:`, e);
                        processed[field] = [];
                    }
                });

                return processed;
            });

            console.log('Sending processed summaries:', processedSummaries);

            res.json({
                success: true,
                data: processedSummaries
            });

        } catch (error) {
            console.error('Error in getConversationSummaries:', error);
            next(error);
        }
    };

    getEmotionalPatterns = async (req, res, next) => {
        try {
            const { firebaseId } = req.params;

            const [users] = await db.execute(
                'SELECT user_ID FROM Users WHERE firebase_ID = ?',
                [firebaseId]
            );

            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            const userId = users[0].user_ID;

            const [patterns] = await db.execute(`
                SELECT 
                    pattern_type,
                    pattern_value,
                    occurrence_count,
                    confidence_score,
                    first_detected,
                    last_detected
                FROM Emotional_Patterns
                WHERE user_ID = ?
                ORDER BY occurrence_count DESC
            `, [userId]);

            if (!patterns.length) {
                return res.json({
                    success: true,
                    data: []
                });
            }

            res.json({
                success: true,
                data: patterns.map(pattern => ({
                    ...pattern,
                    occurrence_count: Number(pattern.occurrence_count),
                    confidence_score: Number(pattern.confidence_score)
                }))
            });

        } catch (error) {
            next(error);
        }
    };
}

module.exports = new TrackingController();