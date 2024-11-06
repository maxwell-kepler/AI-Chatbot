// src/components/specific/Settings/ResetPasswordModal/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../../../styles/theme';

export default StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: theme.colors.transparent.black50,
        justifyContent: 'center',
        padding: theme.spacing.lg,
    },
    modalContainer: {
        backgroundColor: theme.colors.neutral.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        ...theme.shadows.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    closeButton: {
        padding: theme.spacing.xs,
        borderRadius: theme.borderRadius.full,
    },
    inputSection: {
        marginBottom: theme.spacing.lg,
    },
    submitError: {
        color: theme.colors.error.main,
        marginBottom: theme.spacing.md,
        ...theme.typography.presets.caption,
    },
    helpText: {
        ...theme.typography.presets.caption,
        color: theme.colors.neutral.grey600,
        marginTop: theme.spacing.xs,
    },
    buttonContainer: {
        gap: theme.spacing.md,
    },
});