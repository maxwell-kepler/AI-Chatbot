// screens/ChatScreen/index.js
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
import { useAuth } from '../../hooks/useAuth';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../../styles/theme';
import ChatBubble from '../../components/specific/Chat/ChatBubble';
import MessageInput from '../../components/specific/Chat/MessageInput';
import { chatWithGemini, performSafetyCheck } from '../../services/gemini/geminiService';
import { conversationService } from '../../services/database/conversationService';
import { resourceMatchingService } from '../../services/matching/resourceMatchingService';
import LoadingScreen from '../LoadingScreen';
import styles from './styles';
import { WELCOME_MESSAGE, CRISIS_RESOURCES } from '../../config/promptConfig';
import emotionDetectionService from '../../services/emotion/emotionDetectionService';

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
    const appStateRef = useRef(AppState.currentState);
    const backgroundTimerRef = useRef(null);

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

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appStateRef.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                clearTimeout(backgroundTimerRef.current);
            } else if (
                appStateRef.current === 'active' &&
                nextAppState.match(/inactive|background/)
            ) {
                handleAppBackground();
            }
            appStateRef.current = nextAppState;
        });

        return () => {
            subscription.remove();
            if (backgroundTimerRef.current) {
                clearTimeout(backgroundTimerRef.current);
            }
        };
    }, [conversationId]);

    useFocusEffect(
        React.useCallback(() => {
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
            if (currentStatus === 'liminal') {
                await conversationService.updateConversationStatus(
                    conversationId,
                    'active'
                );
                setCurrentStatus('active');
            }
        } catch (error) {
            console.error('Error transitioning to active state:', error);
        }
    };

    const handleScreenBlur = async () => {
        if (!conversationId) return;

        try {
            const summaryResult = await conversationService.generateConversationSummary(
                conversationId
            );

            if (summaryResult.success) {
                await conversationService.updateConversationStatus(
                    conversationId,
                    'liminal',
                    summaryResult.summary
                );
                setCurrentStatus('liminal');
            }
        } catch (error) {
            console.error('Error transitioning to liminal state:', error);
        }
    };

    const handleAppBackground = async () => {
        if (!conversationId) return;

        backgroundTimerRef.current = setTimeout(async () => {
            try {
                const summaryResult = await conversationService.generateConversationSummary(
                    conversationId
                );

                if (summaryResult.success) {
                    const result = await conversationService.updateConversationStatus(
                        conversationId,
                        'completed'
                    );
                    if (result.success) {
                        setCurrentStatus('completed');
                    } else {
                        console.error('Failed to complete conversation:', result.error);
                    }
                }
            } catch (error) {
                console.error('Error completing conversation:', error);
            }
        }, 300000); // 5 minutes timeout, 300000 ms
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
            const safetyCheck = performSafetyCheck(message);

            if (!currentConversationId) {
                console.log('Initializing new conversation');
                const result = await conversationService.createConversation(user.uid);

                if (!result.success) {
                    throw new Error('Failed to create conversation');
                }

                currentConversationId = result.conversationId;
                setConversationId(currentConversationId);

                await conversationService.addMessage(
                    currentConversationId,
                    WELCOME_MESSAGE,
                    'ai'
                );
            }

            if (safetyCheck.isCritical && currentConversationId) {
                console.log('Recording crisis event for conversation:', currentConversationId);

                try {
                    await conversationService.recordCrisisEvent(
                        currentConversationId,
                        user.uid,
                        'severe',
                        'User expressed thoughts of self-harm or suicide'
                    );
                    console.log('Crisis event recorded successfully');

                    await conversationService.updateRiskLevel(
                        currentConversationId,
                        'high'
                    );
                    console.log('Risk level updated successfully');
                } catch (crisisError) {
                    console.error('Error handling crisis event:', crisisError);
                }
            }

            const emotionalState = emotionDetectionService.detectEmotionalState(message);
            console.log('Detected emotional state:', emotionalState);

            const newMessage = {
                text: message,
                isUser: true,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, newMessage]);
            setLoading(true);
            scrollToBottom();

            try {
                await conversationService.addMessage(
                    currentConversationId,
                    message,
                    'user',
                    emotionalState
                );

                const response = await chatWithGemini(message);
                const { text, isCrisis, insights } = response;

                const severity = safetyCheck.isCritical ? 'severe' : 'moderate';
                const matchedResources = await resourceMatchingService.getMatchingResources(
                    severity,
                    emotionalState,
                    message
                );

                if (matchedResources.success && matchedResources.data.length > 0) {
                    const aiResponse = {
                        text,
                        isUser: false,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiResponse]);

                    setMessages(prev => [...prev, {
                        text: "Here are some resources that might help:",
                        isUser: false,
                        timestamp: new Date()
                    }, {
                        text: formatResourceRecommendations(matchedResources.data),
                        isUser: false,
                        timestamp: new Date(),
                        isResourceRecommendation: true
                    }]);

                    await conversationService.addMessage(
                        currentConversationId,
                        text,
                        'ai',
                        response.emotionalState
                    );
                } else {
                    const aiResponse = {
                        text,
                        isUser: false,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiResponse]);

                    await conversationService.addMessage(
                        currentConversationId,
                        text,
                        'ai',
                        response.emotionalState
                    );
                }

                if (!safetyCheck.isCritical) {
                    await updateRiskLevel(emotionalState, insights, currentConversationId);
                }

            } catch (error) {
                console.error('Chat error:', error);
                if (safetyCheck.isCritical) {
                    setMessages(prev => [...prev, {
                        text: CRISIS_RESPONSES.generalCrisis,
                        isUser: false,
                        timestamp: new Date(),
                        isCrisisAlert: true
                    }]);

                    await conversationService.addMessage(
                        currentConversationId,
                        CRISIS_RESPONSES.generalCrisis,
                        'ai',
                        { state: ['crisis'], requiresAlert: true }
                    );
                } else {
                    setMessages(prev => [...prev, {
                        text: "I'm sorry, I couldn't process your message. Please try again.",
                        isUser: false,
                        timestamp: new Date(),
                        isError: true,
                    }]);
                }
            }

        } catch (error) {
            console.error('Error in handleSend:', error);
            Alert.alert('Error', 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
            scrollToBottom();
        }
    };


    const handleCrisisSituation = async (message, emotionalState, currentConversationId) => {
        try {
            const matchedResources = await resourceMatchingService.getMatchingResources(
                'severe',
                emotionalState,
                message
            );

            if (!matchedResources.success || matchedResources.data.length === 0) {
                const crisisText = CRISIS_RESOURCES.replace(
                    /(\d{3}-\d{3}-\d{4})/g,
                    match => `[${match}](tel:${match.replace(/-/g, '')})`
                );

                setMessages(prev => [...prev, {
                    text: crisisText,
                    isUser: false,
                    timestamp: new Date(),
                    isCrisisAlert: true
                }]);
            } else {
                setMessages(prev => [...prev, {
                    text: "Based on what you're sharing, these resources might be helpful:",
                    isUser: false,
                    timestamp: new Date()
                }, {
                    text: formatResourceRecommendations(matchedResources.data),
                    isUser: false,
                    timestamp: new Date(),
                    isResourceRecommendation: true
                }]);
            }

            // Record resource access
            matchedResources.data.forEach(resource => {
                resourceMatchingService.recordResourceAccess(
                    user.uid,
                    resource.resource_ID,
                    'crisis'
                );
            });

        } catch (error) {
            console.error('Error in crisis handling:', error);
        }
    };


    const formatResourceRecommendations = (resources) => {
        let message = "";
        resources.forEach(resource => {
            message += `${resource.name.toUpperCase()}\n`;
            message += `${resource.description}\n\n`;
            if (resource.phone) {
                message += `Call: [${resource.phone}](tel:${resource.phone})\n`;
            }
            if (resource.hours) {
                message += `Hours: ${resource.hours}\n`;
            }
            if (resource.address && resource.address !== 'Calgary, AB') {
                message += `[Open Map](https://maps.google.com/?q=${encodeURIComponent(resource.address)})\n`;
            }
            if (resource.website_URL) {
                message += `[Visit Website](${resource.website_URL})\n`;
            }
            message += '\n';
        });
        return message;
    };

    const updateRiskLevel = async (emotionalState, insights, currentConversationId) => {
        if (!currentConversationId) {
            console.warn('No active conversation for risk level update');
            return;
        }

        try {
            let riskLevel = 'low';

            if (emotionalState.state.includes('crisis')) {
                riskLevel = 'high';
            } else if (insights.patternCounts.emotional.anxiety > 2 ||
                insights.patternCounts.emotional.depression > 2) {
                riskLevel = 'medium';
            }

            await conversationService.updateRiskLevel(currentConversationId, riskLevel);

            if (riskLevel === 'medium' &&
                insights.messageCount > 5 &&
                Object.values(insights.patternCounts.emotional).some(count => count > 3)) {
                await conversationService.recordCrisisEvent(
                    currentConversationId,
                    user.uid,
                    'moderate',
                    'Multiple instances of elevated emotional distress detected'
                );
            }
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