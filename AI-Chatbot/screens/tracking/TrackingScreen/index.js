// screens/tracking/TrackingScreen/index.js
import React from 'react';
import { View, ScrollView, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { theme } from '../../../styles/theme';
import styles from './styles';

// Get screen width and calculate chart width with padding
const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - (theme.spacing.layout.page * 2 + theme.spacing.lg * 2);

// Mock data
const emotionDistribution = [
    { name: 'Happy', population: 35, color: theme.colors.pastels.banana, legendFontColor: '#7F7F7F' },
    { name: 'Anxious', population: 20, color: theme.colors.pastels.coral, legendFontColor: '#7F7F7F' },
    { name: 'Neutral', population: 25, color: theme.colors.pastels.honeydew, legendFontColor: '#7F7F7F' },
    { name: 'Sad', population: 10, color: theme.colors.pastels.mint, legendFontColor: '#7F7F7F' },
    { name: 'Stressed', population: 10, color: theme.colors.pastels.mauve, legendFontColor: '#7F7F7F' },
];

const recentMoods = [
    { date: 'Today 2:30 PM', mood: 'Happy', note: 'Feeling productive and energetic' },
    { date: 'Today 10:00 AM', mood: 'Anxious', note: 'Morning meeting stress' },
    { date: 'Yesterday 8:00 PM', mood: 'Content', note: 'Relaxing evening' },
    { date: 'Yesterday 3:00 PM', mood: 'Stressed', note: 'Work deadline approaching' },
];

const chartConfig = {
    backgroundColor: theme.colors.neutral.white,
    backgroundGradientFrom: theme.colors.neutral.white,
    backgroundGradientTo: theme.colors.neutral.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: theme.colors.primary.main
    },
    propsForLabels: {
        fontSize: 12,
    },
    style: {
        borderRadius: 16,
    },
    propsForBackgroundLines: {
        strokeWidth: 1,
        stroke: theme.colors.neutral.grey200,
    },
};

const TrackingScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>

                {/* Recent Moods Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Recent Moods</Text>
                    {recentMoods.map((entry, index) => (
                        <View key={index} style={styles.moodEntry}>
                            <Text style={styles.moodDate}>{entry.date}</Text>
                            <Text style={styles.moodText}>{entry.mood}</Text>
                            <Text style={styles.moodNote}>{entry.note}</Text>
                        </View>
                    ))}
                </View>


                {/* Emotion Distribution Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Emotion Distribution</Text>
                    <View style={styles.chartWrapper}>
                        <PieChart
                            data={emotionDistribution}
                            width={chartWidth}
                            height={220}
                            chartConfig={chartConfig}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="0"
                            center={[0, 0]}
                            absolute
                            style={styles.chart}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default TrackingScreen;