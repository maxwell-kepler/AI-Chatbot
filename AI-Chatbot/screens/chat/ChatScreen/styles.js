import { StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.neutral.white,
    },
    chatContainer: {
        flex: 1,
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
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.neutral.white,
        borderTopWidth: 1,
        borderTopColor: theme.colors.neutral.grey200,
        paddingBottom: Platform.OS === 'ios' ? theme.spacing.xl : 0,
    },
});