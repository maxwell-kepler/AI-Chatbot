// services/patterns/patternService.js
const { API_URL } = require("../../config/api.server");

const patternService = {
    recordPattern: async (userId, patternType, patternValue, messageContent) => {
        try {
            const response = await fetch(`${API_URL}/patterns/record`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    patternType,
                    patternValue,
                    messageContent
                })
            });

            if (!response.ok) {
                throw new Error('Failed to record pattern');
            }

            return await response.json();
        } catch (error) {
            console.error('Error recording pattern:', error);
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