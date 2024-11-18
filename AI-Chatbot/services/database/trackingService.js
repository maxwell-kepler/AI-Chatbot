// services/database/trackingService.js
import { API_URL } from "../../config/api.client";

export const trackingService = {
    getEmotionalHistory: async (firebaseId) => {
        try {
            const response = await fetch(
                `${API_URL}/tracking/firebase/${firebaseId}/emotional-history`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch emotional history');
            }

            const data = await response.json();
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error('Error fetching emotional history:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    getConversationSummaries: async (firebaseId) => {
        try {
            const response = await fetch(
                `${API_URL}/tracking/firebase/${firebaseId}/conversation-summaries`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch conversation summaries');
            }

            const data = await response.json();
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error('Error fetching conversation summaries:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    getEmotionalPatterns: async (firebaseId) => {
        try {
            const response = await fetch(
                `${API_URL}/tracking/firebase/${firebaseId}/emotional-patterns`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch emotional patterns');
            }

            const data = await response.json();
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error('Error fetching emotional patterns:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
};