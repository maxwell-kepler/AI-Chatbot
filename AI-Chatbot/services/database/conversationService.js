// services/database/conversationService.js
import { API_URL } from "../../config/api";

export const conversationService = {
    createConversation: async (firebaseId, maxRetries = 3) => {
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                console.log(`Attempting to create conversation (attempt ${attempt + 1}/${maxRetries})`);

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
                    // If user not found and not last attempt, retry
                    if (errorData.error?.includes('User not found') && attempt < maxRetries - 1) {
                        console.log('User not found, waiting before retry...');
                        await new Promise(resolve => setTimeout(resolve, 500));
                        attempt++;
                        continue;
                    }
                    throw new Error(errorData.error || 'Failed to create conversation');
                }

                const data = await response.json();
                console.log('Conversation created successfully:', data);
                return {
                    success: true,
                    conversationId: data.conversationId
                };

            } catch (error) {
                console.error(`Attempt ${attempt + 1} failed:`, error);
                if (attempt === maxRetries - 1) {
                    return {
                        success: false,
                        error: error.message
                    };
                }
                attempt++;
            }
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
    }
};