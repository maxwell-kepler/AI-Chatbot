// src/services/promptService.js
import {
    MOOD_PATTERNS,
    CRISIS_RESOURCES,
    CRISIS_PROMPT,
    WELCOME_MESSAGE,
    SYSTEM_PROMPT,
    CRISIS_KEYWORDS
} from '../config/promptConfig';

class PromptEngineering {
    constructor() {
        this.conversationHistory = [];
        this.userProfile = {
            detectedPatterns: [],
            riskLevel: 'normal',
            previousTopics: new Set(),
            emotionalTrends: {},
            lastUpdate: new Date(),
            // Track different types of patterns
            patternCounts: {
                emotional: {},     // Basic emotions
                stressors: {},    // Calgary-specific stressors
                community: {},     // Community-based patterns
                resources: {}      // Resource-matching patterns
            }
        };
    }

    getWelcomeMessage() {
        return WELCOME_MESSAGE;
    }

    detectEmotionalState(message) {
        if (!message) return { state: ['neutral'], requiresAlert: false };

        const lowercaseMessage = message.toLowerCase();
        const detectedStates = [];

        // Check for crisis keywords
        if (CRISIS_KEYWORDS.some(keyword => lowercaseMessage.includes(keyword))) {
            return {
                state: ['crisis'],
                requiresAlert: true
            };
        }

        // Check all pattern categories
        Object.entries(MOOD_PATTERNS).forEach(([category, patterns]) => {
            if (patterns.some(pattern => lowercaseMessage.includes(pattern))) {
                detectedStates.push(category);

                // Update pattern counts based on category
                if (['anxiety', 'depression', 'anger', 'grief'].includes(category)) {
                    this.userProfile.patternCounts.emotional[category] =
                        (this.userProfile.patternCounts.emotional[category] || 0) + 1;
                } else if (['weather', 'economic', 'lifestyle', 'housing', 'health'].includes(category)) {
                    this.userProfile.patternCounts.stressors[category] =
                        (this.userProfile.patternCounts.stressors[category] || 0) + 1;
                } else if (['isolation', 'cultural', 'seasonal', 'social'].includes(category)) {
                    this.userProfile.patternCounts.community[category] =
                        (this.userProfile.patternCounts.community[category] || 0) + 1;
                } else if (['immediate_help', 'professional', 'community', 'lifestyle', 'practical'].includes(category)) {
                    this.userProfile.patternCounts.resources[category] =
                        (this.userProfile.patternCounts.resources[category] || 0) + 1;
                }
            }
        });

        return {
            state: detectedStates.length > 0 ? detectedStates : ['neutral'],
            requiresAlert: false
        };
    }

    getEmotionalInsights() {
        return {
            currentState: this.userProfile.detectedPatterns[this.userProfile.detectedPatterns.length - 1] || 'neutral',
            messageCount: this.conversationHistory.length,
            riskLevel: this.userProfile.riskLevel,
            recentPatterns: this.userProfile.detectedPatterns.slice(-5) || [],
            emotionalTrends: this.userProfile.emotionalTrends || {},
            patternCounts: this.userProfile.patternCounts,
            timeSinceStart: (new Date() - this.userProfile.lastUpdate) / 1000
        };
    }


    async generatePrompt(message) {
        if (!message) {
            return {
                prompt: SYSTEM_PROMPT,
                isCrisis: false,
                emotionalState: ['neutral'],
                resources: null
            };
        }

        const emotionalState = this.detectEmotionalState(message);

        // Update user profile
        this.userProfile.detectedPatterns.push(emotionalState.state);

        // Handle crisis situation with more urgent prompt
        if (emotionalState.requiresAlert) {
            return {
                prompt: `${SYSTEM_PROMPT}\n\n${CRISIS_PROMPT}
      
      User message: ${message}`,
                isCrisis: true,
                resources: CRISIS_RESOURCES
            };
        }

        let contextualPrompt = `${SYSTEM_PROMPT}\n\nCurrent emotional state: ${emotionalState.state.join(', ')}\n`;

        if (this.conversationHistory.length > 0) {
            contextualPrompt += '\nRecent context:\n';
            this.conversationHistory.slice(-3).forEach(exchange => {
                contextualPrompt += `User: ${exchange.user}\nAssistant: ${exchange.assistant}\n`;
            });
        }

        contextualPrompt += `\nUser: ${message}`;

        return {
            prompt: contextualPrompt,
            isCrisis: false,
            emotionalState: emotionalState.state,
            resources: null
        };
    }

    updateConversationHistory(userMessage, assistantResponse) {
        if (!userMessage || !assistantResponse) return;

        this.conversationHistory.push({
            user: userMessage,
            assistant: assistantResponse,
            timestamp: new Date()
        });

        if (this.conversationHistory.length > 10) {
            this.conversationHistory.shift();
        }
    }
}

export default new PromptEngineering();