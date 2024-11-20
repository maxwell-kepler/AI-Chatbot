// screens/SettingsScreen/index.js
import React, { useState } from 'react';
import { View, Alert, Text } from 'react-native';
import { LogOut, Trash2, Lock } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import Button, { BUTTON_VARIANTS } from '../../components/common/Button';
import ResetPasswordModal from '../../components/specific/Settings/ResetPasswordModal';
import DeleteAccountModal from '../../components/specific/Settings/DeleteAccountModal';
import styles from './styles';
import authService from '../../services/auth/authService';
import { useTabBarVisibility } from '../../context/TabBarVisibilityContext';

const SettingsScreen = () => {
    const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
    const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const { setIsTabBarVisible } = useTabBarVisibility();

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoggingOut(true);
                            setIsTabBarVisible(false);
                            await authService.signOut();
                        } catch (error) {
                            console.error('Logout error:', error);
                            setLoggingOut(false);
                            setIsTabBarVisible(true);
                            Alert.alert(
                                'Error',
                                'Failed to logout. Please try again.'
                            );
                        } finally {
                            setIsTabBarVisible(true);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {loggingOut && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingContent}>
                        <Text style={styles.loadingText}>Logging out...</Text>
                        <Text style={styles.loadingSubText}>
                            Generating conversation summaries.
                            Please wait a moment.
                        </Text>
                    </View>
                </View>
            )}

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                </View>
                <Button
                    title="Reset Password"
                    variant={BUTTON_VARIANTS.OUTLINE}
                    leftIcon={<Lock size={20} color={theme.colors.primary.main} />}
                    onPress={() => setResetPasswordVisible(true)}
                    style={styles.button}
                    disabled={loggingOut}
                />

                <Button
                    title={loggingOut ? "Logging out..." : "Logout"}
                    variant={BUTTON_VARIANTS.OUTLINE}
                    leftIcon={<LogOut size={20} color={theme.colors.primary.main} />}
                    onPress={handleLogout}
                    style={styles.button}
                    disabled={loggingOut}
                />
            </View>

            <View style={styles.dangerSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Danger Zone</Text>
                </View>
                <Button
                    title="Delete Account"
                    variant={BUTTON_VARIANTS.DANGER}
                    leftIcon={<Trash2 size={20} color={theme.colors.neutral.white} />}
                    onPress={() => setDeleteAccountVisible(true)}
                    style={styles.button}
                    disabled={loggingOut}
                />
            </View>

            <ResetPasswordModal
                visible={resetPasswordVisible && !loggingOut}
                onClose={() => setResetPasswordVisible(false)}
            />

            <DeleteAccountModal
                visible={deleteAccountVisible && !loggingOut}
                onClose={() => setDeleteAccountVisible(false)}
            />
        </View>
    );
};

export default SettingsScreen;