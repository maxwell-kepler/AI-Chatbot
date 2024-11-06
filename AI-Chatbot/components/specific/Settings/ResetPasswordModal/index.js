// src/components/specific/Settings/ResetPasswordModal/index.js
import React, { useState } from 'react';
import {
    View,
    Modal,
    TouchableOpacity,
    Alert
} from 'react-native';
import { X } from 'lucide-react-native';
import Button, { BUTTON_VARIANTS } from '../../../common/Button';
import Input from '../../../common/Input';
import Text from '../../../common/Text';
import { theme } from '../../../../styles/theme';
import authService from '../../../../services/auth/authService';
import styles from './styles';

const ResetPasswordModal = ({ visible, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({});
    };

    const validatePasswords = () => {
        const newErrors = {};

        if (!currentPassword.trim()) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!newPassword.trim()) {
            newErrors.newPassword = 'New password is required';
        } else if (newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(newPassword)) {
            newErrors.newPassword = 'Password must contain at least one uppercase letter';
        } else if (!/[a-z]/.test(newPassword)) {
            newErrors.newPassword = 'Password must contain at least one lowercase letter';
        } else if (!/[0-9]/.test(newPassword)) {
            newErrors.newPassword = 'Password must contain at least one number';
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (newPassword === currentPassword) {
            newErrors.newPassword = 'New password must be different from current password';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        try {
            if (!validatePasswords()) {
                return;
            }

            setLoading(true);
            const result = await authService.resetPassword(currentPassword, newPassword);

            if (result.success) {
                Alert.alert(
                    'Success',
                    'Your password has been successfully updated.',
                    [{ text: 'OK', onPress: handleClose }]
                );
            } else {
                setErrors({ submit: result.error });
            }
        } catch (error) {
            setErrors({ submit: 'An unexpected error occurred. Please try again.' });
            console.error('Password reset error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text preset="header3">Reset Password</Text>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={styles.closeButton}
                        >
                            <X size={24} color={theme.colors.neutral.grey600} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputSection}>
                        <Input
                            label="Current Password"
                            value={currentPassword}
                            onChangeText={(text) => {
                                setCurrentPassword(text);
                                setErrors(prev => ({ ...prev, currentPassword: null, submit: null }));
                            }}
                            secureTextEntry
                            error={errors.currentPassword}
                            placeholder="Enter current password"
                            autoCapitalize="none"
                            disabled={loading}
                        />
                    </View>

                    <View style={styles.inputSection}>
                        <Input
                            label="New Password"
                            value={newPassword}
                            onChangeText={(text) => {
                                setNewPassword(text);
                                setErrors(prev => ({ ...prev, newPassword: null, submit: null }));
                            }}
                            secureTextEntry
                            error={errors.newPassword}
                            placeholder="Enter new password"
                            autoCapitalize="none"
                            disabled={loading}
                        />
                        <Text style={styles.helpText}>
                            Password must be at least 8 characters long, include uppercase and lowercase letters, and contain at least one number.
                        </Text>
                    </View>

                    <View style={styles.inputSection}>
                        <Input
                            label="Confirm New Password"
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                setErrors(prev => ({ ...prev, confirmPassword: null, submit: null }));
                            }}
                            secureTextEntry
                            error={errors.confirmPassword}
                            placeholder="Confirm new password"
                            autoCapitalize="none"
                            disabled={loading}
                        />
                    </View>

                    {errors.submit && (
                        <Text style={styles.submitError}>
                            {errors.submit}
                        </Text>
                    )}

                    <View style={styles.buttonContainer}>
                        <Button
                            title={loading ? 'Updating Password...' : 'Update Password'}
                            onPress={handleSubmit}
                            disabled={loading}
                        />
                        <Button
                            title="Cancel"
                            variant={BUTTON_VARIANTS.OUTLINE}
                            onPress={handleClose}
                            disabled={loading}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ResetPasswordModal;