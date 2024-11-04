// components/common/Input/index.js
import React from 'react';
import { TextInput, View, Text } from 'react-native';
import styles from './styles';

const Input = ({
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    error,
    ...props
}) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, error && styles.inputError]}
                value={value}
                onChangeText={onChangeText}
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