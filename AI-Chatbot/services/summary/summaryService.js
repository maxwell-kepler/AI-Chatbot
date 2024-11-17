// services/summary/summaryService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const configAPI = require('../../config/config');

const genAI = new GoogleGenerativeAI(configAPI.GEMINI_API_KEY);

const SUMMARY_PROMPT = `Create a structured summary of this mental health support conversation using exactly the following format:

Key Emotions:
• List 3-5 primary emotions expressed during the conversation, in order of prominence

Main Concerns:
• Extract 2-3 key issues or concerns discussed
• Focus on the most significant topics only

Progress Made:
• Identify any notable insights gained or positive developments
• Note any shifts in perspective or understanding

Recommendations:
• List specific actions or strategies suggested
• Include any resources recommended

Keep each section concise but informative. Use bullet points as shown above.
Maintain a compassionate but professional tone.

Here's the conversation to summarize:`;

const summaryService = {
    generateSummary: async (messages) => {
        try {
            // Pre-process messages to help with context
            const conversationText = messages
                .filter(msg => msg.content && msg.content.trim()) // Remove empty messages
                .map(msg => {
                    const role = msg.sender_type === 'user' ? 'User' : 'Assistant';
                    // Include emotional state if available
                    const emotionalState = msg.emotional_state
                        ? JSON.parse(msg.emotional_state)
                        : null;
                    const emotionInfo = emotionalState
                        ? ` [Emotional State: ${emotionalState.state.join(', ')}]`
                        : '';
                    return `${role}${emotionInfo}: ${msg.content}`;
                })
                .join('\n\n');

            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const prompt = `${SUMMARY_PROMPT}\n\n${conversationText}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const summary = response.text();

            // Validate summary structure
            const requiredSections = ['Key Emotions:', 'Main Concerns:', 'Progress Made:', 'Recommendations:'];
            const hasSections = requiredSections.every(section => summary.includes(section));

            if (!hasSections) {
                // If AI didn't follow format, try to restructure it
                return {
                    success: false,
                    error: 'Summary format validation failed'
                };
            }

            return {
                success: true,
                summary
            };
        } catch (error) {
            console.error('Error generating AI summary:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Fallback method if AI summary fails
    generateBasicSummary: (messages) => {
        try {
            let summary = 'Key Emotions:\n';

            // Extract emotions from emotional states
            const emotions = new Set();
            messages.forEach(msg => {
                if (msg.emotional_state) {
                    try {
                        const state = JSON.parse(msg.emotional_state);
                        state.state.forEach(emotion => emotions.add(emotion));
                    } catch (e) { }
                }
            });
            summary += `• ${Array.from(emotions).slice(0, 5).join(', ') || 'No specific emotions detected'}\n\n`;

            // Get last few user messages for concerns
            summary += 'Main Concerns:\n';
            const userMessages = messages
                .filter(msg => msg.sender_type === 'user')
                .slice(-3);
            userMessages.forEach(msg => {
                summary += `• ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}\n`;
            });

            // Basic progress and recommendations sections
            summary += '\nProgress Made:\n• Conversation initiated and concerns shared\n';
            summary += '\nRecommendations:\n• Continue engaging with support services\n';

            return {
                success: true,
                summary
            };
        } catch (error) {
            console.error('Error generating basic summary:', error);
            return {
                success: false,
                error: 'Failed to generate even basic summary'
            };
        }
    }
};

module.exports = summaryService;