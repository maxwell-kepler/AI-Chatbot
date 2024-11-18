// __tests__/integration/conversations.test.js
const request = require('supertest');
const app = require('../../server-app');
const db = require('../../config/database');
jest.mock('../../services/summary/summaryService', () => require('../mocks/summaryService'));

describe('Conversations API', () => {
    const testUser = {
        firebaseId: 'test-firebase-id-' + Date.now(),
        email: `test${Date.now()}@example.com`
    };

    let conversationId;

    beforeAll(async () => {
        await db.execute('DELETE FROM Conversation_Summaries WHERE conversation_ID IN (SELECT conversation_ID FROM Conversations WHERE user_ID IN (SELECT user_ID FROM Users WHERE firebase_ID = ?))', [testUser.firebaseId]);
        await db.execute('DELETE FROM Messages WHERE conversation_ID IN (SELECT conversation_ID FROM Conversations WHERE user_ID IN (SELECT user_ID FROM Users WHERE firebase_ID = ?))', [testUser.firebaseId]);
        await db.execute('DELETE FROM Conversations WHERE user_ID IN (SELECT user_ID FROM Users WHERE firebase_ID = ?)', [testUser.firebaseId]);
        await db.execute('DELETE FROM Users WHERE firebase_ID = ?', [testUser.firebaseId]);
        await db.execute('DELETE FROM Firebase_Login WHERE email = ?', [testUser.email]);

        await request(app)
            .post('/api/users')
            .send({
                firebaseId: testUser.firebaseId,
                email: testUser.email,
                name: 'Test User'
            });
    });

    afterAll(async () => {
        await db.execute('DELETE FROM Conversation_Summaries WHERE conversation_ID IN (SELECT conversation_ID FROM Conversations WHERE user_ID IN (SELECT user_ID FROM Users WHERE firebase_ID = ?))', [testUser.firebaseId]);
        await db.execute('DELETE FROM Messages WHERE conversation_ID IN (SELECT conversation_ID FROM Conversations WHERE user_ID IN (SELECT user_ID FROM Users WHERE firebase_ID = ?))', [testUser.firebaseId]);
        await db.execute('DELETE FROM Conversations WHERE user_ID IN (SELECT user_ID FROM Users WHERE firebase_ID = ?)', [testUser.firebaseId]);
        await db.execute('DELETE FROM Users WHERE firebase_ID = ?', [testUser.firebaseId]);
        await db.execute('DELETE FROM Firebase_Login WHERE email = ?', [testUser.email]);
        await db.end();
    });

    describe('Conversation Creation and Basic Operations', () => {
        it('should create a new conversation', async () => {
            const response = await request(app)
                .post('/api/conversations')
                .send({
                    userId: testUser.firebaseId,
                    status: 'active'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.conversationId).toBeDefined();

            conversationId = response.body.conversationId;
        });

        it('should fail to create conversation with invalid user', async () => {
            const response = await request(app)
                .post('/api/conversations')
                .send({
                    userId: 'invalid-user-id',
                    status: 'active'
                });

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
        });
    });

    describe('Message Management', () => {
        it('should add a user message to conversation', async () => {
            const response = await request(app)
                .post(`/api/conversations/${conversationId}/messages`)
                .send({
                    content: 'Test user message',
                    senderType: 'user'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.messageId).toBeDefined();
        });

        it('should add an AI message to conversation', async () => {
            const response = await request(app)
                .post(`/api/conversations/${conversationId}/messages`)
                .send({
                    content: 'Test AI response',
                    senderType: 'ai',
                    emotionalState: { state: ['neutral'] }
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.messageId).toBeDefined();
        });

        it('should retrieve conversation messages', async () => {
            const response = await request(app)
                .get(`/api/conversations/${conversationId}/messages`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(2);
        });
    });

    describe('Summary Management', () => {
        it('should generate a summary for an active conversation', async () => {
            await request(app)
                .post(`/api/conversations/${conversationId}/messages`)
                .send({
                    content: 'Another test message',
                    senderType: 'user'
                });

            const response = await request(app)
                .get(`/api/conversations/${conversationId}/summary`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.summary).toBeDefined();
            expect(response.body.data.structured).toBeDefined();
            expect(Array.isArray(response.body.data.structured.emotions)).toBe(true);
            expect(Array.isArray(response.body.data.structured.main_concerns)).toBe(true);
            expect(Array.isArray(response.body.data.structured.progress_notes)).toBe(true);
            expect(Array.isArray(response.body.data.structured.recommendations)).toBe(true);
        });

        it('should get the latest summary for a conversation', async () => {
            await request(app)
                .get(`/api/conversations/${conversationId}/summary`);

            const response = await request(app)
                .get(`/api/conversations/${conversationId}/summary/latest`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toMatchObject({
                conversation_ID: expect.any(Number),
                emotions: expect.arrayContaining([
                    expect.any(String)
                ]),
                main_concerns: expect.arrayContaining([
                    expect.any(String)
                ]),
                progress_notes: expect.arrayContaining([
                    expect.any(String)
                ]),
                recommendations: expect.arrayContaining([
                    expect.any(String)
                ]),
                raw_summary: expect.any(String),
                created_at: expect.any(String)
            });

            expect(Array.isArray(response.body.data.emotions)).toBe(true);
            expect(Array.isArray(response.body.data.main_concerns)).toBe(true);
            expect(Array.isArray(response.body.data.progress_notes)).toBe(true);
            expect(Array.isArray(response.body.data.recommendations)).toBe(true);
        });
    });

    describe('Conversation Status Management', () => {
        it('should update conversation to liminal state', async () => {
            const response = await request(app)
                .put(`/api/conversations/${conversationId}/status`)
                .send({ status: 'liminal' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe('liminal');
        });

        it('should not allow invalid status transition', async () => {
            const response = await request(app)
                .put(`/api/conversations/${conversationId}/status`)
                .send({ status: 'invalid_status' });

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
        });

        it('should complete conversation and generate final summary', async () => {
            const response = await request(app)
                .put(`/api/conversations/${conversationId}/status`)
                .send({ status: 'completed' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe('completed');

            await new Promise(resolve => setTimeout(resolve, 100));

            const summaryResponse = await request(app)
                .get(`/api/conversations/${conversationId}/summary/latest`);

            expect(summaryResponse.status).toBe(200);
            expect(summaryResponse.body.success).toBe(true);
            expect(summaryResponse.body.data).toBeDefined();
        });
    });


    describe('Error Handling', () => {
        it('should return empty array for non-existent conversation', async () => {
            const response = await request(app)
                .get('/api/conversations/99999/messages');
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        });

        it('should handle malformed message requests', async () => {
            const response = await request(app)
                .post(`/api/conversations/${conversationId}/messages`)
                .send({});

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
        });

        it('should reject message with empty content', async () => {
            const response = await request(app)
                .post(`/api/conversations/${conversationId}/messages`)
                .send({
                    content: '',
                    senderType: 'user'
                });

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
        });
    });
});