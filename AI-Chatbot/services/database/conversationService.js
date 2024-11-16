// services/database/conversationService.js
import { API_URL } from "../../config/api";

export const conversationService = {
    // Create a new conversation session
    createConversation: async (firebaseId) => {
        try {
            // Add retry logic here too
            let attempts = 0;
            let lastError = null;

            while (attempts < 3) {
                try {
                    const response = await fetch(`${API_URL}/conversations`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: firebaseId,
                            status: 'active',
                            startTime: new Date().toISOString()
                        })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        if (errorData.message === 'User not found' && attempts < 2) {
                            // Wait before retrying
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            attempts++;
                            continue;
                        }
                        throw new Error(errorData.message || 'Failed to create conversation');
                    }

                    const data = await response.json();
                    return {
                        success: true,
                        conversationId: data.conversationId
                    };
                } catch (error) {
                    lastError = error;
                    if (attempts >= 2) break;
                    attempts++;
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            throw lastError || new Error('Failed to create conversation after multiple attempts');
        } catch (error) {
            console.error('Error creating conversation:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Add a message to an existing conversation
    addMessage: async (conversationId, content, senderType, emotionalState = null) => {
        try {
            const response = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    senderType, // 'user' or 'ai'
                    emotionalState,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add message');
            }

            const data = await response.json();
            return {
                success: true,
                messageId: data.messageId
            };
        } catch (error) {
            console.error('Error adding message:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Update conversation status (active, completed, interrupted)
    updateConversationStatus: async (conversationId, status, summary = null) => {
        try {
            const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    summary,
                    endTime: status !== 'active' ? new Date().toISOString() : null
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update conversation status');
            }

            return {
                success: true
            };
        } catch (error) {
            console.error('Error updating conversation status:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Get conversation history for a user
    getConversationHistory: async (userId, page = 1, limit = 10) => {
        try {
            const response = await fetch(
                `${API_URL}/conversations/user/${userId}?page=${page}&limit=${limit}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch conversation history');
            }

            const data = await response.json();
            return {
                success: true,
                conversations: data.conversations,
                totalPages: data.totalPages,
                currentPage: data.currentPage
            };
        } catch (error) {
            console.error('Error fetching conversation history:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Get messages for a specific conversation
    getConversationMessages: async (conversationId, page = 1, limit = 50) => {
        try {
            const response = await fetch(
                `${API_URL}/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch conversation messages');
            }

            const data = await response.json();
            return {
                success: true,
                messages: data.messages,
                totalPages: data.totalPages,
                currentPage: data.currentPage
            };
        } catch (error) {
            console.error('Error fetching conversation messages:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Record a crisis event
    recordCrisisEvent: async (conversationId, userId, severity, actionTaken) => {
        try {
            const response = await fetch(`${API_URL}/conversations/${conversationId}/crisis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    severityLevel: severity,
                    actionTaken,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to record crisis event');
            }

            return {
                success: true
            };
        } catch (error) {
            console.error('Error recording crisis event:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Update conversation risk level
    updateRiskLevel: async (conversationId, riskLevel) => {
        try {
            const response = await fetch(`${API_URL}/conversations/${conversationId}/risk`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    riskLevel
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update risk level');
            }

            return {
                success: true
            };
        } catch (error) {
            console.error('Error updating risk level:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
};