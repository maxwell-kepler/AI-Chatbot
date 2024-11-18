// screens/TrackingScreen/index.js
import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    Text,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { PieChart } from 'react-native-chart-kit';
import { theme } from '../../styles/theme';
import { trackingService } from '../../services/database/trackingService';
import styles from './styles';
import ConversationSummaryCard from '../../components/specific/Tracking/ConversationSummaryCard';

const TrackingScreen = () => {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [emotionalData, setEmotionalData] = useState([]);
    const [summaries, setSummaries] = useState([]);
    const [patterns, setPatterns] = useState([]);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (!user) {
            setError('Please log in to view your tracking data');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const [emotionalResult, summariesResult, patternsResult] = await Promise.all([
                trackingService.getEmotionalHistory(user.uid),
                trackingService.getConversationSummaries(user.uid),
                trackingService.getEmotionalPatterns(user.uid)
            ]);

            if (emotionalResult.success) {
                setEmotionalData(emotionalResult.data);
            }
            if (summariesResult.success) {
                setSummaries(summariesResult.data);
            }
            if (patternsResult.success) {
                setPatterns(patternsResult.data);
            }
        } catch (error) {
            console.error('Error fetching tracking data:', error);
            setError('Failed to load tracking data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            fetchData();
        }
    }, [authLoading, user]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    if (authLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary.main} />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Please log in to view your tracking data.</Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary.main} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const emotionDistribution = Object.entries(
        emotionalData.reduce((acc, entry) => {
            entry.emotionalState.state.forEach(emotion => {
                acc[emotion] = (acc[emotion] || 0) + 1;
            });
            return acc;
        }, {})
    ).map(([emotion, count]) => {
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
                crisis: theme.colors.error.light,
            };
            return emotionColors[emotion.toLowerCase()] || theme.colors.pastels.mint;
        };

        return {
            name: emotion,
            population: count,
            color: getEmotionColor(emotion),
            legendFontColor: theme.colors.neutral.grey700,
            legendFontSize: 12,
        };
    });

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
        >
            {emotionDistribution.length > 0 ? (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Emotional Distribution</Text>
                    <View style={styles.chartWrapper}>
                        <PieChart
                            data={emotionDistribution}
                            width={300}
                            height={220}
                            chartConfig={{
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                        />
                    </View>
                </View>
            ) : (
                <View style={styles.card}>
                    <Text style={styles.noDataText}>No emotional data available yet.</Text>
                </View>
            )}

            {summaries.length > 0 ? (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Recent Conversations</Text>
                    {summaries.map((summary, index) => (
                        <ConversationSummaryCard
                            key={`summary-${index}`}
                            summary={summary}
                        />
                    ))}
                </View>
            ) : (
                <View style={styles.card}>
                    <Text style={styles.noDataText}>No conversation summaries available yet.</Text>
                </View>
            )}

            {patterns.length > 0 ? (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Emotional Patterns</Text>
                    {patterns.map((pattern, index) => (
                        <View key={index} style={styles.patternItem}>
                            <Text style={styles.patternType}>{pattern.pattern_type}</Text>
                            <Text style={styles.patternValue}>{pattern.pattern_value}</Text>
                            <Text style={styles.patternStats}>
                                Occurred {pattern.occurrence_count} times
                                (Confidence: {Math.round(pattern.confidence_score)}%)
                            </Text>
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.card}>
                    <Text style={styles.noDataText}>No emotional patterns detected yet.</Text>
                </View>
            )}
        </ScrollView>
    );
};

export default TrackingScreen;