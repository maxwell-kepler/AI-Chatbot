// src/screens/resources/ResourcesScreen/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.neutral.background,
    },
    searchContainer: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.neutral.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.neutral.grey200,
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
    categoriesContainer: {
        backgroundColor: theme.colors.neutral.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.neutral.grey200,
    },
    categoriesContent: {
        padding: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    resourcesContainer: {
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