// services/database/conversationService.js
const { API_URL } = require("../../config/api.server");

const conversationService = {
    createConversation: async (firebaseId) => {
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            try {
                console.log(`Creating conversation attempt ${attempts + 1}/${maxAttempts}`);

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

                const data = await response.json();

                if (!response.ok) {
                    if (data.retryable && attempts < maxAttempts - 1) {
                        console.log('Retryable error, waiting before next attempt...');
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        attempts++;
                        continue;
                    }
                    throw new Error(data.error || 'Failed to create conversation');
                }

                console.log('Conversation created successfully:', data);
                return {
                    success: true,
                    conversationId: data.conversationId,
                    status: 'active'
                };

            } catch (error) {
                console.error(`Attempt ${attempts + 1} failed:`, error);
                if (attempts >= maxAttempts - 1) {
                    return {
                        success: false,
                        error: error.message
                    };
                }
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return {
            success: false,
            error: 'Failed to create conversation after multiple attempts'
        };
    },

    updateConversationStatus: async (conversationId, newStatus) => {
        try {
            const response = await fetch(
                `${API_URL}/conversations/${conversationId}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: newStatus })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update conversation status');
            }

            const data = await response.json();
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error('Error updating conversation status:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },
    getLatestSummary: async (conversationId) => {
        try {
            const response = await fetch(
                `${API_URL}/conversations/${conversationId}/summary/latest`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch summary');
            }

            const data = await response.json();
            return {
                success: true,
                summary: data.data
            };
        } catch (error) {
            console.error('Error fetching latest summary:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    generateConversationSummary: async (conversationId) => {
        try {
            const response = await fetch(
                `${API_URL}/conversations/${conversationId}/summary`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate summary');
            }

            const data = await response.json();
            return {
                success: true,
                summary: data.data.summary
            };

        } catch (error) {
            console.error('Error generating conversation summary:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    addMessage: async (conversationId, content, senderType, emotionalState = null) => {
        try {
            console.log('Adding message:', {
                conversationId,
                senderType,
                hasContent: !!content,
                hasEmotionalState: !!emotionalState
            });

            const response = await fetch(
                `${API_URL}/conversations/${conversationId}/messages`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content,
                        senderType,
                        emotionalState,
                        timestamp: new Date().toISOString()
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to add message');
            }

            const data = await response.json();
            console.log('Message added successfully:', data);

            return {
                success: true,
                messageId: data.data.messageId
            };
        } catch (error) {
            console.error('Error in addMessage:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    recordCrisisEvent: async (conversationId, userId, severityLevel, notes) => {
        try {
            const response = await fetch(`${API_URL}/conversations/${conversationId}/crisis-events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    severityLevel,
                    notes,
                    timestamp: new Date().toISOString(),
                    actionTaken: 'Crisis resources provided', // Default action
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to record crisis event');
            }

            const data = await response.json();
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error('Error recording crisis event:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    updateCrisisResolution: async (conversationId, eventId, resolutionData) => {
        try {
            const response = await fetch(
                `${API_URL}/conversations/${conversationId}/crisis-events/${eventId}/resolution`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        resolutionNotes: resolutionData.notes,
                        actionTaken: resolutionData.action,
                        resolvedAt: new Date().toISOString()
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update crisis resolution');
            }

            const data = await response.json();
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error('Error updating crisis resolution:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    getCrisisEvents: async (conversationId) => {
        try {
            const response = await fetch(
                `${API_URL}/conversations/${conversationId}/crisis-events`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch crisis events');
            }

            const data = await response.json();
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error('Error fetching crisis events:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },


    updateRiskLevel: async (conversationId, riskLevel) => {
        try {
            const response = await fetch(`${API_URL}/conversations/${conversationId}/risk-level`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    riskLevel
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update risk level');
            }

            const data = await response.json();
            return {
                success: true,
                data: data.data
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
module.exports = { conversationService };