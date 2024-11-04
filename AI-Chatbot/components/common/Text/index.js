// components/common/Text/index.js
import React from 'react';
import { Text as RNText } from 'react-native';
import { createTextStyle } from '../../../styles/utilities';

const Text = ({ preset = 'body1', style, children, ...props }) => {
    const textStyle = createTextStyle(preset, style);
    return (
        <RNText style={textStyle} {...props}>
            {children}
        </RNText>
    );
};

export default Text;