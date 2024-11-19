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

    parseRawSummary = (rawSummary) => {
        if (!rawSummary) return null;

        const sections = {
            emotions: [],
            main_concerns: [],
            progress_notes: [],
            recommendations: []
        };

        try {
            // Split by sections (double asterisks)
            const parts = rawSummary.split('**');

            let currentSection = null;

            parts.forEach(part => {
                const trimmedPart = part.trim();

                // Identify section
                if (trimmedPart.toLowerCase().includes('key emotions:')) {
                    currentSection = 'emotions';
                } else if (trimmedPart.toLowerCase().includes('main concerns:')) {
                    currentSection = 'main_concerns';
                } else if (trimmedPart.toLowerCase().includes('progress made:')) {
                    currentSection = 'progress_notes';
                } else if (trimmedPart.toLowerCase().includes('recommendations:')) {
                    currentSection = 'recommendations';
                } else if (currentSection && trimmedPart) {
                    // Parse bullet points
                    const points = trimmedPart
                        .split('\n')
                        .map(line => line.trim())
                        .filter(line => line.startsWith('-'))
                        .map(line => line.replace(/^-\s*/, '').trim())
                        .filter(line => line.length > 0);

                    if (points.length > 0) {
                        sections[currentSection].push(...points);
                    }
                }
            });

            return sections;
        } catch (error) {
            console.error('Error parsing raw summary:', error);
            return null;
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
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            const userId = users[0].user_ID;

            const query = `
                WITH RankedSummaries AS (
                    SELECT 
                        c.conversation_ID,
                        c.start_time,
                        c.end_time,
                        c.risk_level,
                        c.status,
                        cs.emotions,
                        cs.main_concerns,
                        cs.progress_notes,
                        cs.recommendations,
                        cs.raw_summary,
                        ROW_NUMBER() OVER (
                            PARTITION BY c.conversation_ID 
                            ORDER BY cs.created_at DESC
                        ) as rn
                    FROM Conversations c
                    LEFT JOIN Conversation_Summaries cs ON c.conversation_ID = cs.conversation_ID
                    WHERE c.user_ID = ? AND c.status = 'completed'
                )
                SELECT *
                FROM RankedSummaries
                WHERE rn = 1
                ORDER BY end_time DESC
                LIMIT 10
            `;

            const [summaries] = await db.execute(query, [userId]);

            console.log(`Found ${summaries.length} unique conversations`);

            const processedSummaries = summaries
                .filter(summary => summary.raw_summary)
                .map(summary => {
                    const safeParseJSON = (field, fieldName) => {
                        if (!field || field === '') return [];
                        try {
                            const parsed = JSON.parse(field);
                            return Array.isArray(parsed) ? parsed : [parsed];
                        } catch (e) {
                            console.log(`Error parsing ${fieldName}, will use raw summary parsing instead`);
                            return [];
                        }
                    };

                    let processed = {
                        conversation_ID: summary.conversation_ID,
                        start_time: summary.start_time,
                        end_time: summary.end_time,
                        risk_level: summary.risk_level,
                        emotions: safeParseJSON(summary.emotions, 'emotions'),
                        main_concerns: safeParseJSON(summary.main_concerns, 'main_concerns'),
                        progress_notes: safeParseJSON(summary.progress_notes, 'progress_notes'),
                        recommendations: safeParseJSON(summary.recommendations, 'recommendations'),
                        raw_summary: summary.raw_summary || 'No summary available'
                    };

                    if (processed.emotions.length === 0 &&
                        processed.main_concerns.length === 0 &&
                        processed.progress_notes.length === 0 &&
                        processed.recommendations.length === 0) {

                        const parsedRawSummary = this.parseRawSummary(summary.raw_summary);
                        if (parsedRawSummary) {
                            processed = {
                                ...processed,
                                ...parsedRawSummary
                            };
                        }
                    }

                    return processed;
                });

            console.log(`Processed ${processedSummaries.length} summaries`);

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

    getCrisisEvents = async (req, res, next) => {
        try {
            const { firebaseId } = req.params;
            console.log('Fetching crisis events for firebaseId:', firebaseId);

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

            const query = `
                SELECT 
                    ce.event_ID,
                    ce.conversation_ID,
                    ce.severity_level,
                    ce.action_taken,
                    ce.timestamp,
                    ce.resolution_notes,
                    ce.resolved_at,
                    c.risk_level as conversation_risk_level
                FROM Crisis_Events ce
                JOIN Conversations c ON ce.conversation_ID = c.conversation_ID
                WHERE ce.user_ID = ?
                ORDER BY ce.timestamp DESC
            `;

            const [events] = await db.execute(query, [userId]);

            console.log(`Found ${events.length} crisis events for user`);

            res.json({
                success: true,
                data: events
            });

        } catch (error) {
            console.error('Error in getCrisisEvents:', error);
            next(error);
        }
    };

    getResourceAccessHistory = async (req, res, next) => {
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

            const query = `
                SELECT 
                    ab.access_time,
                    ab.referral_source,
                    r.name as resource_name,
                    r.website_URL,
                    c.name as category_name,
                    c.icon as category_icon
                FROM Accessed_By ab
                JOIN Resources r ON ab.resource_ID = r.resource_ID
                JOIN Categories c ON r.category_ID = c.category_ID
                WHERE ab.user_ID = ?
                ORDER BY ab.access_time DESC
                LIMIT 50
            `;

            const [accessHistory] = await db.execute(query, [userId]);

            res.json({
                success: true,
                data: accessHistory
            });

        } catch (error) {
            console.error('Error fetching resource access history:', error);
            next(error);
        }
    };
}

module.exports = new TrackingController();