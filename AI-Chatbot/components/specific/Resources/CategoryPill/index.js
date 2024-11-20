// components/specific/Resources/CategoryPill/index.js
import React from 'react';
import {
    AlertCircle,
    MessageCircle,
    Users,
    Heart,
    HelpCircle,
    Smile
} from 'lucide-react-native';
import Card from '../../../common/Card';
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
        <Card
            title={category.name}
            style={[
                styles.container,
                isSelected && styles.selected,
            ]}
            onPress={() => onSelect(category.id)}
            leftIcon={
                IconComponent && (
                    <IconComponent
                        size={16}
                        color={isSelected ? theme.colors.primary.contrast : theme.colors.primary.main}
                        style={{ marginRight: 4 }}
                    />
                )
            }
            titleStyle={[
                { color: theme.colors.primary.main },
                isSelected && { color: theme.colors.primary.contrast }
            ]}
        />
    );
};
export default CategoryPill;