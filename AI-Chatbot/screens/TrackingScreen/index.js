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
import CrisisEventCard from '../../components/specific/Tracking/CrisisEventCard';
import { API_URL } from '../../config/api.client';
import EmotionalPatternCard from '../../components/specific/Tracking/EmotionalPatternCard';

const TrackingScreen = () => {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [emotionalData, setEmotionalData] = useState([]);
    const [summaries, setSummaries] = useState([]);
    const [patterns, setPatterns] = useState([]);
    const [error, setError] = useState(null);
    const [crisisEvents, setCrisisEvents] = useState([]);
    const [crisisError, setCrisisError] = useState(null);
    const [patternsLoading, setPatternsLoading] = useState(true);

    const fetchPatterns = async () => {
        try {
            const response = await fetch(
                `${API_URL}/tracking/firebase/${user.uid}/emotional-patterns`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch patterns');
            }

            const data = await response.json();
            setPatterns(data.data);
        } catch (error) {
            console.error('Error fetching patterns:', error);
            setError('Failed to load emotional patterns');
        } finally {
            setPatternsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            fetchData();
            fetchPatterns();
        }
    }, [authLoading, user]);

    const fetchData = async () => {
        if (!user) {
            setError('Please log in to view your tracking data');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setCrisisError(null);

            const [
                emotionalResult,
                summariesResult,
                patternsResult,
                crisisResult
            ] = await Promise.all([
                trackingService.getEmotionalHistory(user.uid),
                trackingService.getConversationSummaries(user.uid),
                trackingService.getEmotionalPatterns(user.uid),
                trackingService.getCrisisEvents(user.uid)
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
            if (crisisResult.success) {
                setCrisisEvents(crisisResult.data || []);
            } else {
                setCrisisError(crisisResult.error);
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
                    <Text style={styles.noDataText}>No conversation summaries available yet. If you've had a conversation, please log out to save it.</Text>
                </View>
            )}

            {patterns.length > 0 ? (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Emotional Patterns</Text>
                    <Text style={styles.cardSubtitle}>
                        Patterns detected in your conversations
                    </Text>
                    {patterns.map((pattern, index) => (
                        <EmotionalPatternCard
                            key={`pattern-${index}`}
                            pattern={pattern}
                        />
                    ))}
                </View>
            ) : !patternsLoading && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Emotional Patterns</Text>
                    <Text style={styles.noDataText}>
                        No significant patterns detected yet. Continue having conversations
                        to help identify patterns in your emotional state.
                    </Text>
                </View>
            )}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Crisis Events</Text>
                {crisisError ? (
                    <Text style={styles.errorText}>{crisisError}</Text>
                ) : crisisEvents.length > 0 ? (
                    crisisEvents.map((event) => (
                        <CrisisEventCard
                            key={event.event_ID}
                            event={event}
                        />
                    ))
                ) : (
                    <Text style={styles.noDataText}>No crisis events recorded.</Text>
                )}
            </View>
        </ScrollView>
    );
};

export default TrackingScreen;