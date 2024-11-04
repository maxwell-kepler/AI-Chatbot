// src/components/specific/Chat/ChatBubble/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../../../styles/theme';

export default StyleSheet.create({
    container: {
        maxWidth: '80%',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.sm,
    },
    userContainer: {
        alignSelf: 'flex-end',
        backgroundColor: theme.colors.primary.main,
        borderTopRightRadius: theme.spacing.xs,
    },
    aiContainer: {
        alignSelf: 'flex-start',
        backgroundColor: theme.colors.neutral.grey100,
        borderTopLeftRadius: theme.spacing.xs,
    },
    text: {
        ...theme.typography.presets.body1,
    },
    userText: {
        color: theme.colors.neutral.white,
    },
    aiText: {
        color: theme.colors.neutral.grey900,
    },
});