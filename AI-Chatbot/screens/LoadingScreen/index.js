// screens/LoadingScreen/index.js
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import styles from './styles';
import { colors } from '../../styles/colors';

const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
};

export default LoadingScreen;