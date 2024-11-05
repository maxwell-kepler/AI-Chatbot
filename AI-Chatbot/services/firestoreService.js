// src/services/firestoreService.js
import { initializeApp, getApp, getApps } from 'firebase/app';
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';


class FirestoreService {
    async checkDatabaseConnection() {
        try {
            // Try to get a single document from any collection
            const testCollection = collection(db, 'stuff');
            await getDocs(testCollection);

            console.log('Successfully connected to database:', db._databaseId);
            return {
                success: true,
                databaseId: this.db._databaseId
            };
        } catch (error) {
            console.error('Database connection failed:', error);
            return {
                success: false,
                error: error.message,
                databaseId: this.db._databaseId
            };
        }
    }

    async listCollections() {
        try {
            console.log('Attempting to fetch collections...');

            // Get all collections by querying a special collection
            const collections = [];

            // Get the first document from each collection to verify it exists
            const snapshot = await getDocs(collection(db, '__dummy__'));

            // Log the raw snapshot for debugging
            console.log('Raw snapshot:', snapshot);

            // Get the collections paths
            const collectionsData = snapshot.query.firestore._clearPendingWrites();
            console.log('Collections data:', collectionsData);

            return collections;
        } catch (error) {
            console.error('Error listing collections:', error);
            // Instead of throwing, return empty array with error info
            return {
                collections: [],
                error: {
                    message: error.message,
                    code: error.code,
                    name: error.name
                }
            };
        }
    }



    async getAllDocuments(collectionName) {
        try {
            console.log(`Fetching all documents from collection: ${collectionName}`);

            const collectionRef = collection(db, collectionName);
            const querySnapshot = await getDocs(collectionRef);

            if (querySnapshot.empty) {
                console.log(`No documents found in collection ${collectionName}`);
                return [];
            }

            const documents = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            console.log(`Successfully fetched ${documents.length} documents`);
            return documents;

        } catch (error) {
            console.error('Error in getAllDocuments:', {
                error: error.message,
                stack: error.stack,
                code: error.code,
                name: error.name
            });
            throw error;
        }
    }

    async getDocumentById(collectionName, documentId) {
        try {
            console.log(`Fetching document ${documentId} from ${collectionName}`);

            const docRef = doc(db, collectionName, documentId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const document = {
                    id: docSnap.id,
                    ...docSnap.data()
                };
                console.log('Document found:', document);
                return document;
            } else {
                console.log(`Document ${documentId} not found`);
                return null;
            }
        } catch (error) {
            console.error('Error in getDocumentById:', error);
            throw error;
        }
    }

    async queryDocuments(collectionName, field, operator, value) {
        try {
            console.log(`Querying ${collectionName} where ${field} ${operator} ${value}`);

            const q = query(
                collection(db, collectionName),
                where(field, operator, value)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log('No matching documents found');
                return [];
            }

            const documents = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            console.log(`Found ${documents.length} matching documents`);
            return documents;
        } catch (error) {
            console.error('Error in queryDocuments:', error);
            throw error;
        }
    }
}

export default new FirestoreService();