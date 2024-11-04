// src/components/common/Input/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';

export default StyleSheet.create({
    container: {
        marginBottom: theme.spacing.components.input.marginBottom,
    },
    label: {
        ...theme.typography.presets.body2,
        color: theme.colors.neutral.grey700,
        marginBottom: theme.spacing.xs,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: theme.colors.neutral.grey300,
        borderRadius: theme.borderRadius.base,
        padding: theme.spacing.components.input.padding,
        backgroundColor: theme.colors.neutral.white,
        ...theme.typography.presets.body1,
        color: theme.colors.neutral.grey900,
    },
    inputFocused: {
        borderColor: theme.colors.primary.main,
        ...theme.shadows.sm,
    },
    inputError: {
        borderColor: theme.colors.error.main,
    },
    errorText: {
        ...theme.typography.presets.caption,
        color: theme.colors.error.main,
        marginTop: theme.spacing.xs,
    },
});
