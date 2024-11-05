// src/screens/resources/ResourcesScreen/index.js
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    RefreshControl,
} from 'react-native';
import { Search } from 'lucide-react-native';
import ResourceCard from '../../../components/specific/Resources/ResourceCard';
import CategoryPill from '../../../components/specific/Resources/CategoryPill';
import { theme } from '../../../styles/theme';
import styles from './styles';
import { CATEGORIES, MOCK_RESOURCES } from '../../../data/mockResources';

const ResourcesScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [refreshing, setRefreshing] = useState(false);


    const handleSearch = (text) => {
        setSearchQuery(text);
        // Will implement actual search logic when connected to database
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
        // Will implement category filtering when connected to database
    };

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        // Will implement data refresh when connected to database
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const filteredResources = MOCK_RESOURCES.filter(resource => {
        const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || resource.category === CATEGORIES.find(c => c.id === selectedCategory)?.name;
        return matchesSearch && matchesCategory;
    });

    return (
        <View style={styles.container}>
            <View style={styles.topSection}>
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <Search size={20} color={theme.colors.neutral.grey600} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search resources..."
                            value={searchQuery}
                            onChangeText={handleSearch}
                            placeholderTextColor={theme.colors.neutral.grey500}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.categoriesSection}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContent}
                >
                    {CATEGORIES.map((category) => (
                        <CategoryPill
                            key={category.id}
                            category={category}
                            isSelected={selectedCategory === category.id}
                            onSelect={handleCategorySelect}
                        />
                    ))}
                </ScrollView>
            </View>

            <View style={styles.resourcesSection}>
                <ScrollView
                    contentContainerStyle={styles.resourcesContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={theme.colors.primary.main}
                        />
                    }
                >
                    {filteredResources.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>No resources found</Text>
                        </View>
                    ) : (
                        filteredResources.map((resource) => (
                            <ResourceCard
                                key={resource.id}
                                resource={resource}
                            />
                        ))
                    )}
                </ScrollView>
            </View>

        </View>
    );
};

export default ResourcesScreen;
