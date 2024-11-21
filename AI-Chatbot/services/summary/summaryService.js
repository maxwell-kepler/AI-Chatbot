// services/summary/summaryService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const configAPI = require('../../config/config');

const genAI = new GoogleGenerativeAI(configAPI.GEMINI_API_KEY);

const SUMMARY_PROMPT = `Analyze this mental health support conversation and create a structured summary using EXACTLY this format:

Key Emotions:
- List primary emotional states expressed
- Include at least one emotion
- Maximum 3 emotions

Main Concerns:
- List key issues or worries discussed
- Include at least one concern
- Maximum 3 concerns

Progress Made:
- Note any positive developments or insights
- Include at least one point of progress
- Maximum 3 points

Recommendations:
- Suggest next steps or helpful strategies
- Include at least one recommendation
- Maximum 3 recommendations

Use EXACTLY the section headers shown above.
Start each point with a dash (-).
Keep each point concise and clear.
If no information is available for a section, provide a reasonable default.`;

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
                    let emotionalState = null;

                    if (msg.emotional_state) {
                        try {
                            emotionalState = typeof msg.emotional_state === 'string'
                                ? JSON.parse(msg.emotional_state)
                                : msg.emotional_state;
                        } catch (e) {
                            console.warn('Error parsing emotional state:', e);
                        }
                    }

                    const emotionInfo = emotionalState?.state
                        ? ` [Emotional State: ${emotionalState.state.join(', ')}]`
                        : '';
                    return `${role}${emotionInfo}: ${msg.content}`;
                })
                .join('\n\n');

            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const prompt = `${SUMMARY_PROMPT}\n\nConversation to analyze:\n\n${conversationText}`;

            console.log('Generating summary with prompt length:', prompt.length);

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const summary = response.text();

            console.log('Generated raw summary:', summary);

            if (!summary || summary.trim().length === 0) {
                throw new Error('Generated summary is empty');
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