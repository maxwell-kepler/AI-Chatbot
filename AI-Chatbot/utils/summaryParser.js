// utils/summaryParser.js
const parseSummary = (summaryText) => {
    try {
        const parsed = {
            emotions: [],
            main_concerns: [],
            progress_notes: [],
            recommendations: []
        };

        const cleanedText = summaryText.replace(/\*\*/g, '');

        const sectionRegex = /(?:^|\n)(Key Emotions:|Main Concerns:|Progress Made:|Recommendations:)/g;
        const sections = cleanedText.split(sectionRegex).filter(Boolean);

        let currentSection = null;
        sections.forEach(section => {
            const trimmedSection = section.trim();

            if (trimmedSection === 'Key Emotions:') {
                currentSection = 'emotions';
            } else if (trimmedSection === 'Main Concerns:') {
                currentSection = 'main_concerns';
            } else if (trimmedSection === 'Progress Made:') {
                currentSection = 'progress_notes';
            } else if (trimmedSection === 'Recommendations:') {
                currentSection = 'recommendations';
            } else if (currentSection) {
                const points = trimmedSection
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.startsWith('-'))
                    .map(line => line.replace(/^-\s*/, '').trim())
                    .filter(line => line.length > 0);

                if (points.length > 0) {
                    parsed[currentSection].push(...points);
                }
            }
        });

        if (parsed.emotions.length === 0) {
            parsed.emotions = ['Neutral'];
        }
        if (parsed.main_concerns.length === 0) {
            parsed.main_concerns = ['No specific concerns identified'];
        }
        if (parsed.progress_notes.length === 0) {
            parsed.progress_notes = ['Conversation initiated'];
        }
        if (parsed.recommendations.length === 0) {
            parsed.recommendations = ['Continue engaging with support services as needed'];
        }

        console.log('Parsed summary:', {
            emotions: parsed.emotions,
            main_concerns: parsed.main_concerns,
            progress_notes: parsed.progress_notes,
            recommendations: parsed.recommendations
        });

        return {
            success: true,
            parsed,
            raw: summaryText
        };
    } catch (error) {
        console.error('Error parsing summary:', error);
        console.error('Original text:', summaryText);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { parseSummary };