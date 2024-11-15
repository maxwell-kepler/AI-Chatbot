// screens/resources/ResourcesScreen/index.js
import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    ScrollView,
    TextInput,
    RefreshControl,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Search } from 'lucide-react-native';
import ResourceCard from '../../../components/specific/Resources/ResourceCard';
import CategoryPill from '../../../components/specific/Resources/CategoryPill';
import { theme } from '../../../styles/theme';
import styles from './styles';
import { resourceService } from '../../../services/database/resourceService';

const ResourcesScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [resources, setResources] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [categoriesData, resourcesData] = await Promise.all([
                resourceService.fetchCategories(),
                resourceService.fetchResources()
            ]);

            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
            setResources(Array.isArray(resourcesData) ? resourcesData : []);
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert(
                'Error',
                'Failed to fetch resources. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    };

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || resource.category_ID === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary.main} />
            </View>
        );
    }

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
                    {categories.map((category) => (
                        <CategoryPill
                            key={category.category_ID}
                            category={{
                                id: category.category_ID,
                                name: category.name,
                                icon: category.icon
                            }}
                            isSelected={selectedCategory === category.category_ID}
                            onSelect={() => handleCategorySelect(category.category_ID)}
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
                    {filteredResources.map((resource) => {
                        const category = categories.find(cat => cat.category_ID === resource.category_ID);

                        return (
                            <ResourceCard
                                key={resource.resource_ID}
                                resource={{
                                    ...resource,
                                    category_name: category ? category.name : 'Unknown Category',
                                }}
                            />
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
};

export default ResourcesScreen;
