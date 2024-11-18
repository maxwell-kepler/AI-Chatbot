const request = require('supertest');
const app = require('../../server-app');
const db = require('../../config/database');

describe('Conversations API', () => {
    const testUser = {
        firebaseId: 'test-firebase-id-' + Date.now(),
        email: `test${Date.now()}@example.com`
    };

    let conversationId;

    beforeAll(async () => {
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
        await db.execute('DELETE FROM Messages WHERE conversation_ID IN (SELECT conversation_ID FROM Conversations WHERE user_ID IN (SELECT user_ID FROM Users WHERE firebase_ID = ?))', [testUser.firebaseId]);
        await db.execute('DELETE FROM Conversations WHERE user_ID IN (SELECT user_ID FROM Users WHERE firebase_ID = ?)', [testUser.firebaseId]);
        await db.execute('DELETE FROM Users WHERE firebase_ID = ?', [testUser.firebaseId]);
        await db.execute('DELETE FROM Firebase_Login WHERE email = ?', [testUser.email]);
        await db.end();
    });

    describe('Conversation Creation', () => {
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

        it('should complete conversation with summary', async () => {
            const response = await request(app)
                .put(`/api/conversations/${conversationId}/status`)
                .send({
                    status: 'completed',
                    summary: 'Test conversation summary'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe('completed');
            expect(response.body.data.summary).toBeDefined();
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
            try {
                await request(app)
                    .post(`/api/conversations/${conversationId}/messages`)
                    .send({});
            } catch (error) {
                expect(error.response.status).toBe(500);
                expect(error.response.body.success).toBe(false);
            }
        });

        it('should reject message with empty content', async () => {
            try {
                await request(app)
                    .post(`/api/conversations/${conversationId}/messages`)
                    .send({
                        content: '',
                        senderType: 'user'
                    });
            } catch (error) {
                expect(error.response.status).toBe(500);
                expect(error.response.body.success).toBe(false);
            }
        });
    });
});