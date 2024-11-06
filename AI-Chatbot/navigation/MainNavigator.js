// navigation/MainNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    MessageCircle,
    Library,
    Settings,
    LineChart,
    Activity
} from 'lucide-react-native';
import { theme } from '../styles/theme';
import ChatScreen from '../screens/chat/ChatScreen';
import ResourcesScreen from '../screens/resources/ResourcesScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import TrackingScreen from '../screens/mood/TrackingScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ChatStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: theme.colors.neutral.white,
            },
            headerTintColor: theme.colors.primary.main,
            headerTitleStyle: {
                ...theme.typography.presets.header3,
            },
            headerShadowVisible: false,
        }}
    >
        <Stack.Screen
            name="ChatMain"
            component={ChatScreen}
            options={{ title: 'AI Support' }}
        />
    </Stack.Navigator>
);

const ResourcesStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: theme.colors.neutral.white,
            },
            headerTintColor: theme.colors.primary.main,
            headerTitleStyle: {
                ...theme.typography.presets.header3,
            },
            headerShadowVisible: false,
        }}
    >
        <Stack.Screen
            name="ResourcesMain"
            component={ResourcesScreen}
            options={{ title: 'Resources' }}
        />
    </Stack.Navigator>
);

const SettingsStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: theme.colors.neutral.white,
            },
            headerTintColor: theme.colors.primary.main,
            headerTitleStyle: {
                ...theme.typography.presets.header3,
            },
            headerShadowVisible: false,
        }}
    >
        <Stack.Screen
            name="SettingsMain"
            component={SettingsScreen}
            options={{ title: 'Settings' }}
        />
    </Stack.Navigator>
);

const TrackingStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: theme.colors.neutral.white,
            },
            headerTintColor: theme.colors.primary.main,
            headerTitleStyle: {
                ...theme.typography.presets.header3,
            },
            headerShadowVisible: false,
        }}
    >
        <Stack.Screen
            name="TrackingMain"
            component={TrackingScreen}
            options={{ title: 'Mood Tracking' }}
        />
    </Stack.Navigator>
);


const MainNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: theme.colors.neutral.white,
                    borderTopColor: theme.colors.neutral.grey200,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: theme.colors.primary.main,
                tabBarInactiveTintColor: theme.colors.neutral.grey600,
                tabBarLabelStyle: {
                    ...theme.typography.presets.caption,
                    marginTop: 4,
                },
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Chat"
                component={ChatStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MessageCircle size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Tracking"
                component={TrackingStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Activity size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Resources"
                component={ResourcesStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Library size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Settings size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default MainNavigator;