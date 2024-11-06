// src/screens/settings/SettingsScreen/index.js
import React from 'react';
import { View, Alert } from 'react-native';
import { LogOut, Bell, Trash2 } from 'lucide-react-native';
import { theme } from '../../../styles/theme';
import Button, { BUTTON_VARIANTS } from '../../../components/common/Button';
import styles from './styles';
import authService from '../../../services/auth/authService';

const SettingsScreen = () => {
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
                <Button
                    title="Notification Settings"
                    variant={BUTTON_VARIANTS.OUTLINE}
                    leftIcon={<Bell size={20} color={theme.colors.primary.main} />}
                    onPress={() => {
                        // TODO
                    }}
                />
            </View>

            <View style={styles.section}>
                <Button
                    title="Logout"
                    variant={BUTTON_VARIANTS.OUTLINE}
                    leftIcon={<LogOut size={20} color={theme.colors.primary.main} />}
                    onPress={handleLogout}
                />
            </View>

            <View style={styles.dangerSection}>
                <Button
                    title="Delete Account"
                    variant={BUTTON_VARIANTS.DANGER}
                    leftIcon={<Trash2 size={20} color={theme.colors.neutral.white} />}
                    onPress={handleDeleteAccount}
                />
            </View>
        </View>
    );
};

export default SettingsScreen;