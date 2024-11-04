// styles/typography.js
import { Platform } from 'react-native';

const fontFamily = Platform.select({
    ios: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
    },
    android: {
        regular: 'Roboto',
        medium: 'Roboto-Medium',
        bold: 'Roboto-Bold',
    },
});

export const typography = {
    // Font families
    fonts: {
        primary: fontFamily,
    },

    // Font sizes
    sizes: {
        xs: 12,
        sm: 14,
        base: 16,
        md: 18,
        lg: 20,
        xl: 24,
        '2xl': 30,
        '3xl': 36,
        '4xl': 48,
    },

    // Line heights
    lineHeights: {
        xs: 16,
        sm: 20,
        base: 24,
        md: 28,
        lg: 32,
        xl: 36,
        '2xl': 42,
        '3xl': 48,
        '4xl': 60,
    },

    // Font weights
    weights: {
        thin: '100',
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        black: '900',
    },

    // Pre-defined text styles
    presets: {
        header1: {
            fontSize: 30,
            lineHeight: 42,
            fontWeight: '700',
            letterSpacing: 0.3,
        },
        header2: {
            fontSize: 24,
            lineHeight: 36,
            fontWeight: '600',
            letterSpacing: 0.3,
        },
        header3: {
            fontSize: 20,
            lineHeight: 32,
            fontWeight: '600',
            letterSpacing: 0.3,
        },
        body1: {
            fontSize: 16,
            lineHeight: 24,
            fontWeight: '400',
        },
        body2: {
            fontSize: 14,
            lineHeight: 20,
            fontWeight: '400',
        },
        caption: {
            fontSize: 12,
            lineHeight: 16,
            fontWeight: '400',
        },
        button: {
            fontSize: 16,
            lineHeight: 24,
            fontWeight: '600',
            letterSpacing: 0.5,
        },
    },
};
