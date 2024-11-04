// src/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import configAPI from '../config';
import promptService from './promptService';

const genAI = new GoogleGenerativeAI(configAPI.GEMINI_API_KEY);

export const chatWithGemini = async (message) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Generate context-aware prompt
        const { prompt, isCrisis, resources } = await promptService.generatePrompt(message);

        // Generate response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        // Update conversation history
        promptService.updateConversationHistory(message, responseText);

        // Return both the response and any resources
        return {
            text: responseText,
            isCrisis,
            resources
        };
    } catch (error) {
        console.error('Error details:', error.message);
        throw new Error('Failed to communicate with Gemini AI: ' + error.message);
    }
};

export const getEmotionalInsights = () => {
    return promptService.getEmotionalInsights();
};