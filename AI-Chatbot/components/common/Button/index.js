// components/common/Button/index.js
import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    View
} from 'react-native';
import { theme } from '../../../styles/theme';
import styles from './styles';

export const BUTTON_VARIANTS = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    OUTLINE: 'outline',
    GHOST: 'ghost',
    DANGER: 'danger',
    SUCCESS: 'success',
};

export const BUTTON_SIZES = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
};

const Button = ({
    title,
    onPress,
    variant = BUTTON_VARIANTS.PRIMARY,
    size = BUTTON_SIZES.MEDIUM,
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    style,
    textStyle,
    ...props
}) => {
    const buttonStyles = [
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.buttonText,
        styles[`${variant}Text`],
        styles[`${size}Text`],
        textStyle,
    ];

    const spinnerColor = variant === BUTTON_VARIANTS.OUTLINE ||
        variant === BUTTON_VARIANTS.GHOST
        ? theme.colors.primary.main
        : theme.colors.neutral.white;

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={spinnerColor} />
            ) : (
                <View style={styles.contentContainer}>
                    {leftIcon && (
                        <View style={styles.iconLeft}>
                            {leftIcon}
                        </View>
                    )}

                    <Text style={textStyles}>
                        {title}
                    </Text>

                    {rightIcon && (
                        <View style={styles.iconRight}>
                            {rightIcon}
                        </View>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};

export default Button;
