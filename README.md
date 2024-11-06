# AI-Assisted Mental Health Support Platform

## Overview
This is a React Native mobile application that provides AI-powered mental health support, by using Google Cloud Platform services and Vertex AI with Gemini. The platform offers personalized conversations, emotional state tracking, and crisis support while maintaining user privacy and data security.

## Technology Stack

### Frontend
- **React Native** with Expo for cross-platform mobile development
- **Firebase Authentication** for user management
- **React Navigation** for app navigation

### Backend
- **Node.js** with Express.js
- **MySQL** database (with connection pooling)
- **Google Cloud Platform** with Vertex AI with Gemini Pro
- **Firebase** services integration

### Core Dependencies
```json
{
  "react-native": "0.74.5",
  "expo": "~51.0.28",
  "firebase": "^11.0.1",
  "@react-navigation/native": "^6.1.18",
  "@google/generative-ai": "^0.21.0",
  "express": "^4.21.1",
  "mysql2": "^3.11.4"
}
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Google Cloud CLI
- MySQL database
- Firebase project credentials
- Google Cloud Platform account and API keys

### Installation

1. Clone the repository
```bash
git clone https://github.com/maxwell-kepler/AI-Chatbot.git
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `config.js` file in the `config` directory:
```
GEMINI_API_KEY=your_api_key
GOOGLE_CLOUD_PROJECT=your_project_id
FIREBASE_CONFIG=your_firebase_config
```

4. Modify the a `database.js` file in the `config` directory:
```
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'your_database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
```

5. Modify the `firebase.js` file in the `config` directory:
```
const firebaseConfig = {
    apiKey: "your_api_key",
    authDomain: "your_project_domain,
    databaseURL: "your_project_database_url",
    projectId: "your_project_projectId",
    storageBucket: "your_project_storageBucket",
    messagingSenderId: "your_project_messagingSenderId",
    appId: "your_project_appId",
    measurementId: "your_project_measurementId"
};
```

6. Start the development server
```bash
npx expo start
```

### Database Setup
1. Create MySQL database
2. Run schema migrations
3. Import initial resource data