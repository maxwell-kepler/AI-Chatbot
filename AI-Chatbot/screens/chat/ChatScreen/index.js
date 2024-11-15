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
} from 'react-native';
import { useAuth } from '../../../hooks/useAuth';
import { theme } from '../../../styles/theme';
import ChatBubble from '../../../components/specific/Chat/ChatBubble';
import MessageInput from '../../../components/specific/Chat/MessageInput';
import { chatWithGemini } from '../../../services/gemini/geminiService';
import { conversationService } from '../../../services/database/conversationService';
import LoadingScreen from '../../common/LoadingScreen';
import styles from './styles';
import { WELCOME_MESSAGE } from '../../../config/promptConfig';

const INITIAL_MESSAGE = {
    text: WELCOME_MESSAGE,
    isUser: false,
    timestamp: new Date(),
};

const ChatScreen = () => {
    const { user, loading: authLoading } = useAuth();
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const scrollViewRef = useRef(null);
    const keyboardDidShowListener = useRef(null);
    const keyboardDidHideListener = useRef(null);

    useEffect(() => {
        // Only initialize conversation when user data is available
        if (user && !initialized) {
            initializeConversation();
            setInitialized(true);
        }

        keyboardDidShowListener.current = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => scrollToBottom(true)
        );
        keyboardDidHideListener.current = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => scrollToBottom(true)
        );

        return () => {
            keyboardDidShowListener.current?.remove();
            keyboardDidHideListener.current?.remove();
            if (conversationId) {
                handleConversationEnd();
            }
        };
    }, [user]);

    const initializeConversation = async () => {
        try {
            if (!user?.uid) {
                console.error('No user ID available');
                return;
            }

            const result = await conversationService.createConversation(user.uid);
            if (result.success) {
                setConversationId(result.conversationId);
                // Save initial welcome message
                await conversationService.addMessage(
                    result.conversationId,
                    INITIAL_MESSAGE.text,
                    'ai'
                );
            } else {
                console.error('Failed to initialize conversation:', result.error);
                Alert.alert(
                    'Error',
                    'Failed to start conversation. Please try again later.'
                );
            }
        } catch (error) {
            console.error('Error initializing conversation:', error);
        }
    };

    const handleConversationEnd = async () => {
        if (conversationId) {
            try {
                await conversationService.updateConversationStatus(
                    conversationId,
                    'completed',
                    'User left the chat'
                );
            } catch (error) {
                console.error('Error ending conversation:', error);
            }
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
        if (!conversationId) {
            Alert.alert('Error', 'Conversation not initialized');
            return;
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
                conversationId,
                message,
                'user'
            );

            // Get AI response
            const response = await chatWithGemini(message);
            const { text, isCrisis, emotionalState } = response;

            // Save AI response
            await conversationService.addMessage(
                conversationId,
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
            await conversationService.addMessage(
                conversationId,
                errorMessage.text,
                'ai',
                { error: true }
            );
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
                            disabled={loading || !conversationId}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default ChatScreen;