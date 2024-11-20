// components/common/Card/index.js
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Text from '../Text';
import styles from './styles';

const Card = ({
    title,
    description,
    onPress,
    style,
    children,
    leftIcon,
    rightIcon,
    disabled = false,
}) => {
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            style={[styles.container, style]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                {leftIcon && (
                    <View style={styles.leftIcon}>
                        {leftIcon}
                    </View>
                )}
                <View style={styles.titleContainer}>
                    {title && <Text preset="body1" style={styles.title}>{title}</Text>}
                    {description && <Text preset="body2" style={styles.description}>{description}</Text>}
                </View>
                {rightIcon && (
                    <View style={styles.rightIcon}>
                        {rightIcon}
                    </View>
                )}
            </View>
            {children}
        </Container>
    );
};

export default Card;