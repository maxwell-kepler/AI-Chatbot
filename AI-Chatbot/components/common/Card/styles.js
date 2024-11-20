// components/common/Card/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';

export default StyleSheet.create({
    container: {
        backgroundColor: theme.colors.neutral.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        ...theme.shadows.sm,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftIcon: {
        marginRight: theme.spacing.sm,
    },
    rightIcon: {
        marginLeft: theme.spacing.sm,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        color: theme.colors.neutral.grey900,
        marginBottom: theme.spacing.xxs,
    },
    description: {
        color: theme.colors.neutral.grey600,
    },
});