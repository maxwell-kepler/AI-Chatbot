// services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import configAPI from '../../config/config';
import promptService from './promptService';

const genAI = new GoogleGenerativeAI(configAPI.GEMINI_API_KEY);

export const chatWithGemini = async (message) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const emotionalState = promptService.detectEmotionalState(message);
        const { prompt, isCrisis } = await promptService.generatePrompt(message);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        promptService.updateConversationHistory(message, responseText);

        const insights = promptService.getEmotionalInsights();

        return {
            text: responseText,
            isCrisis,
            emotionalState,
            insights
        };
    } catch (error) {
        console.error('Error details:', error.message);
        throw new Error('Failed to communicate with Gemini AI: ' + error.message);
    }
};