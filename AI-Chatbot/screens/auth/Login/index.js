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

const getErrorMessage = (errorCode) => {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'Please enter a valid email address';
        case 'auth/user-disabled':
            return 'This account has been disabled';
        case 'auth/user-not-found':
            return 'No account found with this email';
        case 'auth/wrong-password':
            return 'Incorrect password';
        case 'auth/invalid-credential':
            return 'Invalid email or password';
        case 'auth/email-already-in-use':
            return 'An account already exists with this email';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later';
        case 'auth/operation-not-allowed':
            return 'Email/password sign in is not enabled';
        default:
            return 'An error occurred. Please try again';
    }
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password.length >= 6;
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (!validatePassword(password)) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignIn = async () => {
        if (!validateForm()) return;

        setLoading(true);
        const response = await authService.signIn(email, password);
        setLoading(false);

        if (!response.success) {
            // For sign-in errors, we'll show them under the relevant field
            if (response.errorCode === 'auth/invalid-email' ||
                response.errorCode === 'auth/user-not-found') {
                setErrors({ email: getErrorMessage(response.errorCode) });
            } else if (response.errorCode === 'auth/wrong-password' ||
                response.errorCode === 'auth/invalid-credential') {
                setErrors({ password: getErrorMessage(response.errorCode) });
            } else {
                setErrors({ auth: getErrorMessage(response.errorCode) });
            }
        }
    };

    const handleCreateAccount = async () => {
        if (!validateForm()) return;

        setLoading(true);
        const response = await authService.createAccount(email, password);
        setLoading(false);

        if (!response.success) {
            if (response.errorCode === 'auth/email-already-in-use') {
                setErrors({ email: getErrorMessage(response.errorCode) });
            } else if (response.errorCode === 'auth/weak-password') {
                setErrors({ password: getErrorMessage(response.errorCode) });
            } else {
                setErrors({ auth: getErrorMessage(response.errorCode) });
            }
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setErrors({ email: 'Please enter your email address' });
            return;
        }

        if (!validateEmail(email)) {
            setErrors({ email: 'Please enter a valid email address' });
            return;
        }

        setLoading(true);
        const response = await authService.forgotPassword(email);
        setLoading(false);

        if (response.success) {
            Alert.alert(
                'Reset Email Sent',
                'Please check your email for password reset instructions.',
                [{ text: 'OK' }]
            );
        } else {
            setErrors({ auth: getErrorMessage(response.errorCode) });
        }
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
                <Text style={styles.title}>Welcome</Text>
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
                        disabled={loading}
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
                        disabled={loading}
                    />
                </View>

                {errors.auth && (
                    <Text style={styles.errorText}>{errors.auth}</Text>
                )}

                <View style={styles.buttonContainer}>
                    <Button
                        title={loading ? "Please wait..." : "Sign In"}
                        onPress={handleSignIn}
                        loading={loading}
                        variant={BUTTON_VARIANTS.PRIMARY}
                        size={BUTTON_SIZES.MEDIUM}
                        disabled={loading}
                    />

                    <Button
                        title="Create Account"
                        onPress={handleCreateAccount}
                        loading={loading}
                        variant={BUTTON_VARIANTS.OUTLINE}
                        size={BUTTON_SIZES.MEDIUM}
                        disabled={loading}
                    />

                    <Button
                        title="Forgot Password?"
                        onPress={handleForgotPassword}
                        variant={BUTTON_VARIANTS.GHOST}
                        size={BUTTON_SIZES.MEDIUM}
                        disabled={loading}
                    />
                </View>

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