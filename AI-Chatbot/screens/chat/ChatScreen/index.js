// src/screens/chat/ChatScreen/index.js
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Keyboard,
    Dimensions,
} from 'react-native';
import { theme } from '../../../styles/theme';
import ChatBubble from '../../../components/specific/Chat/ChatBubble';
import MessageInput from '../../../components/specific/Chat/MessageInput';
import { chatWithGemini } from '../../../services/geminiService';
import styles from './styles';

const INITIAL_MESSAGE = {
    text: "Hi! I'm here to help. How are you feeling today?",
    isUser: false,
    timestamp: new Date(),
};

const ChatScreen = () => {
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [loading, setLoading] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const scrollViewRef = useRef(null);
    const [scrollViewHeight, setScrollViewHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        const keyboardWillShow = (event) => {
            setKeyboardHeight(event.endCoordinates.height);
        };

        const keyboardWillHide = () => {
            setKeyboardHeight(0);
        };

        const keyboardDidShow = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            keyboardWillShow
        );
        const keyboardDidHide = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            keyboardWillHide
        );

        return () => {
            keyboardDidShow.remove();
            keyboardDidHide.remove();
        };
    }, []);

    const scrollToBottom = (animated = true) => {
        if (scrollViewRef.current && contentHeight > scrollViewHeight) {
            scrollViewRef.current.scrollToEnd({ animated });
        }
    };

    const handleContentSizeChange = (width, height) => {
        setContentHeight(height);
        scrollToBottom();
    };

    const handleLayoutChange = (event) => {
        setScrollViewHeight(event.nativeEvent.layout.height);
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

    const windowHeight = Dimensions.get('window').height;
    const inputHeight = 60; // Approximate height of input container
    const headerHeight = Platform.OS === 'ios' ? 90 : 60; // Approximate header height

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={headerHeight}
            >
                <View
                    style={[
                        styles.chatContainer,
                        { maxHeight: windowHeight - headerHeight - inputHeight }
                    ]}
                >
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.messagesContainer}
                        contentContainerStyle={styles.messagesContent}
                        onContentSizeChange={handleContentSizeChange}
                        onLayout={handleLayoutChange}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={true}
                        maintainVisibleContentPosition={{
                            minIndexForVisible: 0,
                            autoscrollToTopThreshold: 100,
                        }}
                    >
                        {messages.map((message, index) => (
                            <ChatBubble
                                key={index}
                                message={message.text}
                                isUser={message.isUser}
                            />
                        ))}
                        {loading && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator color={theme.colors.primary.main} />
                            </View>
                        )}
                    </ScrollView>
                </View>

                <View style={styles.inputContainer}>
                    <MessageInput
                        onSend={handleSend}
                        disabled={loading}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default ChatScreen;