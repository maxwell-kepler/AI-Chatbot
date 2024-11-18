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
    generateSummary: async (conversationId) => {
        try {
            const db = require('../../config/database');
            const [messages] = await db.execute(
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

            if (!messages || messages.length === 0) {
                return {
                    success: false,
                    error: 'No messages found for summary generation'
                };
            }

            const conversationText = messages
                .filter(msg => msg.content && msg.content.trim())
                .map(msg => {
                    const role = msg.sender_type === 'user' ? 'User' : 'Assistant';
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
    }
};

module.exports = summaryService;