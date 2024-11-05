import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator,
    RefreshControl
} from 'react-native';

import { API_URL } from "../../config/api";

export const userService = {
    fetchUsers: async () => {
        try {
            console.log('Fetching users from:', `${API_URL}/users`);

            const response = await fetch(`${API_URL}/users`);
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            // Log the raw response text first
            const text = await response.text();
            console.log('Raw response:', text);

            // Try to parse as JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                throw new Error('Invalid JSON response from server');
            }

            console.log('Parsed data:', data);
            return data;
        } catch (error) {
            console.error('Detailed error:', {
                message: error.message,
                stack: error.stack,
                platform: Platform.OS
            });
            throw error;
        }
    },
    testConnection: async () => {
        try {
            console.log('Testing connection to:', `${API_URL}/test`);

            const response = await fetch(`${API_URL}/test`);
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            const text = await response.text();
            console.log('Raw test response:', text);

            // Try to parse as JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                throw new Error('Invalid JSON response from server');
            }

            console.log('Parsed data:', data);
            return data;
        } catch (error) {
            console.error('Connection test failed:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    },
};