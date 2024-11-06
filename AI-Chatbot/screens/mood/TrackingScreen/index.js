import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../styles/theme';
import Text from '../../../components/common/Text';

const TrackingScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.neutral.white }}>
            <ScrollView>
                <View className="p-4">
                    <Text preset="header2" className="mb-4">TO BE IMPLEMENTED</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TrackingScreen;