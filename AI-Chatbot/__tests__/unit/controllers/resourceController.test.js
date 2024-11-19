// __tests__/unit/controllers/resourceController.test.js
const request = require('supertest');
const app = require('../../../server-app');
const db = require('../../../config/database');

describe('Resource Controller Tests', () => {
    const testResource = {
        name: 'Test Resource',
        description: 'Test Description',
        category_ID: 1,
        phone: '403-555-0123',
        address: 'Test Address',
        hours: '9-5',
        website_URL: 'https://test.com'
    };

    beforeAll(async () => {
        // clear test data and insert fresh
        await db.execute('DELETE FROM Resources WHERE name = ?', [testResource.name]);
        await db.execute(`
            INSERT INTO Resources (name, description, category_ID, phone, address, hours, website_URL)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            testResource.name,
            testResource.description,
            testResource.category_ID,
            testResource.phone,
            testResource.address,
            testResource.hours,
            testResource.website_URL
        ]);
    });

    afterAll(async () => {
        // Cleanup
        await db.execute('DELETE FROM Resources WHERE name = ?', [testResource.name]);
        await db.end();
    });

    describe('GET /api/resources', () => {
        it('should return all resources', async () => {
            const response = await request(app)
                .get('/api/resources')
                .expect(200);

            expect(response.body.success).toBeTruthy();
            expect(Array.isArray(response.body.data)).toBeTruthy();
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('should include category and tag information', async () => {
            const response = await request(app)
                .get('/api/resources')
                .expect(200);

            const testResourceResponse = response.body.data.find(r => r.name === testResource.name);
            expect(testResourceResponse).toBeDefined();
            expect(testResourceResponse.category_name).toBeDefined();
            expect(testResourceResponse.tags).toBeDefined();
        });
    });

    describe('GET /api/resources/category/:categoryId', () => {
        it('should return resources for valid category', async () => {
            const response = await request(app)
                .get(`/api/resources/category/${testResource.category_ID}`)
                .expect(200);

            expect(response.body.success).toBeTruthy();
            expect(Array.isArray(response.body.data)).toBeTruthy();
            expect(response.body.data.some(r => r.name === testResource.name)).toBeTruthy();
        });

        it('should return empty array for invalid category', async () => {
            const response = await request(app)
                .get('/api/resources/category/999')
                .expect(200);

            expect(response.body.success).toBeTruthy();
            expect(response.body.data).toHaveLength(0);
        });
    });

    describe('GET /api/resources/search', () => {
        it('should find resources by name', async () => {
            const response = await request(app)
                .get('/api/resources/search?query=Test')
                .expect(200);

            expect(response.body.success).toBeTruthy();
            expect(response.body.data.some(r => r.name === testResource.name)).toBeTruthy();
        });

        it('should find resources by description', async () => {
            const response = await request(app)
                .get('/api/resources/search?query=Description')
                .expect(200);

            expect(response.body.success).toBeTruthy();
            expect(response.body.data.some(r => r.name === testResource.name)).toBeTruthy();
        });
    });
});