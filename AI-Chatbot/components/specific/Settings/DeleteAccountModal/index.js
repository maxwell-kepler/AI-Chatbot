// components/specific/Settings/DeleteAccountModal/index.js
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

const DeleteAccountModal = ({ visible, onClose }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const resetForm = () => {
        setPassword('');
        setError('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleDeleteAccount = async () => {
        if (!password.trim()) {
            setError('Password is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await authService.deleteAccount(password);

            if (result.success) {
                handleClose();
                Alert.alert(
                    "Success",
                    "Your account has been deleted"
                );
            } else {
                setError(result.error || "Failed to delete account");
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error('Delete account error:', err);
        } finally {
            setLoading(false);
        }
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
                        <Text preset="header3">Delete Account</Text>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={styles.closeButton}
                        >
                            <X size={24} color={theme.colors.neutral.grey600} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.warningText}>
                        This action cannot be undone. All your data will be permanently deleted.
                        Please enter your password to confirm.
                    </Text>

                    <View style={styles.inputSection}>
                        <Input
                            label="Password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setError('');
                            }}
                            secureTextEntry
                            error={error}
                            placeholder="Enter your password"
                            autoCapitalize="none"
                            disabled={loading}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title={loading ? "Deleting Account..." : "Delete Account"}
                            onPress={handleDeleteAccount}
                            variant={BUTTON_VARIANTS.DANGER}
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

export default DeleteAccountModal;