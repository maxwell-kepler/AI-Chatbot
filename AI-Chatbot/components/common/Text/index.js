// src/components/common/Text/index.js
import React from 'react';
import { Text as RNText } from 'react-native';
import { theme } from '../../../styles/theme';

const Text = ({ preset = 'body1', style, children, ...props }) => {
    const baseStyle = theme.typography.presets[preset] || theme.typography.presets.body1;

    return (
        <RNText style={[baseStyle, style]} {...props}>
            {children}
        </RNText>
    );
};

export default Text;