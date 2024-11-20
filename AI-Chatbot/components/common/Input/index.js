// components/common/Input/index.js
import React from 'react';
import { TextInput, View, Text } from 'react-native';
import styles from './styles';
import tokenService from '../../../services/auth/tokenService';

const Input = ({
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    error,
    ...props
}) => {
    const handleTextChange = (text) => {
        tokenService.updateLastActivity();
        onChangeText(text);
    };

    const handleFocus = () => {
        tokenService.updateLastActivity();
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, error && styles.inputError]}
                value={value}
                onChangeText={handleTextChange}
                onFocus={handleFocus}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

export default Input;