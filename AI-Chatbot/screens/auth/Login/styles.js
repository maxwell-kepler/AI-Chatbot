// src/screens/auth/Login/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.neutral.background,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: theme.spacing.layout.page,
    },
    title: {
        ...theme.typography.presets.header1,
        color: theme.colors.primary.main,
        marginBottom: theme.spacing.lg,
        textAlign: 'center',
    },
    subtitle: {
        ...theme.typography.presets.body1,
        color: theme.colors.neutral.grey600,
        marginBottom: theme.spacing.xl,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: theme.spacing.lg,
    },
    buttonContainer: {
        gap: theme.spacing.md,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: theme.spacing.xl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.neutral.grey300,
    },
    dividerText: {
        ...theme.typography.presets.body2,
        color: theme.colors.neutral.grey600,
        marginHorizontal: theme.spacing.md,
    },
    footer: {
        marginTop: theme.spacing.xl,
        alignItems: 'center',
    },
    footerText: {
        ...theme.typography.presets.body2,
        color: theme.colors.neutral.grey600,
    },
    errorText: {
        ...theme.typography.presets.caption,
        color: theme.colors.error.main,
        marginTop: theme.spacing.xs,
    },
});