// __tests__/mocks/summaryService.js
const summaryService = {
    generateSummary: async (conversationId) => {
        return {
            success: true,
            summary: `Key Emotions:
• Neutral
• Calm
• Focused

Main Concerns:
• Test conversation flow
• Integration testing

Progress Made:
• Successfully established communication
• Verified message exchange

Recommendations:
• Continue testing scenarios
• Validate all endpoints`
        };
    }
};

module.exports = summaryService;