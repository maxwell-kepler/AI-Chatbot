// ResourceCard/styles.js
import { StyleSheet } from 'react-native';
import { theme } from '../../../../styles/theme';

export default StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        flex: 1,
    },
    description: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 12,
    },
    detailsContainer: {
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#666666',
        marginLeft: 8,
        flex: 1,
    },
    phone: {
        color: '#007AFF',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    tag: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 12,
        color: '#666666',
        fontWeight: '500',
    },
    categoryTag: {
        backgroundColor: '#E3F2FD',
    },
    categoryTagText: {
        fontSize: 12,
        color: '#1976D2',
        fontWeight: '600',
    },
    availabilityTag: {
        backgroundColor: '#E8F5E9',
    },
    availabilityTagText: {
        fontSize: 12,
        color: '#2E7D32',
        fontWeight: '500',
    },
});