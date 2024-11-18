// App.js
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from './hooks/useAuth';
import LoadingScreen from './screens/common/LoadingScreen';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <SafeAreaProvider>
            <AppNavigator />
        </SafeAreaProvider>
    );
}