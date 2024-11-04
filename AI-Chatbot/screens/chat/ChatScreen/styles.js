import { StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.neutral.white,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    chatContainer: {
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: theme.spacing.md,
        flexGrow: 1,
    },
    loadingContainer: {
        padding: theme.spacing.md,
        alignItems: 'center',
    },
    inputContainer: {
        backgroundColor: theme.colors.neutral.white,
        borderTopWidth: 1,
        borderTopColor: theme.colors.neutral.grey200,
    },
});