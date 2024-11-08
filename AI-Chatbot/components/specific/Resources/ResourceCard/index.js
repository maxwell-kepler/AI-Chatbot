// ResourceCard/index.js
// ResourceCard/index.js
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
        Linking.openURL(resource.website_URL);
    };

    // Filter out any tags that match the category name
    const filteredTags = Array.isArray(resource.tags)
        ? resource.tags.filter(tag => tag !== resource.category_name)
        : [];

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
                <View style={[styles.tag, styles.categoryTag]}>
                    <Text style={styles.categoryTagText}>
                        {resource.category_name}
                    </Text>
                </View>

                {filteredTags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                    </View>
                ))}

                {resource.hours === '24/7' && (
                    <View style={[styles.tag, styles.availabilityTag]}>
                        <Text style={styles.availabilityTagText}>24/7</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default ResourceCard;