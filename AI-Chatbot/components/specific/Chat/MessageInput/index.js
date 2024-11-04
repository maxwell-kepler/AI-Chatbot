// src/components/specific/Chat/MessageInput/index.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Send } from 'lucide-react-native';
import { theme } from '../../../../styles/theme';
import styles from './styles';

const MessageInput = ({ onSend, disabled }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim() && !disabled) {
            onSend(message.trim());
            setMessage('');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message..."
                placeholderTextColor={theme.colors.neutral.grey500}
                multiline
                maxHeight={100}
                disabled={disabled}
                textAlignVertical="top"
                returnKeyType="send"
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
            />
            <TouchableOpacity
                style={[
                    styles.sendButton,
                    (!message.trim() || disabled) && styles.sendButtonDisabled
                ]}
                onPress={handleSend}
                disabled={!message.trim() || disabled}
            >
                <Send
                    size={20}
                    color={!message.trim() || disabled
                        ? theme.colors.neutral.grey400
                        : theme.colors.primary.main
                    }
                />
            </TouchableOpacity>
        </View>
    );
};

export default MessageInput;