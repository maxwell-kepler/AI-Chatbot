# AI-Assisted Mental Health Support Platform

## Overview
This is a React Native mobile application that provides AI-powered mental health support, by using Google Cloud Platform services and Vertex AI with Gemini. The platform offers personalized conversations, emotional state tracking, and crisis support.

## Technology Stack

### Frontend
- **React Native with Expo** for cross-platform mobile development
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
Incase there is a version conflict error with the `npm install`, run the following instead.
```bash
npm install --save-dev --legacy-peer-deps
```

3. Configure environment variables

a. Modify the following values from the `api.client.js` file in the `config` directory. To get your `LOCAL_IP` value, run the command `ipconfig` in a terminal, and copy the IPv4 address.
```
const LOCAL_IP = '10.0.0.0';
```  
b. Modify the following values from the `api.server.js` file in the `config` directory. Use the same `LOCAL_IP` value as before.
```
const LOCAL_IP = '10.0.0.0';
```  
c. Modify the following values from the `config.js` file in the `config` directory. I've included my values in the project submission in case you don't want to create a new Google Cloud project.
```
GEMINI_API_KEY=your_api_key
GOOGLE_CLOUD_PROJECT=your_project_id
```
d. Modify the following values from the `database.js` file in the `config` directory. Replace the password with your MySQL password.
```
const dbConfig = {
    password: 'your_password',
};
```
e. Modify the following values from the`firebase.js` file in the `config` directory. I've included my values in the project submission in case you don't want to create a new Firebase project.
```
const firebaseConfig = {
    apiKey: "your_api_key",
    authDomain: "your_project_domain",
    databaseURL: "your_project_database_url",
    projectId: "your_project_projectId",
    storageBucket: "your_project_storageBucket",
    messagingSenderId: "your_project_messagingSenderId",
    appId: "your_project_appId",
    measurementId: "your_project_measurementId"
};
```

4. Set up the database by opening the two files in the `SQL` folder in the `MySQL Dashboard`. First run the `TableCreation.sql` file, then the `PopulateDatabase.sql` file.

5. To check that the backend and database is working, run the test suite.
```bash
npm test
```
6. If the tests passed, start the development server.
```bash
npx expo start
```
7. Start the backend server.
```bash
node .\server.js
```
8. Install `Expo Go` on your mobile application, and scan the QR code on screen. The app should now be running.

### Database Setup
1. Create MySQL database
2. Run schema migrations
3. Import initial resource data