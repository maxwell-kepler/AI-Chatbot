// components/specific/Tracking/EmotionalPatternCard/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../../../styles/theme';

export default StyleSheet.create({
    container: {
        backgroundColor: theme.colors.neutral.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    headerText: {
        marginLeft: theme.spacing.md,
        flex: 1,
    },
    patternType: {
        ...theme.typography.presets.caption,
        color: theme.colors.neutral.grey600,
    },
    patternValue: {
        ...theme.typography.presets.body1,
        color: theme.colors.neutral.grey900,
        textTransform: 'capitalize',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: theme.colors.neutral.grey200,
        paddingTop: theme.spacing.md,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        ...theme.typography.presets.caption,
        color: theme.colors.neutral.grey600,
        marginBottom: theme.spacing.xs,
    },
    statValue: {
        ...theme.typography.presets.body2,
        color: theme.colors.neutral.grey900,
        fontWeight: '600',
    },
});