// controllers/patternController.js
const db = require('../config/database');

class PatternController {
    recordEmotionalPattern = async (req, res, next) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const { userId, patternType, patternValue, messageContent } = req.body;

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

            await connection.commit();
            res.json({
                success: true,
                message: 'Pattern recorded successfully'
            });

        } catch (error) {
            await connection.rollback();
            next(error);
        } finally {
            connection.release();
        }
    };

    getUserPatterns = async (req, res, next) => {
        try {
            const { userId } = req.params;

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

            res.json({
                success: true,
                data: patterns
            });

        } catch (error) {
            next(error);
        }
    };

    getEmotionalTrends = async (req, res, next) => {
        try {
            const { userId } = req.params;

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

            res.json({
                success: true,
                data: trends
            });

        } catch (error) {
            next(error);
        }
    };

    calculateConfidenceScore(occurrences, timeDiff) {
        const patternThreshold = 3;
        const timeWindow = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

        let confidence = Math.min((occurrences / patternThreshold) * 100, 100);
        const recencyFactor = Math.max(0, 1 - (timeDiff / timeWindow));
        confidence *= recencyFactor;

        return Math.round(confidence * 100) / 100;
    }
}

module.exports = new PatternController();