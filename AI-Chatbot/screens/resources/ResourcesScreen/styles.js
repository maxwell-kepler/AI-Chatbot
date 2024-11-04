// src/screens/resources/ResourcesScreen/styles.js
import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../../styles/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.neutral.background,
    },
    topSection: {
        height: SCREEN_HEIGHT * 0.08,
        backgroundColor: theme.colors.neutral.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.neutral.grey200,
        justifyContent: 'center',
    },
    searchContainer: {
        padding: theme.spacing.md,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.neutral.grey100,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
    },
    searchInput: {
        flex: 1,
        marginLeft: theme.spacing.sm,
        ...theme.typography.presets.body1,
        color: theme.colors.neutral.grey900,
    },
    categoriesSection: {
        height: SCREEN_HEIGHT * 0.2,
        backgroundColor: theme.colors.neutral.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.neutral.grey200,
        justifyContent: 'center',
    },
    categoriesContent: {
        paddingHorizontal: theme.spacing.md,
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    resourcesSection: {
        flex: 1,
    },
    resourcesContent: {
        padding: theme.spacing.md,
        gap: theme.spacing.md,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl,
    },
    emptyStateText: {
        ...theme.typography.presets.body1,
        color: theme.colors.neutral.grey600,
    },
});
