// screens/BreathingScreen/index.js
import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import styles from './styles';



const BreathingScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text>TO BE IMPLEMENTED:</Text>
                <Text>Guided breathing exercises (this screen)</Text>
                <Text>Guide to journaling (other screen in this section)</Text>
                <Text>Guide to medidating (other screen in this section)</Text>
            </View>
        </ScrollView>
    );
};

export default BreathingScreen;