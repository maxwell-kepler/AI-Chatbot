//src/services/database/resourceService.js
import { API_URL } from "../../config/api";

export const resourceService = {
    fetchCategories: async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.map(category => ({
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
            return data.map(resource => ({
                ...resource,
                id: resource.resource_ID
            }));
        } catch (error) {
            console.error('Error fetching resources:', error);
            throw error;
        }
    }
};