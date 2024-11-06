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
        marginBottom: theme.spacing.xl,
        backgroundColor: theme.colors.neutral.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        ...theme.shadows.sm,
    },
    sectionHeader: {
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        color: theme.colors.neutral.grey700,
    },
    button: {
        marginBottom: theme.spacing.md,
    },
    dangerSection: {
        marginTop: 'auto',
        backgroundColor: theme.colors.neutral.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        ...theme.shadows.sm,
    },
    // Remove margin bottom from last button in each section
    'button:last-child': {
        marginBottom: 0,
    },
});