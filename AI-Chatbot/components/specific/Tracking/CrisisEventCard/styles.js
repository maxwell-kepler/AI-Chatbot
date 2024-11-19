// components/specific/Tracking/CrisisEventCard/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../../../styles/theme';

export default StyleSheet.create({
    container: {
        backgroundColor: theme.colors.neutral.white,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
        ...theme.shadows.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.neutral.grey50,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    icon: {
        marginRight: theme.spacing.sm,
    },
    timestamp: {
        ...theme.typography.presets.body2,
        color: theme.colors.neutral.grey700,
        marginRight: theme.spacing.sm,
    },
    severityBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.full,
        marginRight: theme.spacing.sm,
    },
    severityText: {
        ...theme.typography.presets.caption,
        color: theme.colors.neutral.white,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.full,
        marginRight: theme.spacing.sm,
    },
    statusText: {
        ...theme.typography.presets.caption,
        color: theme.colors.neutral.white,
        fontWeight: '600',
    },
    expandedContent: {
        padding: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.neutral.grey200,
    },
    section: {
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        ...theme.typography.presets.body2,
        color: theme.colors.neutral.grey900,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    sectionText: {
        ...theme.typography.presets.body2,
        color: theme.colors.neutral.grey700,
    },
});