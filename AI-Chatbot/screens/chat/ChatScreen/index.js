// src/screens/chat/ChatScreen/index.js
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { theme } from '../../../styles/theme';
import ChatBubble from '../../../components/specific/Chat/ChatBubble';
import MessageInput from '../../../components/specific/Chat/MessageInput';
import { chatWithGemini } from '../../../services/gemini/geminiService';
import styles from './styles';
import { WELCOME_MESSAGE } from '../../../config/promptConfig';

const INITIAL_MESSAGE = {
    text: WELCOME_MESSAGE,
    isUser: false,
    timestamp: new Date(),
};

const ChatScreen = () => {
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [loading, setLoading] = useState(false);
    const scrollViewRef = useRef(null);
    const keyboardDidShowListener = useRef(null);
    const keyboardDidHideListener = useRef(null);

    useEffect(() => {
        // Set up keyboard listeners
        keyboardDidShowListener.current = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => scrollToBottom(true)
        );
        keyboardDidHideListener.current = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => scrollToBottom(true)
        );

        // Cleanup listeners
        return () => {
            keyboardDidShowListener.current?.remove();
            keyboardDidHideListener.current?.remove();
        };
    }, []);

    const scrollToBottom = (animated = true) => {
        if (scrollViewRef.current) {
            setTimeout(() => {
                scrollViewRef.current.scrollToEnd({ animated });
            }, 100); // Small delay to ensure content is laid out
        }
    };

    const handleSend = async (message) => {
        const newMessage = {
            text: message,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, newMessage]);
        setLoading(true);
        scrollToBottom();

        try {
            const response = await chatWithGemini(message);

            const aiResponse = {
                text: response.text,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiResponse]);
            scrollToBottom();
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                text: "I'm sorry, I couldn't process your message. Please try again.",
                isUser: false,
                timestamp: new Date(),
                isError: true,
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
            scrollToBottom();
        }
    };

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