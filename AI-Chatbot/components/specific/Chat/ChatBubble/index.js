// components/specific/Chat/ChatBubble/index.js
import React from 'react';
import { View, Text, Linking } from 'react-native';
import { formatMessageTime } from '../../../../utils/dateUtils';
import styles from './styles';

const ChatBubble = ({ message, isUser, timestamp, showTimestamp }) => {
    const handlePress = async (url) => {
        try {
            if (url.startsWith('tel:')) {
                await Linking.openURL(url);
            } else if (url.startsWith('https://maps.google.com')) {
                await Linking.openURL(url);
            } else {
                await Linking.openURL(url);
            }
        } catch (error) {
            console.error('Error opening URL:', error);
        }
    };

    const renderText = (text) => {
        const parts = text.split(/(\[.*?\]\(.*?\))/g);
        return parts.map((part, index) => {
            const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
            if (linkMatch) {
                return (
                    <Text
                        key={index}
                        style={[styles.link]}
                        onPress={() => handlePress(linkMatch[2])}
                    >
                        {linkMatch[1]}
                    </Text>
                );
            }
            return <Text key={index}>{part}</Text>;
        });
    };

    return (
        <View style={[styles.bubbleWrapper, isUser ? styles.userBubbleWrapper : styles.aiBubbleWrapper]}>
            <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
                <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>
                    {renderText(message)}
                </Text>
            </View>
            {showTimestamp && (
                <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
                    {formatMessageTime(timestamp)}
                </Text>
            )}
        </View>
    );
};

export default ChatBubble;