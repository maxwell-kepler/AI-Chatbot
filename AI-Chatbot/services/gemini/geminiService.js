// services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import configAPI from '../../config/config';
import promptService from './promptService';
import { CRISIS_RESPONSES, CRISIS_KEYWORDS } from '../../config/promptConfig';

const genAI = new GoogleGenerativeAI(configAPI.GEMINI_API_KEY);


export const chatWithGemini = async (message) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const emotionalState = promptService.detectEmotionalState(message);
        const { prompt, isCrisis } = await promptService.generatePrompt(message);

        let responseText;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            responseText = response.text();
        } catch (error) {
            console.log('Gemini response error:', error);
            // If Gemini blocks the response, handle based on emotional state
            if (error.message.includes('SAFETY')) {
                if (message.toLowerCase().includes('hurt myself') ||
                    message.toLowerCase().includes('self harm')) {
                    responseText = CRISIS_RESPONSES.selfHarm;
                } else if (message.toLowerCase().includes('suicide') ||
                    message.toLowerCase().includes('kill myself')) {
                    responseText = CRISIS_RESPONSES.suicidalThoughts;
                } else {
                    responseText = CRISIS_RESPONSES.generalCrisis;
                }
            } else {
                throw error;
            }
        }

        promptService.updateConversationHistory(message, responseText);

        const insights = promptService.getEmotionalInsights();

        return {
            text: responseText,
            isCrisis: isCrisis || emotionalState.requiresAlert,
            emotionalState,
            insights
        };
    } catch (error) {
        console.error('Error details:', error);
        throw new Error('Failed to communicate with Gemini AI: ' + error.message);
    }
};

export const performSafetyCheck = (message) => {
    const lowercaseMessage = message.toLowerCase();

    const hasCriticalContent = CRISIS_KEYWORDS.some(keyword =>
        lowercaseMessage.includes(keyword)
    );

    return {
        isCritical: hasCriticalContent,
        type: hasCriticalContent ? 'immediate_risk' : 'normal'
    };
};