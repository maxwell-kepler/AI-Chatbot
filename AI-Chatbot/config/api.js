// config/api.js
import { Platform } from 'react-native';

const LOCAL_IP = '10.0.0.31'; // Your current IP address
const PORT = '3000';

const getApiUrl = () => {
    if (Platform.OS === 'android') {
        // For Android Emulator
        if (__DEV__) {
            return `http://${LOCAL_IP}:${PORT}/api`;
        }
    }
    // For iOS Simulator
    return `http://localhost:${PORT}/api`;
};

export const API_URL = getApiUrl();

console.log('Using API URL:', API_URL); // For debugging