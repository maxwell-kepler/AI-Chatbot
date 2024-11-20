// components/specific/Tracking/EmotionalPatternCard/index.js
import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, Clock, Activity } from 'lucide-react-native';
import { theme } from '../../../../styles/theme';
import styles from './styles';

const EmotionalPatternCard = ({ pattern }) => {
    const getPatternIcon = (type) => {
        switch (type) {
            case 'emotion':
                return <Activity size={20} color={theme.colors.primary.main} />;
            case 'stressor':
                return <TrendingUp size={20} color={theme.colors.warning.main} />;
            default:
                return <Clock size={20} color={theme.colors.secondary.main} />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
        });
    };

    const getConfidenceColor = (score) => {
        if (score >= 80) return theme.colors.success.main;
        if (score >= 50) return theme.colors.warning.main;
        return theme.colors.neutral.grey500;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {getPatternIcon(pattern.pattern_type)}
                <View style={styles.headerText}>
                    <Text style={styles.patternType}>
                        {pattern.pattern_type.replace('_', ' ').toUpperCase()}
                    </Text>
                    <Text style={styles.patternValue}>
                        {pattern.pattern_value.replace('_', ' ')}
                    </Text>
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Occurrences</Text>
                    <Text style={styles.statValue}>
                        {pattern.occurrence_count}
                    </Text>
                </View>

                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Confidence</Text>
                    <Text style={[
                        styles.statValue,
                        { color: getConfidenceColor(pattern.confidence_score) }
                    ]}>
                        {Math.round(pattern.confidence_score)}%
                    </Text>
                </View>

                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>First Seen</Text>
                    <Text style={styles.statValue}>
                        {formatDate(pattern.first_detected)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default EmotionalPatternCard;
