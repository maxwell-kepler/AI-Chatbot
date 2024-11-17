// components/specific/Settings/DeleteAccountModal/styles.js
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
    warningText: {
        ...theme.typography.presets.body2,
        color: theme.colors.error.main,
        marginBottom: theme.spacing.lg,
    },
    inputSection: {
        marginBottom: theme.spacing.lg,
    },
    buttonContainer: {
        gap: theme.spacing.md,
    },
});