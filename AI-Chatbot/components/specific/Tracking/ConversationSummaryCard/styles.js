// components/specific/Tracking/ConversationSummaryCard/styles.js
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
    date: {
        ...theme.typography.presets.body2,
        color: theme.colors.neutral.grey700,
        marginRight: theme.spacing.sm,
    },
    riskBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.full,
    },
    riskText: {
        ...theme.typography.presets.caption,
        color: theme.colors.neutral.white,
        fontWeight: '600',
    },
    emotionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: theme.spacing.sm,
        gap: theme.spacing.xs,
    },
    emotionTag: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xxs,
        borderRadius: theme.borderRadius.full,
    },
    emotionText: {
        ...theme.typography.presets.caption,
        color: theme.colors.neutral.grey800,
        fontWeight: '500',
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
        ...theme.typography.presets.body1,
        color: theme.colors.neutral.grey900,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: theme.spacing.xs,
    },
    bulletDot: {
        ...theme.typography.presets.body2,
        color: theme.colors.primary.main,
        marginRight: theme.spacing.xs,
        width: 16,
    },
    bulletText: {
        ...theme.typography.presets.body2,
        color: theme.colors.neutral.grey700,
        flex: 1,
    }
});