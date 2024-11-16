// services/database/conversationService.js
import { API_URL } from "../../config/api";

export const conversationService = {
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
                    // If it's a retryable error and not our last attempt, retry
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
                    conversationId: data.conversationId
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
    }
};