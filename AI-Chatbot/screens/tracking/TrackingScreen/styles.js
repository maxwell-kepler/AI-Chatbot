// screens/tracking/TrackingScreen/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.neutral.background,
    },
    content: {
        padding: theme.spacing.layout.page,
    },
    card: {
        backgroundColor: theme.colors.neutral.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
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
    chart: {
        marginVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
    },
    moodEntry: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.neutral.grey100,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm,
    },
    moodDate: {
        ...theme.typography.presets.caption,
        color: theme.colors.neutral.grey600,
    },
    moodText: {
        ...theme.typography.presets.body1,
        fontWeight: 'bold',
        color: theme.colors.neutral.grey900,
        marginTop: theme.spacing.xs,
    },
    moodNote: {
        ...theme.typography.presets.body2,
        color: theme.colors.neutral.grey600,
        marginTop: theme.spacing.xs,
    },
});