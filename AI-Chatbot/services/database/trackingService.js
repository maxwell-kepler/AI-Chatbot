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
    },

    getCrisisEvents: async (firebaseId) => {
        try {
            const response = await fetch(
                `${API_URL}/tracking/firebase/${firebaseId}/crisis-events`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch crisis events');
            }

            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch crisis events');
            }

            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error('Error fetching crisis events:', error);
            return {
                success: false,
                error: error.message,
                data: [] // Provide empty array as fallback
            };
        }
    },

    getResourceAccessHistory: async (firebaseId) => {
        try {
            const response = await fetch(
                `${API_URL}/tracking/firebase/${firebaseId}/resource-access`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch resource access history');
            }

            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error('Error fetching resource access history:', error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }
};