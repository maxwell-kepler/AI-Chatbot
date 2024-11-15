// components/specific/Resources/CategoryPill/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../../../styles/theme';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.neutral.white,
        borderWidth: 1,
        borderColor: theme.colors.primary.main,
        marginRight: theme.spacing.sm,
        height: "80%", // Fixed height instead of percentage
    },
    icon: {
        marginRight: theme.spacing.xs,
        width: 16,
        height: 16,
    },
    selected: {
        backgroundColor: theme.colors.primary.main,
    },
    text: {
        ...theme.typography.presets.body2,
        color: theme.colors.primary.main,
    },
    selectedText: {
        color: theme.colors.primary.contrast,
    },
});