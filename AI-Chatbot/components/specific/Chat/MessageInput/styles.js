// src/components/specific/Chat/MessageInput/styles.js
import { StyleSheet, Platform } from 'react-native';
import { theme } from '../../../../styles/theme';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: theme.spacing.md,
        paddingBottom: Platform.OS === 'ios' ? theme.spacing.lg : theme.spacing.md,
        backgroundColor: theme.colors.neutral.white,
    },
    input: {
        flex: 1,
        backgroundColor: theme.colors.neutral.grey100,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.sm,
        paddingTop: theme.spacing.sm,
        marginRight: theme.spacing.sm,
        ...theme.typography.presets.body1,
        maxHeight: 100,
        minHeight: 40,
    },
    sendButton: {
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.neutral.grey100,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});