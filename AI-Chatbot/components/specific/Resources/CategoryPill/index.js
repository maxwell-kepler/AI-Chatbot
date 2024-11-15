// components/specific/Resources/CategoryPill/index.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import {
    AlertCircle,
    MessageCircle,
    Users,
    Heart,
    HelpCircle,
    Smile
} from 'lucide-react-native';
import { theme } from '../../../../styles/theme';
import styles from './styles';

// Icon mapping object
const IconMap = {
    'alert-circle': AlertCircle,
    'message-circle': MessageCircle,
    'users': Users,
    'heart': Heart,
    'help-circle': HelpCircle,
    'smile': Smile
};


const CategoryPill = ({ category, isSelected, onSelect }) => {
    const IconComponent = IconMap[category.icon];

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isSelected && styles.selected,
            ]}
            onPress={() => onSelect(category.id)}
        >
            {IconComponent && (
                <IconComponent
                    size={16}
                    color={isSelected ? theme.colors.primary.contrast : theme.colors.primary.main}
                    style={styles.icon}
                />
            )}
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