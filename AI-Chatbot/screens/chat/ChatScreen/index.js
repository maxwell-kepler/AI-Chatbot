import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
    AppState
} from 'react-native';
import { useAuth } from '../../../hooks/useAuth';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { theme } from '../../../styles/theme';
import ChatBubble from '../../../components/specific/Chat/ChatBubble';
import MessageInput from '../../../components/specific/Chat/MessageInput';
import { chatWithGemini } from '../../../services/gemini/geminiService';
import { conversationService } from '../../../services/database/conversationService';
import LoadingScreen from '../../common/LoadingScreen';
import styles from './styles';
import { WELCOME_MESSAGE } from '../../../config/promptConfig';



const ChatScreen = () => {
    const { user, loading: authLoading } = useAuth();
    const [messages, setMessages] = useState([{
        text: WELCOME_MESSAGE,
        isUser: false,
        timestamp: new Date(),
    }]);
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(null);
    const scrollViewRef = useRef(null);
    const isFocused = useIsFocused();
    const appStateRef = useRef(AppState.currentState);

    // Initialize conversation only when user sends first message
    const initializeConversation = async () => {
        try {
            console.log('Initializing new conversation');
            const result = await conversationService.createConversation(user.uid);

            if (result.success) {
                setConversationId(result.conversationId);
                setCurrentStatus(result.status);
                return result.conversationId;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error initializing conversation:', error);
            Alert.alert(
                'Error',
                'Failed to start conversation. Please try again.'
            );
            return null;
        }
    };

    // Handle app state changes (background/foreground)
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appStateRef.current.match(/active|foreground/) &&
                nextAppState === 'background'
            ) {
                handleAppBackground();
            }
            appStateRef.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [conversationId]);

    // Handle screen focus changes
    useFocusEffect(
        React.useCallback(() => {
            // No need to do anything on focus if there's no conversation yet
            if (conversationId) {
                handleScreenFocus();
            }

            return () => {
                if (conversationId) {
                    handleScreenBlur();
                }
            };
        }, [conversationId])
    );

    const handleScreenFocus = async () => {
        if (!conversationId) return;

        try {
            // Transition from liminal to active
            await conversationService.updateConversationStatus(
                conversationId,
                'active'
            );
        } catch (error) {
            console.error('Error transitioning to active state:', error);
        }
    };

    const handleScreenBlur = async () => {
        if (!conversationId) return;

        try {
            // Generate summary and transition to liminal
            const summaryResult = await conversationService.generateConversationSummary(
                conversationId
            );

            if (summaryResult.success) {
                await conversationService.updateConversationStatus(
                    conversationId,
                    'liminal',
                    summaryResult.summary
                );
            }
        } catch (error) {
            console.error('Error transitioning to liminal state:', error);
        }
    };

    const handleAppBackground = async () => {
        if (!conversationId) return;

        try {
            const summaryResult = await conversationService.generateConversationSummary(
                conversationId
            );

            if (summaryResult.success) {
                await conversationService.updateConversationStatus(
                    conversationId,
                    'completed',
                    summaryResult.summary
                );
            }
        } catch (error) {
            console.error('Error completing conversation:', error);
        }
    };


    const scrollToBottom = (animated = true) => {
        if (scrollViewRef.current) {
            setTimeout(() => {
                scrollViewRef.current.scrollToEnd({ animated });
            }, 100);
        }
    };

    const handleSend = async (message) => {
        try {
            let currentConversationId = conversationId;

            // Initialize conversation if this is the first user message
            if (!currentConversationId) {
                currentConversationId = await initializeConversation();
                if (!currentConversationId) return;

                // Now that we have a conversation, save the welcome message and the user's message
                await conversationService.addMessage(
                    currentConversationId,
                    WELCOME_MESSAGE,
                    'ai'
                );
            }

            const newMessage = {
                text: message,
                isUser: true,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, newMessage]);
            setLoading(true);
            scrollToBottom();

            try {
                // Save user message
                await conversationService.addMessage(
                    currentConversationId,
                    message,
                    'user'
                );

                // Only update status if we're not already active
                if (currentStatus !== 'active') {
                    await conversationService.updateConversationStatus(
                        currentConversationId,
                        'active'
                    );
                    setCurrentStatus('active');
                }

                // Get AI response
                const response = await chatWithGemini(message);
                const { text, isCrisis, emotionalState } = response;

                // Save AI response
                await conversationService.addMessage(
                    currentConversationId,
                    text,
                    'ai',
                    emotionalState
                );

                const aiResponse = {
                    text,
                    isUser: false,
                    timestamp: new Date(),
                };

                setMessages(prev => [...prev, aiResponse]);

                // Handle crisis situation if detected
                if (isCrisis) {
                    await handleCrisisSituation(message);
                }

                // Update risk level based on emotional state
                if (emotionalState) {
                    await updateRiskLevel(emotionalState);
                }

            } catch (error) {
                console.error('Chat error:', error);
                const errorMessage = {
                    text: "I'm sorry, I couldn't process your message. Please try again.",
                    isUser: false,
                    timestamp: new Date(),
                    isError: true,
                };
                setMessages(prev => [...prev, errorMessage]);
            }

        } catch (error) {
            console.error('Error in handleSend:', error);
            Alert.alert('Error', 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
            scrollToBottom();
        }
    };



    const handleCrisisSituation = async (message) => {
        try {
            await conversationService.recordCrisisEvent(
                conversationId,
                user.uid,
                'severe',
                'AI detected crisis keywords in user message: ' + message
            );
            await conversationService.updateRiskLevel(conversationId, 'high');
        } catch (error) {
            console.error('Error handling crisis situation:', error);
        }
    };

    const updateRiskLevel = async (emotionalState) => {
        try {
            // Determine risk level based on emotional state
            let riskLevel = 'low';
            if (emotionalState.state.includes('crisis')) {
                riskLevel = 'high';
            } else if (emotionalState.state.includes('anxiety') ||
                emotionalState.state.includes('depression')) {
                riskLevel = 'medium';
            }

            await conversationService.updateRiskLevel(conversationId, riskLevel);
        } catch (error) {
            console.error('Error updating risk level:', error);
        }
    };

    if (authLoading) {
        return <LoadingScreen />;
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>
                    Please log in to access the chat.
                </Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.chatContainer}>
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.messagesContainer}
                        contentContainerStyle={styles.messagesContent}
                        keyboardShouldPersistTaps="handled"
                        onContentSizeChange={() => scrollToBottom(false)}
                        onLayout={() => scrollToBottom(false)}
                    >
                        {messages.map((message, index) => (
                            <ChatBubble
                                key={index}
                                message={message.text}
                                isUser={message.isUser}
                                timestamp={message.timestamp}
                                showTimestamp={true}
                            />
                        ))}
                        {loading && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator color={theme.colors.primary.main} />
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.inputWrapper}>
                        <MessageInput
                            onSend={handleSend}
                            disabled={loading}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default ChatScreen;