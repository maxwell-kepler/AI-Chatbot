// screens/TrackingScreen/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.neutral.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.neutral.background,
    },
    errorText: {
        ...theme.typography.presets.body1,
        color: theme.colors.error.main,
        textAlign: 'center',
        padding: theme.spacing.lg,
    },
    noDataText: {
        ...theme.typography.presets.body2,
        color: theme.colors.neutral.grey600,
        textAlign: 'center',
        padding: theme.spacing.md,
    },
    card: {
        backgroundColor: theme.colors.neutral.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        marginHorizontal: theme.spacing.layout.page,
        ...theme.shadows.sm,
    },
    cardTitle: {
        ...theme.typography.presets.header3,
        color: theme.colors.neutral.grey900,
        marginBottom: theme.spacing.md,
    },
    chartWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryItem: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.neutral.grey100,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm,
    },
    summaryDate: {
        ...theme.typography.presets.caption,
        color: theme.colors.neutral.grey600,
    },
    emotionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: theme.spacing.xs,
        gap: theme.spacing.xs,
    },
    emotionTag: {
        backgroundColor: theme.colors.primary.light,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xxs,
        borderRadius: theme.borderRadius.full,
    },
    emotionText: {
        ...theme.typography.presets.caption,
        color: theme.colors.neutral.white,
    },
    summaryText: {
        ...theme.typography.presets.body2,
        color: theme.colors.neutral.grey700,
        marginTop: theme.spacing.xs,
    },
    patternItem: {
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.neutral.grey100,
        borderRadius: theme.borderRadius.md,
    },
    patternType: {
        ...theme.typography.presets.body1,
        color: theme.colors.neutral.grey900,
        fontWeight: 'bold',
    },
    patternValue: {
        ...theme.typography.presets.body2,
        color: theme.colors.neutral.grey700,
        marginVertical: theme.spacing.xs,
    },
    patternStats: {
        ...theme.typography.presets.caption,
        color: theme.colors.neutral.grey600,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    section: {
        marginTop: theme.spacing.sm,
    },
    sectionTitle: {
        ...theme.typography.presets.body2,
        fontWeight: 'bold',
        color: theme.colors.neutral.grey800,
        marginBottom: theme.spacing.xs,
    },
    bulletText: {
        ...theme.typography.presets.body2,
        color: theme.colors.neutral.grey700,
        marginBottom: theme.spacing.xxs,
        paddingLeft: theme.spacing.sm,
    },
    riskBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xxs,
        borderRadius: theme.borderRadius.full,
    },
    riskLow: {
        backgroundColor: theme.colors.success.main,
    },
    riskMedium: {
        backgroundColor: theme.colors.warning.main,
    },
    riskHigh: {
        backgroundColor: theme.colors.error.main,
    },
    riskText: {
        ...theme.typography.presets.caption,
        color: theme.colors.neutral.white,
        textTransform: 'capitalize',
    },
    rawSummaryContainer: {
        marginVertical: theme.spacing.sm,
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.neutral.grey50,
        borderRadius: theme.borderRadius.md,
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.primary.main,
    },
    rawSummaryText: {
        ...theme.typography.presets.body2,
        color: theme.colors.neutral.grey800,
        lineHeight: 20,
    },
});