// src/components/specific/Resources/ResourceCard/index.js
import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react-native';
import { theme } from '../../../../styles/theme';
import styles from './styles';

const ResourceCard = ({ resource }) => {
    const handlePhonePress = () => {
        Linking.openURL(`tel:${resource.phone}`);
    };

    const handleWebsitePress = () => {
        Linking.openURL(resource.website);
    };

    // Find category name based on category_id
    const getCategoryName = () => {
        // This should be replaced with actual category lookup logic
        return resource.categoryName || 'General';
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.name}>{resource.name}</Text>
                <TouchableOpacity onPress={handleWebsitePress}>
                    <ExternalLink size={20} color={theme.colors.primary.main} />
                </TouchableOpacity>
            </View>

            <Text style={styles.description}>{resource.description}</Text>

            <View style={styles.detailsContainer}>
                {resource.address && (
                    <View style={styles.detailRow}>
                        <MapPin size={16} color={theme.colors.neutral.grey600} />
                        <Text style={styles.detailText}>{resource.address}</Text>
                    </View>
                )}

                {resource.phone && (
                    <TouchableOpacity style={styles.detailRow} onPress={handlePhonePress}>
                        <Phone size={16} color={theme.colors.neutral.grey600} />
                        <Text style={[styles.detailText, styles.phone]}>{resource.phone}</Text>
                    </TouchableOpacity>
                )}

                {resource.hours && (
                    <View style={styles.detailRow}>
                        <Clock size={16} color={theme.colors.neutral.grey600} />
                        <Text style={styles.detailText}>{resource.hours}</Text>
                    </View>
                )}
            </View>

            <View style={styles.tagsContainer}>
                <View style={styles.tag}>
                    <Text style={styles.tagText}>{getCategoryName()}</Text>
                </View>
                {resource.hours === '24/7' && (
                    <View style={[styles.tag, { backgroundColor: theme.colors.success.light }]}>
                        <Text style={[styles.tagText, { color: theme.colors.success.dark }]}>24/7</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default ResourceCard;