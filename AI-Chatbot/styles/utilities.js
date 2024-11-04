// src/styles/utilities.js
import { Platform, PixelRatio } from 'react-native';
import { theme } from './theme';

// Scale font size based on screen size
export const scaleFontSize = (size) => {
    const scale = PixelRatio.getFontScale();
    return Math.round(size * scale);
};

// Combine typography presets with custom styles
export const createTextStyle = (preset, customStyles = {}) => {
    const baseStyle = theme.typography.presets[preset] || theme.typography.presets.body1;
    return {
        ...baseStyle,
        ...customStyles,
    };
};

// Create shadow styles based on elevation
export const createShadow = (elevation = 'base') => {
    return theme.shadows[elevation] || theme.shadows.base;
};

// Create spacing helper
export const createSpacing = (...args) => {
    const directions = ['Top', 'Right', 'Bottom', 'Left'];
    const spacing = {};

    if (args.length === 1) {
        const value = theme.spacing[args[0]] || args[0];
        directions.forEach(dir => {
            spacing[`margin${dir}`] = value;
            spacing[`padding${dir}`] = value;
        });
    } else {
        args.forEach((value, index) => {
            const scaledValue = theme.spacing[value] || value;
            spacing[`margin${directions[index]}`] = scaledValue;
            spacing[`padding${directions[index]}`] = scaledValue;
        });
    }

    return spacing;
};

// Helper for responsive styles
export const responsive = {
    isSmallDevice: width < 375,
    isMediumDevice: width >= 375 && width < 768,
    isLargeDevice: width >= 768,
};