// App.js
import React, { useEffect, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppState, View, PanResponder } from 'react-native';
import { useAuth } from './hooks/useAuth';
import LoadingScreen from './screens/LoadingScreen';
import AppNavigator from './navigation/AppNavigator';
import TabBarVisibilityProvider from './context/TabBarVisibilityContext';
import tokenService from './services/auth/tokenService';

const ActivityWrapper = ({ children }) => {
    const { user } = useAuth();

    const handleActivity = useCallback(async () => {
        if (user) {
            console.log('Activity detected');
            await tokenService.updateLastActivity();
        }
    }, [user]);

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false, // don't capture initial touches
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                // only respond to deliberate movements
                return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
            },
            onPanResponderGrant: handleActivity,
            onPanResponderMove: handleActivity,
            onPanResponderTerminationRequest: () => true, // allow other components to take over
            onShouldBlockNativeResponder: () => false, // don't block native responders
        })
    ).current;

    useEffect(() => {
        const activityInterval = setInterval(() => {
            handleActivity();
        }, 30000); // checks every 30 seconds if there's been any interaction

        return () => clearInterval(activityInterval);
    }, [handleActivity]);

    return (
        <View
            style={{ flex: 1 }}
            {...panResponder.panHandlers}
            onTouchStart={handleActivity}
        >
            {children}
        </View>
    );
};

export default function App() {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (user) {
            tokenService.updateLastActivity();

            const handleAppStateChange = async (nextAppState) => {
                if (nextAppState === 'active') {
                    console.log('App came to foreground');
                    await tokenService.updateLastActivity();
                }
            };

            const subscription = AppState.addEventListener('change', handleAppStateChange);

            return () => {
                subscription.remove();
                tokenService.clearTimers();
            };
        }
    }, [user]);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <SafeAreaProvider>
            <TabBarVisibilityProvider>
                <ActivityWrapper>
                    <AppNavigator />
                </ActivityWrapper>
            </TabBarVisibilityProvider>
        </SafeAreaProvider>
    );
}