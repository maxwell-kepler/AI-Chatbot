// components/specific/Tracking/ConversationSummaryCard/index.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { theme } from '../../../../styles/theme';
import styles from './styles';

const ConversationSummaryCard = ({ summary }) => {
    const [expanded, setExpanded] = useState(false);

    const getRiskLevelColor = (level) => {
        switch (level) {
            case 'high':
                return theme.colors.error.main;
            case 'medium':
                return theme.colors.warning.main;
            case 'low':
                return theme.colors.success.main;
            default:
                return theme.colors.neutral.grey500;
        }
    };

    const getEmotionColor = (emotion) => {
        const emotionColors = {
            anxiety: theme.colors.pastels.coral,
            worry: theme.colors.pastels.coral,
            depression: theme.colors.pastels.mauve,
            sadness: theme.colors.pastels.mauve,
            anger: theme.colors.pastels.rose,
            frustration: theme.colors.pastels.rose,
            neutral: theme.colors.pastels.mint,
            calm: theme.colors.pastels.mint,
            happy: theme.colors.pastels.banana,
            joy: theme.colors.pastels.banana,
            hopeful: theme.colors.pastels.honeydew,
            optimistic: theme.colors.pastels.honeydew,
            fear: theme.colors.pastels.periwinkle,
            stressed: theme.colors.pastels.periwinkle,
            contentment: theme.colors.pastels.mint,
            upbeat: theme.colors.pastels.banana,
            positivity: theme.colors.pastels.honeydew
        };

        return emotionColors[emotion.toLowerCase()] || theme.colors.pastels.mint;
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                onPress={() => setExpanded(!expanded)}
            >
                <View style={styles.headerLeft}>
                    <Text style={styles.date}>
                        {new Date(summary.end_time).toLocaleDateString()} at{' '}
                        {new Date(summary.end_time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                    {summary.risk_level && (
                        <View style={[
                            styles.riskBadge,
                            { backgroundColor: getRiskLevelColor(summary.risk_level) }
                        ]}>
                            <Text style={styles.riskText}>
                                {summary.risk_level.toUpperCase()}
                            </Text>
                        </View>
                    )}
                </View>
                {expanded ? (
                    <ChevronUp size={20} color={theme.colors.neutral.grey600} />
                ) : (
                    <ChevronDown size={20} color={theme.colors.neutral.grey600} />
                )}
            </TouchableOpacity>

            {summary.emotions?.length > 0 && (
                <View style={styles.emotionsContainer}>
                    {summary.emotions.map((emotion, i) => (
                        <View
                            key={i}
                            style={[
                                styles.emotionTag,
                                { backgroundColor: getEmotionColor(emotion.toLowerCase()) }
                            ]}
                        >
                            <Text style={styles.emotionText}>{emotion}</Text>
                        </View>
                    ))}
                </View>
            )}

            {expanded && (
                <View style={styles.expandedContent}>
                    {summary.main_concerns?.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Key Concerns</Text>
                            {summary.main_concerns.map((concern, i) => (
                                <View key={i} style={styles.bulletPoint}>
                                    <Text style={styles.bulletDot}>•</Text>
                                    <Text style={styles.bulletText}>{concern}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {summary.progress_notes?.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Progress Made</Text>
                            {summary.progress_notes.map((note, i) => (
                                <View key={i} style={styles.bulletPoint}>
                                    <Text style={styles.bulletDot}>•</Text>
                                    <Text style={styles.bulletText}>{note}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {summary.recommendations?.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Recommendations</Text>
                            {summary.recommendations.map((rec, i) => (
                                <View key={i} style={styles.bulletPoint}>
                                    <Text style={styles.bulletDot}>•</Text>
                                    <Text style={styles.bulletText}>{rec}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default ConversationSummaryCard;