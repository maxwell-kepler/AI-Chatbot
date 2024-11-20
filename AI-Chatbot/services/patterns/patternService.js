// services/patterns/patternService.js
const db = require('../../config/database');

class PatternService {
    constructor() {
        this.patternThreshold = 3;
        this.timeWindow = 7 * 24 * 60 * 60 * 1000;
    }

    async recordEmotionalState(userId, emotionalState, messageContent) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const emotions = Array.isArray(emotionalState.state)
                ? emotionalState.state
                : [emotionalState.state];

            for (const emotion of emotions) {
                await this.updateEmotionalPattern(
                    connection,
                    userId,
                    'emotion',
                    emotion.toLowerCase()
                );
            }

            const patterns = await this.analyzeContentPatterns(messageContent);
            for (const pattern of patterns) {
                await this.updateEmotionalPattern(
                    connection,
                    userId,
                    pattern.type,
                    pattern.value
                );
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            console.error('Error recording emotional pattern:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async updateEmotionalPattern(connection, userId, patternType, patternValue) {
        const [existing] = await connection.execute(
            `SELECT pattern_ID, occurrence_count, first_detected 
             FROM Emotional_Patterns 
             WHERE user_ID = ? 
             AND pattern_type = ? 
             AND pattern_value = ?`,
            [userId, patternType, patternValue]
        );

        if (existing.length > 0) {
            const pattern = existing[0];
            const timeDiff = Date.now() - pattern.first_detected.getTime();

            const confidenceScore = this.calculateConfidenceScore(
                pattern.occurrence_count + 1,
                timeDiff
            );

            await connection.execute(
                `UPDATE Emotional_Patterns 
                 SET occurrence_count = occurrence_count + 1,
                     last_detected = CURRENT_TIMESTAMP,
                     confidence_score = ?
                 WHERE pattern_ID = ?`,
                [confidenceScore, pattern.pattern_ID]
            );
        } else {
            await connection.execute(
                `INSERT INTO Emotional_Patterns 
                 (user_ID, pattern_type, pattern_value, confidence_score)
                 VALUES (?, ?, ?, ?)`,
                [userId, patternType, patternValue, 1.0]
            );
        }
    }

    calculateConfidenceScore(occurrences, timeDiff) {
        let confidence = Math.min((occurrences / this.patternThreshold) * 100, 100);

        const recencyFactor = Math.max(0, 1 - (timeDiff / this.timeWindow));
        confidence *= recencyFactor;

        return Math.round(confidence * 100) / 100;
    }

    async analyzeContentPatterns(content) {
        const patterns = [];
        if (!content) return patterns;

        const lowercaseContent = content.toLowerCase();

        if (lowercaseContent.match(/can't sleep|insomnia|nighttime|sleeping/)) {
            patterns.push({ type: 'sleep', value: 'disturbed_sleep' });
        }

        if (lowercaseContent.match(/lonely|alone|isolated|no friends/)) {
            patterns.push({ type: 'social', value: 'isolation' });
        }

        if (lowercaseContent.match(/work|job|career|boss|coworker/)) {
            patterns.push({ type: 'stressor', value: 'work_related' });
        }

        if (lowercaseContent.match(/relationship|partner|spouse|marriage/)) {
            patterns.push({ type: 'relationship', value: 'relationship_concerns' });
        }

        return patterns;
    }

    async getUserPatterns(userId) {
        try {
            const [patterns] = await db.execute(
                `SELECT 
                    pattern_type,
                    pattern_value,
                    occurrence_count,
                    confidence_score,
                    first_detected,
                    last_detected
                FROM Emotional_Patterns
                WHERE user_ID = ?
                AND confidence_score >= 50
                AND last_detected >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                ORDER BY confidence_score DESC, occurrence_count DESC`,
                [userId]
            );

            return {
                success: true,
                data: patterns
            };
        } catch (error) {
            console.error('Error fetching user patterns:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getEmotionalTrends(userId) {
        try {
            const [trends] = await db.execute(
                `SELECT 
                    pattern_value as emotion,
                    COUNT(*) as frequency,
                    DATE(first_detected) as first_seen,
                    DATE(last_detected) as last_seen
                FROM Emotional_Patterns
                WHERE user_ID = ?
                AND pattern_type = 'emotion'
                GROUP BY pattern_value
                ORDER BY frequency DESC`,
                [userId]
            );

            return {
                success: true,
                data: trends
            };
        } catch (error) {
            console.error('Error fetching emotional trends:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new PatternService();