// services/matching/resourceMatchingService.js
const { API_URL } = require("../../config/api.server");

const CRISIS_INDICATORS = {
    SUBSTANCE: ['substance', 'drug', 'alcohol', 'addiction'],
    HOUSING: ['homeless', 'housing', 'shelter'],
    SUICIDE: ['suicide', 'kill myself', 'end my life', 'suicidal'],
    VIOLENCE: ['abuse', 'violence', 'assault', 'hurt'],
    EMERGENCY: ['emergency', 'crisis', 'urgent', 'immediate'],
    MENTAL_HEALTH: ['anxiety', 'depression', 'panic', 'mental health'],
    YOUTH: ['teen', 'young', 'youth', 'school'],
    FAMILY: ['family', 'parent', 'child', 'domestic']
};

const determineSpecificNeeds = (message = '') => {
    const needs = new Set();
    const lowerMessage = message.toLowerCase();

    Object.entries(CRISIS_INDICATORS).forEach(([category, terms]) => {
        if (terms.some(term => lowerMessage.includes(term))) {
            needs.add(category.toLowerCase());
        }
    });

    if (needs.has('suicide')) {
        needs.add('emergency');
        needs.add('mental_health');
    }

    return Array.from(needs);
};

const matchCrisisToResources = (crisisData) => {
    const {
        severity_level = 'moderate',
        emotional_state = [],
        specific_needs = []
    } = crisisData;

    const priorityMap = {
        severe: ['Crisis Support', 'Crisis Intervention', 'Emergency Services', 'Immediate Help',
            '24/7 Support'
        ],
        moderate: ['Crisis Support', 'Professional', 'Counselling',
            'Crisis Intervention'],
        low: ['Support Groups', 'Counselling', 'Professional']
    };

    let relevantTags = new Set(priorityMap[severity_level] || priorityMap.moderate);

    //need to improve the mapping, still unreliable
    emotional_state.forEach(emotion => {
        switch (emotion.toLowerCase()) {
            case 'crisis':
                relevantTags.add('Crisis Intervention');
                relevantTags.add('Emergency Services');
                break;
            case 'anxiety':
            case 'anxious':
                relevantTags.add('Professional');
                relevantTags.add('Counselling');
                break;
            case 'depression':
            case 'depressed':
                relevantTags.add('Professional');
                relevantTags.add('Crisis Support');
                break;
            case 'suicidal':
                relevantTags.add('Crisis Intervention');
                relevantTags.add('24/7 Support');
                relevantTags.add('Safety Planning');

                break;
        }
    });

    specific_needs.forEach(need => {
        switch (need) {
            case 'substance':
                relevantTags.add('Addiction');
                relevantTags.add('Treatment');
                break;
            case 'housing':
                relevantTags.add('Emergency Housing');
                relevantTags.add('Shelter');
                break;
            case 'suicide':
                relevantTags.add('Crisis Intervention');
                relevantTags.add('Safety Planning');
                break;
            case 'violence':
                relevantTags.add('Crisis Support');
                relevantTags.add('Safety Planning');
                break;
            case 'emergency':
                relevantTags.add('Crisis Support');
                relevantTags.add('Immediate Help');
                break;
        }
    });

    return Array.from(relevantTags);
};

export const resourceMatchingService = {
    getMatchingResources: async (severity_level, emotional_state, message = '') => {
        try {
            console.log('Resource matching input:', { severity_level, emotional_state, message });

            const normalizedEmotionalState = Array.isArray(emotional_state)
                ? emotional_state
                : emotional_state?.state || [];

            const crisisData = {
                severity_level: severity_level || 'moderate',
                emotional_state: normalizedEmotionalState,
                specific_needs: determineSpecificNeeds(message)
            };

            console.log('Normalized crisis data:', crisisData);
            const relevantTags = matchCrisisToResources(crisisData);
            console.log('Matched tags:', relevantTags);

            const response = await fetch(`${API_URL}/resources/match`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tags: relevantTags })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch matching resources');
            }

            const data = await response.json();
            return {
                success: true,
                data: data.data,
                tags: relevantTags
            };

        } catch (error) {
            console.error('Error in getMatchingResources:', error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    },

    recordResourceAccess: async (userId, resourceId, source = 'chat') => {
        try {
            console.log('Recording resource access:', { userId, resourceId, source });

            const response = await fetch(`${API_URL}/resources/access`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    resourceId,
                    referralSource: source
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to record resource access');
            }

            const data = await response.json();
            console.log('Successfully recorded resource access');

            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error('Error recording resource access:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
};