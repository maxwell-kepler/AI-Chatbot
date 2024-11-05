// src/components/specific/Resources/ResourceCard/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../../../styles/theme';

export default StyleSheet.create({
    container: {
        backgroundColor: theme.colors.neutral.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        ...theme.shadows.base,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    name: {
        ...theme.typography.presets.header3,
        color: theme.colors.neutral.grey900,
        flex: 1,
    },
    description: {
        ...theme.typography.presets.body1,
        color: theme.colors.neutral.grey700,
        marginBottom: theme.spacing.md,
    },
    detailsContainer: {
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    detailText: {
        ...theme.typography.presets.body2,
        color: theme.colors.neutral.grey600,
        flex: 1,
    },
    phone: {
        color: theme.colors.primary.main,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
        marginTop: theme.spacing.sm,
    },
    tag: {
        backgroundColor: theme.colors.neutral.grey100,
        paddingVertical: theme.spacing.xxs,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
    },
    tagText: {
        ...theme.typography.presets.caption,
        color: theme.colors.neutral.grey700,
    },
    // New styles for different tag types
    categoryTag: {
        backgroundColor: theme.colors.primary.light,
    },
    categoryTagText: {
        ...theme.typography.presets.caption,
        color: theme.colors.primary.dark,
        fontWeight: '600',
    },
    availabilityTag: {
        backgroundColor: theme.colors.success.light,
    },
    availabilityTagText: {
        ...theme.typography.presets.caption,
        color: theme.colors.success.dark,
        fontWeight: '500',
    },
});