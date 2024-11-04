// src/components / specific / Chat / ChatBubble / index.js
import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

const ChatBubble = ({ message, isUser }) => {
    return (
        <View style={[
            styles.container,
            isUser ? styles.userContainer : styles.aiContainer
        ]}>
            <Text style={[
                styles.text,
                isUser ? styles.userText : styles.aiText
            ]}>
                {message}
            </Text>
        </View>
    );
};

export default ChatBubble;