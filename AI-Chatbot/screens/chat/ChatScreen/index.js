// src/screens/chat/ChatScreen/index.js
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { theme } from '../../../styles/theme';
import ChatBubble from '../../../components/specific/Chat/ChatBubble';
import MessageInput from '../../../components/specific/Chat/MessageInput';
import { chatWithGemini } from '../../../services/geminiService';
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

    const scrollToBottom = (animated = true) => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated });
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

        try {
            const response = await chatWithGemini(message);

            const aiResponse = {
                text: response.text,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiResponse]);
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
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.chatContainer}>
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    onContentSizeChange={() => scrollToBottom()}
                    keyboardShouldPersistTaps="handled"
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
            </View>

            <View style={styles.inputWrapper}>
                <MessageInput
                    onSend={handleSend}
                    disabled={loading}
                />
            </View>
        </View>
    );
};

export default ChatScreen;