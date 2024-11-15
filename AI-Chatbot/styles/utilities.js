// styles/utilities.js
import { Platform, PixelRatio, Dimensions } from 'react-native';
import { theme } from './theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Scale font size based on screen size
export const scaleFontSize = (size) => {
    const scale = PixelRatio.getFontScale();
    return Math.round(size * scale);
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

// Create shadow styles based on elevation
export const createShadow = (elevation = 'base') => {
    return theme.shadows[elevation] || theme.shadows.base;
};

// Helper for responsive styles
export const responsive = {
    isSmallDevice: SCREEN_WIDTH < 375,
    isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768,
    isLargeDevice: SCREEN_WIDTH >= 768,
};