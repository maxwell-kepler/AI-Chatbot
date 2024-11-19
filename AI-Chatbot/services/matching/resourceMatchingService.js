// services/matching/resourceMatchingService.js
const { API_URL } = require("../../config/api.server");

const matchCrisisToResources = (crisisData) => {
    console.log('=== RESOURCE MATCHING DEBUG ===');
    console.log('Input crisis data:', crisisData);

    const { severity_level, emotional_state, user_age, has_substance_issues, needs_housing } = crisisData;

    const priorities = {
        severe: ['Crisis Support', 'Confidential', 'Professional'],
        moderate: ['Counselling', 'Support Groups', 'Professional'],
        low: ['Support Groups', 'Education', 'Free']
    };

    const additionalTags = [];

    if (user_age && user_age < 25) {
        additionalTags.push('Youth');
    }

    if (has_substance_issues) {
        additionalTags.push('Addiction');
    }

    if (needs_housing) {
        additionalTags.push('Emergency Housing');
    }

    if (emotional_state?.includes('suicidal')) {
        additionalTags.push('Crisis Intervention');
        additionalTags.push('Safety Planning');
    }

    const severityTags = priorities[severity_level] || priorities.moderate;
    console.log('Severity-based tags:', severityTags);
    console.log('Additional tags:', additionalTags);

    const relevantTags = [...new Set([...severityTags, ...additionalTags])];
    console.log('Final combined tags:', relevantTags);

    return relevantTags;
};

export const resourceMatchingService = {
    getMatchingResources: async (crisisData) => {
        try {
            console.log('Getting matching resources for:', crisisData);
            const relevantTags = matchCrisisToResources(crisisData);

            console.log('Making request to:', `${API_URL}/resources/match`);
            console.log('With tags:', relevantTags);

            const response = await fetch(`${API_URL}/resources/match`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tags: relevantTags })
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch matching resources');
            }

            return {
                success: true,
                data: data.data,
                tags: relevantTags
            };
        } catch (error) {
            console.error('Error in getMatchingResources:', error);
            console.error('Error details:', error.stack);
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