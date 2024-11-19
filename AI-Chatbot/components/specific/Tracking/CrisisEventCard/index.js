// components/specific/Tracking/CrisisEventCard/index.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react-native';
import { theme } from '../../../../styles/theme';
import styles from './styles';

const CrisisEventCard = ({ event }) => {
    const [expanded, setExpanded] = useState(false);

    const getSeverityColor = (level) => {
        switch (level) {
            case 'critical':
                return theme.colors.error.main;
            case 'severe':
                return theme.colors.error.light;
            case 'moderate':
                return theme.colors.warning.main;
            default:
                return theme.colors.neutral.grey500;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = () => {
        return event.resolved_at ? theme.colors.success.main : theme.colors.warning.main;
    };

    const getStatusText = () => {
        return event.resolved_at ? 'Resolved' : 'Ongoing';
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                onPress={() => setExpanded(!expanded)}
            >
                <View style={styles.headerLeft}>
                    <AlertTriangle
                        size={20}
                        color={getSeverityColor(event.severity_level)}
                        style={styles.icon}
                    />
                    <View style={styles.headerInfo}>
                        <Text style={styles.timestamp}>
                            {formatDate(event.timestamp)}
                        </Text>
                        <View style={[
                            styles.severityBadge,
                            { backgroundColor: getSeverityColor(event.severity_level) }
                        ]}>
                            <Text style={styles.severityText}>
                                {event.severity_level.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                    <Text style={styles.statusText}>{getStatusText()}</Text>
                </View>
                {expanded ? (
                    <ChevronUp size={20} color={theme.colors.neutral.grey600} />
                ) : (
                    <ChevronDown size={20} color={theme.colors.neutral.grey600} />
                )}
            </TouchableOpacity>

            {expanded && (
                <View style={styles.expandedContent}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Action Taken</Text>
                        <Text style={styles.sectionText}>{event.action_taken}</Text>
                    </View>

                    {event.resolution_notes && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Resolution Notes</Text>
                            <Text style={styles.sectionText}>{event.resolution_notes}</Text>
                        </View>
                    )}

                    {event.resolved_at && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Resolved At</Text>
                            <Text style={styles.sectionText}>
                                {formatDate(event.resolved_at)}
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default CrisisEventCard;