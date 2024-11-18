// screens/SettingsScreen/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.neutral.background,
        padding: theme.spacing.layout.page,
    },
    section: {
        marginBottom: theme.spacing.xl,
        backgroundColor: theme.colors.neutral.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        ...theme.shadows.sm,
    },
    sectionHeader: {
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        ...theme.typography.presets.header3,
        color: theme.colors.neutral.grey700,
    },
    button: {
        marginBottom: theme.spacing.md,
    },
    dangerSection: {
        marginTop: 'auto',
        backgroundColor: theme.colors.neutral.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        ...theme.shadows.sm,
    },
    'button:last-child': {
        marginBottom: 0,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.transparent.black50,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: theme.spacing.layout.page,
    },
    loadingContent: {
        backgroundColor: theme.colors.neutral.white,
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.lg,
        alignItems: 'center',
        width: '100%',
        maxWidth: 300,
    },
    loadingText: {
        ...theme.typography.presets.header3,
        color: theme.colors.primary.main,
        marginBottom: theme.spacing.md,
    },
    loadingSubText: {
        ...theme.typography.presets.body2,
        color: theme.colors.neutral.grey600,
        textAlign: 'center',
        lineHeight: 20,
    },
});