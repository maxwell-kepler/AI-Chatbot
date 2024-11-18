// screens/chat/ChatScreen/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.neutral.white,
    },
    chatContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: theme.spacing.md,
        paddingBottom: theme.spacing.xl,
    },
    loadingContainer: {
        padding: theme.spacing.md,
        alignItems: 'center',
    },
    inputWrapper: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.neutral.grey200,
        backgroundColor: theme.colors.neutral.white,
    },
    errorText: {
        ...theme.typography.presets.body1,
        color: theme.colors.error.main,
        textAlign: 'center',
        padding: theme.spacing.lg,
    },
});