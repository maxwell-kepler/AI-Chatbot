// components/common/Container/index.js
import React from 'react';
import { View } from 'react-native';
import { createSpacing, createShadow } from '../../../styles/utilities';

const Container = ({
    spacing = 'md',
    shadow = 'none',
    style,
    children,
    ...props
}) => {
    const containerStyle = {
        ...createSpacing(spacing),
        ...createShadow(shadow),
        ...style,
    };

    return (
        <View style={containerStyle} {...props}>
            {children}
        </View>
    );
};

export default Container;