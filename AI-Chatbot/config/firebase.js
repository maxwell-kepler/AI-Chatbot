// config/FirebaseConfig.js

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeFirestore, getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
let auth;
if (process.env.NODE_ENV === 'test') {
    auth = initializeAuth(app, {});
} else {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
}

const db = getFirestore(this.app, {
    databaseId: 'chatbotdb'
});

export { auth, db };