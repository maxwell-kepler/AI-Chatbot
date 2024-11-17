// services/database/userService.js
import { API_URL } from "../../config/api.client";

export const userService = {
    createUser: async (userData) => {
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }

            const data = await response.json();
            return {
                success: true,
                user: data
            };
        } catch (error) {
            console.error('Error creating user:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    getUserByFirebaseId: async (firebaseId) => {
        try {
            const response = await fetch(`${API_URL}/users/firebase/${firebaseId}`);

            if (!response.ok) {
                return {
                    success: false,
                    error: 'User not found'
                };
            }

            const data = await response.json();
            return {
                success: true,
                user: data
            };
        } catch (error) {
            console.error('Error fetching user:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    updateLastLogin: async (firebaseId) => {
        try {
            const response = await fetch(`${API_URL}/users/firebase/${firebaseId}/login`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update last login');
            }

            return {
                success: true
            };
        } catch (error) {
            console.error('Error updating last login:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
};