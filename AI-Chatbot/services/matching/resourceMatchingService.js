// services/matching/resourceMatchingService.js
const { API_URL } = require("../../config/api.server");

const CRISIS_INDICATORS = {
    SUBSTANCE: ['substance', 'drug', 'alcohol', 'addiction'],
    HOUSING: ['homeless', 'housing', 'shelter'],
    SUICIDE: ['suicide', 'kill', 'die', 'end my life'],
    VIOLENCE: ['abuse', 'violence', 'assault', 'hurt'],
    EMERGENCY: ['emergency', 'crisis', 'urgent', 'immediate']
};

const determineSpecificNeeds = (message = '') => {
    const needs = [];
    const lowerMessage = message.toLowerCase();

    if (CRISIS_INDICATORS.SUBSTANCE.some(term => lowerMessage.includes(term))) {
        needs.push('substance');
    }
    if (CRISIS_INDICATORS.HOUSING.some(term => lowerMessage.includes(term))) {
        needs.push('housing');
    }
    if (CRISIS_INDICATORS.SUICIDE.some(term => lowerMessage.includes(term))) {
        needs.push('suicide');
    }
    if (CRISIS_INDICATORS.VIOLENCE.some(term => lowerMessage.includes(term))) {
        needs.push('violence');
    }
    if (CRISIS_INDICATORS.EMERGENCY.some(term => lowerMessage.includes(term))) {
        needs.push('emergency');
    }

    return needs;
};

const matchCrisisToResources = (crisisData) => {
    const {
        severity_level = 'moderate',
        emotional_state = [],
        specific_needs = []
    } = crisisData;

    const priorityMap = {
        severe: ['Crisis Support', 'Crisis Intervention', 'Emergency Services', 'Immediate Help'],
        moderate: ['Crisis Support', 'Professional', 'Counselling'],
        low: ['Support Groups', 'Counselling', 'Professional']
    };

    let relevantTags = new Set(priorityMap[severity_level] || priorityMap.moderate);

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

    recordResourceAccess: async (userId, resourceId, source = 'crisis') => {
        try {
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
                throw new Error('Failed to record resource access');
            }

            const data = await response.json();
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