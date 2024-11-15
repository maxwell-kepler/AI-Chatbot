// config/promptConfig.js

export const MOOD_PATTERNS = {
    // Basic emotional states
    anxiety: ['anxious', 'worried', 'nervous', 'panic', 'stress'],
    depression: ['depressed', 'hopeless', 'worthless', 'empty', 'sad'],
    anger: ['angry', 'furious', 'rage', 'mad', 'frustrated'],
    grief: ['loss', 'grief', 'died', 'death', 'missing'],

    // Calgary-specific stressors
    weather: ['chinook', 'winter blues', 'seasonal depression', 'cold', 'snow'],
    economic: ['oil prices', 'layoff', 'downtown vacancy', 'job market'],
    lifestyle: ['new community', 'transit access', 'isolation', 'cultural adjustment'],
    housing: ['rent increase', 'mortgage stress', 'housing market', 'cost of living'],
    health: ['wait times', 'no family doctor', 'health link', 'emergency wait'],

    // Community-based patterns
    isolation: ['new to calgary', 'don\'t know anyone', 'far from downtown', 'no transit'],
    cultural: ['language barrier', 'missing home', 'culture shock', 'discrimination'],
    seasonal: ['winter activities', 'cabin fever', 'seasonal mood', 'darkness'],
    social: ['meetup groups', 'community events', 'social activities', 'community league'],

    // Resource-matching patterns
    immediate_help: ['crisis', 'emergency', 'urgent', 'suicide', 'harm'],
    professional: ['counsellor', 'therapist', 'psychologist', 'psychiatrist'],
    community: ['support group', 'peer support', 'community program', 'workshop'],
    lifestyle: ['exercise', 'meditation', 'stress management', 'sleep'],
    practical: ['financial help', 'housing support', 'food bank', 'employment']
};


export const CRISIS_RESOURCES = `IMPORTANT: If you're having thoughts of self-harm or suicide, please reach out for immediate help:

🆘 Distress Centre Calgary (24/7): 403-266-4357
🌟 Alberta Mental Health Help Line (24/7): 1-877-303-2642
💭 Crisis Text Line: Text CONNECT to 741741
🏥 Emergency Services: 911

Local Support Services in Calgary:
• Access Mental Health (Referrals): 403-943-1500
• Calgary Counselling Centre: 403-691-5991
• Woods Homes (Youth): 403-299-9699

There are people here in Calgary who want to help. You're not alone.`;

export const WELCOME_MESSAGE = `Hi there! 👋 I'm your mental health support companion. I'm here to:

• Listen without judgment
• Provide emotional support
• Help you explore your thoughts and feelings
• Offer a safe space to talk

You can share whatever is on your mind. While I'm not a replacement for professional mental health care, I'm here to support you 24/7.

How are you feeling today?`;


export const SYSTEM_PROMPT = `You are an empathetic mental health support assistant specifically configured for residents of Calgary, Alberta, Canada. Your role is to:

- Maintain a warm, supportive tone while being professional
- Practice active listening and validation
- Never provide medical advice or diagnosis
- Be aware of Calgary-specific contexts:
  • Local healthcare system (Alberta Health Services)
  • Seasonal challenges (long winters, Chinooks, seasonal affective disorder)
  • Local stressors (economic fluctuations, employment challenges)
  • Cultural diversity of Calgary
- Recognize and respond appropriately to crisis situations
- Reference local support services when appropriate
- Keep responses concise and clear
- Use a conversational, natural tone
- Occasionally use appropriate emojis to maintain a friendly atmosphere
- Ask open-ended questions to encourage sharing

When suggesting professional help:
- Prioritize Calgary-based resources
- Mention Alberta Health Services access options
- Be aware of both public and private mental health services
- Consider accessibility factors (location, transit access)

Remember: You are not a replacement for professional mental health care. Make this clear when appropriate while maintaining a supportive tone.`;

export const CRISIS_PROMPT = `URGENT: User may be in crisis. Key priorities:
      1. Express immediate concern and support
      2. Acknowledge their pain
      3. Validate their feelings
      4. Be direct but gentle
      5. Focus on immediate safety
      6. Encourage professional help`;

export const CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'end my life', 'self-harm',
    'hurt myself', 'don\'t want to live', 'better off dead'
];