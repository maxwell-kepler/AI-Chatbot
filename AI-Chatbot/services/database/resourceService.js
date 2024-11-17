// services/database/resourceService.js
import { API_URL } from "../../config/api.client";

export const resourceService = {
    fetchCategories: async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch categories');
            }

            return data.data.map(category => ({
                ...category,
                id: category.category_ID
            }));

        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    fetchResources: async () => {
        try {
            const response = await fetch(`${API_URL}/resources`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch resources');
            }

            return data.data.map(resource => ({
                ...resource,
                id: resource.resource_ID
            }));

        } catch (error) {
            console.error('Error fetching resources:', error);
            throw error;
        }
    },

    searchResources: async (query) => {
        try {
            const response = await fetch(`${API_URL}/resources/search?query=${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to search resources');
            }

            return data.data;

        } catch (error) {
            console.error('Error searching resources:', error);
            throw error;
        }
    }
};