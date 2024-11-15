// components/specific/Chat/ChatBubble/index.js
import React from 'react';
import { View, Text } from 'react-native';
import { formatMessageTime } from '../../../../utils/dateUtils';
import styles from './styles';

const ChatBubble = ({ message, isUser, timestamp, showTimestamp }) => {
    return (
        <View style={[
            styles.bubbleWrapper,
            isUser ? styles.userBubbleWrapper : styles.aiBubbleWrapper
        ]}>
            <View style={[
                styles.bubble,
                isUser ? styles.userBubble : styles.aiBubble
            ]}>
                <Text style={[
                    styles.text,
                    isUser ? styles.userText : styles.aiText
                ]}>
                    {message}
                </Text>
            </View>
            {showTimestamp && (
                <Text style={[
                    styles.timestamp,
                    isUser ? styles.userTimestamp : styles.aiTimestamp
                ]}>
                    {formatMessageTime(timestamp)}
                </Text>
            )}
        </View>
    );
};
export default ChatBubble;