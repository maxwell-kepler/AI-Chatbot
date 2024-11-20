// services/emotion/emotionDetectionService.js
import { MOOD_PATTERNS, CRISIS_KEYWORDS } from '../../config/promptConfig';

class EmotionDetectionService {
    detectEmotionalState(message) {
        if (!message) return { state: ['neutral'], requiresAlert: false };

        const lowercaseMessage = message.toLowerCase();
        const detectedStates = [];

        if (CRISIS_KEYWORDS.some(keyword => lowercaseMessage.includes(keyword))) {
            return {
                state: ['crisis'],
                requiresAlert: true
            };
        }

        Object.entries(MOOD_PATTERNS).forEach(([category, patterns]) => {
            if (patterns.some(pattern => lowercaseMessage.includes(pattern))) {
                detectedStates.push(category);
            }
        });

        const intensity = this.analyzeIntensity(lowercaseMessage);

        return {
            state: detectedStates.length > 0 ? detectedStates : ['neutral'],
            intensity,
            requiresAlert: false
        };
    }

    analyzeIntensity(message) {
        const intensifiers = ['very', 'extremely', 'really', 'so', 'totally', 'completely'];
        const intensityScore = intensifiers.reduce((score, word) => {
            return score + (message.includes(word) ? 1 : 0);
        }, 1); // Base intensity of 1

        if (intensityScore >= 3) return 'high';
        if (intensityScore >= 2) return 'moderate';
        return 'low';
    }
}

module.exports = new EmotionDetectionService();