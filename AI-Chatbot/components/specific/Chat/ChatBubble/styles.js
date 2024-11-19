// components/specific/Chat/ChatBubble/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../../../styles/theme';

export default StyleSheet.create({
    bubbleWrapper: {
        marginVertical: theme.spacing.xs,
        maxWidth: '80%',
    },
    userBubbleWrapper: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    aiBubbleWrapper: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    bubble: {
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.xxs,
    },
    userBubble: {
        backgroundColor: theme.colors.primary.main,
        borderTopRightRadius: theme.spacing.xs,
    },
    aiBubble: {
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
    timestamp: {
        ...theme.typography.presets.caption,
        marginHorizontal: theme.spacing.xs,
    },
    userTimestamp: {
        color: theme.colors.neutral.grey600,
    },
    aiTimestamp: {
        color: theme.colors.neutral.grey600,
    },
    link: {
        color: theme.colors.primary.main,
        textDecorationLine: 'underline',
    }
});