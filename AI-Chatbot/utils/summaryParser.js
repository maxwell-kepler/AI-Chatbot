// utils/summaryParser.js
const parseSummary = (summaryText) => {
    try {
        const parsed = {
            emotions: [],
            main_concerns: [],
            progress_notes: [],
            recommendations: []
        };

        const sections = summaryText.split('\n\n');

        for (const section of sections) {
            const lines = section.split('\n');
            const heading = lines[0].toLowerCase();

            const points = lines.slice(1)
                .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
                .filter(line => line.length > 0);

            if (heading.includes('key emotions')) {
                parsed.emotions = points
                    .flatMap(point => point.split(','))
                    .map(emotion => emotion.trim())
                    .filter(emotion => emotion.length > 0);
            } else if (heading.includes('main concerns')) {
                parsed.main_concerns = points;
            } else if (heading.includes('progress made')) {
                parsed.progress_notes = points;
            } else if (heading.includes('recommendations')) {
                parsed.recommendations = points;
            }
        }

        return {
            success: true,
            parsed,
            raw: summaryText
        };
    } catch (error) {
        console.error('Error parsing summary:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { parseSummary };