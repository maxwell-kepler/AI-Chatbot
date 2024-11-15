// components/common/Button/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';

export default StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.borderRadius.base,
        borderWidth: 1,
        borderColor: 'transparent',
    },

    // Variant styles
    primary: {
        backgroundColor: theme.colors.primary.main,
        borderColor: theme.colors.primary.main,
        ...theme.shadows.sm,
    },
    secondary: {
        backgroundColor: theme.colors.secondary.main,
        borderColor: theme.colors.secondary.main,
        ...theme.shadows.sm,
    },
    outline: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.primary.main,
    },
    ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
    },
    danger: {
        backgroundColor: theme.colors.error.main,
        borderColor: theme.colors.error.main,
        ...theme.shadows.sm,
    },
    success: {
        backgroundColor: theme.colors.success.main,
        borderColor: theme.colors.success.main,
        ...theme.shadows.sm,
    },

    // Size styles
    small: {
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        minHeight: 32,
    },
    medium: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        minHeight: 40,
    },
    large: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        minHeight: 48,
    },

    // Disabled state
    disabled: {
        opacity: 0.5,
    },

    // Content container
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Icon containers
    iconLeft: {
        marginRight: theme.spacing.xs,
    },
    iconRight: {
        marginLeft: theme.spacing.xs,
    },

    // Text styles for each variant
    buttonText: {
        ...theme.typography.presets.button,
        textAlign: 'center',
    },
    primaryText: {
        color: theme.colors.neutral.white,
    },
    secondaryText: {
        color: theme.colors.neutral.white,
    },
    outlineText: {
        color: theme.colors.primary.main,
    },
    ghostText: {
        color: theme.colors.primary.main,
    },
    dangerText: {
        color: theme.colors.neutral.white,
    },
    successText: {
        color: theme.colors.neutral.white,
    },

    // Text sizes
    smallText: {
        ...theme.typography.presets.button,
        fontSize: theme.typography.sizes.sm,
    },
    mediumText: {
        ...theme.typography.presets.button,
        fontSize: theme.typography.sizes.base,
    },
    largeText: {
        ...theme.typography.presets.button,
        fontSize: theme.typography.sizes.md,
    },
});