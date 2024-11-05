import { Router } from 'express';
const router = Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
    try {
        const [resources] = await db.execute(`
            SELECT 
                r.id,
                r.name,
                r.description,
                r.phone,
                r.address,
                r.hours,
                r.website,
                c.name as category,
                c.icon as categoryIcon,
                GROUP_CONCAT(t.name) as tags
            FROM resources r
            JOIN categories c ON r.category_id = c.id
            LEFT JOIN resource_tags rt ON r.id = rt.resource_id
            LEFT JOIN tags t ON rt.tag_id = t.id
            GROUP BY r.id
        `);

        // Transform tags from comma-separated string to array
        const formattedResources = resources.map(resource => ({
            ...resource,
            tags: resource.tags ? resource.tags.split(',') : []
        }));

        res.json(formattedResources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get resources by category
router.get('/category/:categoryId', async (req, res) => {
    try {
        const [resources] = await db.execute(`
            SELECT 
                r.id,
                r.name,
                r.description,
                r.phone,
                r.address,
                r.hours,
                r.website,
                c.name as category,
                c.icon as categoryIcon,
                GROUP_CONCAT(t.name) as tags
            FROM resources r
            JOIN categories c ON r.category_id = c.id
            LEFT JOIN resource_tags rt ON r.id = rt.resource_id
            LEFT JOIN tags t ON rt.tag_id = t.id
            WHERE c.id = ?
            GROUP BY r.id
        `, [req.params.categoryId]);

        const formattedResources = resources.map(resource => ({
            ...resource,
            tags: resource.tags ? resource.tags.split(',') : []
        }));

        res.json(formattedResources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const [categories] = await db.execute('SELECT * FROM categories');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search resources
router.get('/search', async (req, res) => {
    const { query } = req.query;

    try {
        const [resources] = await db.execute(`
            SELECT 
                r.id,
                r.name,
                r.description,
                r.phone,
                r.address,
                r.hours,
                r.website,
                c.name as category,
                c.icon as categoryIcon,
                GROUP_CONCAT(t.name) as tags
            FROM resources r
            JOIN categories c ON r.category_id = c.id
            LEFT JOIN resource_tags rt ON r.id = rt.resource_id
            LEFT JOIN tags t ON rt.tag_id = t.id
            WHERE r.name LIKE ? OR r.description LIKE ?
            GROUP BY r.id
        `, [`%${query}%`, `%${query}%`]);

        const formattedResources = resources.map(resource => ({
            ...resource,
            tags: resource.tags ? resource.tags.split(',') : []
        }));

        res.json(formattedResources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;