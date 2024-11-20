// config/api.client.js
import { Platform } from 'react-native';

const LOCAL_IP = '10.0.0.0';
const PORT = '3000';

export const getApiUrl = () => {
    if (Platform.OS === 'android') {
        if (__DEV__) {
            return `http://${LOCAL_IP}:${PORT}/api`;
        }
    }
    return `http://localhost:${PORT}/api`;
};

export const API_URL = getApiUrl();

if (__DEV__) {
    console.log('API Configuration:', {
        LOCAL_IP,
        PORT,
        FULL_URL: API_URL,
        PLATFORM: Platform.OS,
    });
}