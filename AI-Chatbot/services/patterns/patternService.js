// services/patterns/patternService.js
const { API_URL } = require("../../config/api.server");

const patternService = {
    recordEmotionalState: async (userId, emotionalState, messageContent) => {
        try {
            const patterns = emotionalState.state.map(emotion => ({
                patternType: 'emotion',
                patternValue: emotion,
            }));

            const results = await Promise.all(patterns.map(async pattern => {
                const response = await fetch(`${API_URL}/patterns/record`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        patternType: pattern.patternType,
                        patternValue: pattern.patternValue,
                        messageContent
                    })
                });

                if (!response.ok) {
                    throw new Error(`Failed to record pattern: ${pattern.patternValue}`);
                }

                return response.json();
            }));

            return {
                success: true,
                data: results
            };
        } catch (error) {
            console.error('Error in recordEmotionalState:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    getUserPatterns: async (userId) => {
        try {
            const response = await fetch(`${API_URL}/patterns/user/${userId}/patterns`);

            if (!response.ok) {
                throw new Error('Failed to fetch user patterns');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching patterns:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    getEmotionalTrends: async (userId) => {
        try {
            const response = await fetch(`${API_URL}/patterns/user/${userId}/trends`);

            if (!response.ok) {
                throw new Error('Failed to fetch emotional trends');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching trends:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
};

module.exports = patternService;