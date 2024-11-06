// src/screens/settings/SettingsScreen/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.neutral.background,
        padding: theme.spacing.layout.page,
    },
    section: {
        marginBottom: theme.spacing.lg,
    },
    dangerSection: {
        marginTop: 'auto',
        marginBottom: theme.spacing.xl,
    },
});