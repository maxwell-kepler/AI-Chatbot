// src/components/specific/Resources/CategoryPill/index.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import * as Icons from 'lucide-react-native';
import { theme } from '../../../../styles/theme';
import styles from './styles';

const CategoryPill = ({ category, isSelected, onSelect }) => {
    const Icon = Icons[category.icon];

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isSelected && styles.selected,
            ]}
            onPress={() => onSelect(category.id)}
        >
            {Icon && <Icon
                size={16}
                color={isSelected ? theme.colors.primary.contrast : theme.colors.primary.main}
                style={styles.icon}
            />}
            <Text style={[
                styles.text,
                isSelected && styles.selectedText,
            ]}>
                {category.name}
            </Text>
        </TouchableOpacity>
    );
};

export default CategoryPill;