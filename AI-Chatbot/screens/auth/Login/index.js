// screens/auth/Login/index.js
import React, { useState } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import Button, { BUTTON_VARIANTS, BUTTON_SIZES } from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import authService from '../../../services/auth/authService';
import styles from './styles';
import { Mail, Lock } from 'lucide-react-native';
import { theme } from '../../../styles/theme';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSignIn = async () => {
        if (!validateForm()) return;

        setLoading(true);
        const response = await authService.signIn(email, password);
        setLoading(false);

        if (!response.success) {
            setErrors({ auth: response.error });
        }
    };

    const handleCreateAccount = async () => {
        if (!validateForm()) return;

        setLoading(true);
        const response = await authService.createAccount(email, password);
        setLoading(false);

        if (!response.success) {
            setErrors({ auth: response.error });
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setErrors({ email: 'Please enter your email address' });
            return;
        }

        setLoading(true);
        const response = await authService.forgotPassword(email);
        setLoading(false);

        if (response.success) {
            Alert.alert(
                'Reset Email Sent',
                'Please check your email for password reset instructions',
                [{ text: 'OK' }]
            );
        } else {
            setErrors({ auth: response.error });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearErrors = () => {
        setErrors({});
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.formContainer}>
                <Text style={styles.title}>Welcome to the AI Mental Health Chatbot</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>

                <View style={styles.inputContainer}>
                    <Input
                        label="Email"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            clearErrors();
                        }}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={errors.email}
                        leftIcon={<Mail color={theme.colors.neutral.grey600} size={20} />}
                    />

                    <Input
                        label="Password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            clearErrors();
                        }}
                        placeholder="Enter your password"
                        secureTextEntry
                        autoCapitalize="none"
                        error={errors.password}
                        leftIcon={<Lock color={theme.colors.neutral.grey600} size={20} />}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Sign In"
                        onPress={handleSignIn}
                        loading={loading}
                        variant={BUTTON_VARIANTS.PRIMARY}
                        size={BUTTON_SIZES.MEDIUM}
                    />

                    <Button
                        title="Create Account"
                        onPress={handleCreateAccount}
                        loading={loading}
                        variant={BUTTON_VARIANTS.OUTLINE}
                        size={BUTTON_SIZES.MEDIUM}
                    />

                    <Button
                        title="Forgot Password?"
                        onPress={handleForgotPassword}
                        disabled={loading}
                        variant={BUTTON_VARIANTS.GHOST}
                        size={BUTTON_SIZES.MEDIUM}
                    />
                </View>

                {errors.auth && (
                    <Text style={styles.errorText}>{errors.auth}</Text>
                )}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Login;