const request = require('supertest');
const app = require('../../server-app');
const db = require('../../config/database');

describe('Resources API', () => {
    let server;

    beforeAll(() => {
        server = app.listen(0);
    });

    afterAll(async () => {
        await db.end();
        await new Promise(resolve => server.close(resolve));
    });


    it('should return all resources', async () => {
        const response = await request(app)
            .get('/api/resources')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });
});