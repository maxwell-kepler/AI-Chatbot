// styles/theme.js
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const theme = {
    colors,
    typography,
    spacing,

    // Border radiuses
    borderRadius: {
        none: 0,
        sm: 4,
        base: 8,
        md: 12,
        lg: 16,
        xl: 24,
        full: 9999,
    },

    // Shadows
    shadows: {
        none: {
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
        },
        sm: {
            shadowColor: colors.neutral.black,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.18,
            shadowRadius: 1.0,
            elevation: 1,
        },
        base: {
            shadowColor: colors.neutral.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        lg: {
            shadowColor: colors.neutral.black,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 9,
        },
    },

    // Animation durations
    animation: {
        fast: 200,
        base: 300,
        slow: 500,
    },
};