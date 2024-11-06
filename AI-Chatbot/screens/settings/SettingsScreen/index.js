// src/screens/settings/SettingsScreen/index.js
import React, { useState } from 'react';
import { View, Alert, Text } from 'react-native';
import { LogOut, Bell, Trash2, Lock } from 'lucide-react-native';
import { theme } from '../../../styles/theme';
import Button, { BUTTON_VARIANTS } from '../../../components/common/Button';
import ResetPasswordModal from '../../../components/specific/Settings/ResetPasswordModal';
import styles from './styles';

const SettingsScreen = () => {
    const [resetPasswordVisible, setResetPasswordVisible] = useState(false);

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
                            await authService.signOut();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        // TODO
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text preset="header3" style={styles.sectionTitle}>App Settings</Text>
                </View>
                <Button
                    title="Notification Settings"
                    variant={BUTTON_VARIANTS.OUTLINE}
                    leftIcon={<Bell size={20} color={theme.colors.primary.main} />}
                    onPress={() => {
                        // TODO
                    }}
                    style={styles.button}
                />
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text preset="header3" style={styles.sectionTitle}>Account Settings</Text>
                </View>
                <Button
                    title="Reset Password"
                    variant={BUTTON_VARIANTS.OUTLINE}
                    leftIcon={<Lock size={20} color={theme.colors.primary.main} />}
                    onPress={() => setResetPasswordVisible(true)}
                    style={styles.button}
                />

                <Button
                    title="Logout"
                    variant={BUTTON_VARIANTS.OUTLINE}
                    leftIcon={<LogOut size={20} color={theme.colors.primary.main} />}
                    onPress={handleLogout}
                    style={styles.button}
                />
            </View>

            <View style={styles.dangerSection}>
                <View style={styles.sectionHeader}>
                    <Text preset="header3" style={styles.sectionTitle}>Danger Zone</Text>
                </View>
                <Button
                    title="Delete Account"
                    variant={BUTTON_VARIANTS.DANGER}
                    leftIcon={<Trash2 size={20} color={theme.colors.neutral.white} />}
                    onPress={handleDeleteAccount}
                    style={styles.button}
                />
            </View>

            <ResetPasswordModal
                visible={resetPasswordVisible}
                onClose={() => setResetPasswordVisible(false)}
            />
        </View>
    );
};

export default SettingsScreen;