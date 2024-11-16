// controllers/resourceController.js
const db = require('../config/database');

class ResourceController {
    getAllResources = async (req, res, next) => {
        try {
            console.log('Fetching all resources');

            const [rows] = await db.execute(`
                SELECT 
                    r.*,
                    c.name as category_name,
                    c.icon as category_icon,
                    GROUP_CONCAT(DISTINCT t.name) as tags
                FROM Resources r
                LEFT JOIN Categories c ON r.category_ID = c.category_ID
                LEFT JOIN Used_In ui ON r.resource_ID = ui.resource_ID
                LEFT JOIN Tags t ON ui.tag_ID = t.tag_ID
                GROUP BY r.resource_ID, r.name, r.description, r.category_ID, 
                         r.phone, r.address, r.hours, r.website_URL,
                         c.name, c.icon
            `);

            const formattedResources = rows.map(resource => ({
                ...resource,
                tags: resource.tags ? resource.tags.split(',') : []
            }));

            console.log(`Found ${formattedResources.length} resources`);
            res.json({
                success: true,
                data: formattedResources
            });

        } catch (error) {
            console.error('Error fetching resources:', error);
            next(error);
        }
    }

    getResourcesByCategory = async (req, res, next) => {
        try {
            const { categoryId } = req.params;
            console.log(`Fetching resources for category: ${categoryId}`);

            const [rows] = await db.execute(`
                SELECT 
                    r.*,
                    c.name as category_name,
                    c.icon as category_icon,
                    GROUP_CONCAT(t.name) as tags
                FROM Resources r
                LEFT JOIN Categories c ON r.category_ID = c.category_ID
                LEFT JOIN Used_In ui ON r.resource_ID = ui.resource_ID
                LEFT JOIN Tags t ON ui.tag_ID = t.tag_ID
                WHERE r.category_ID = ?
                GROUP BY r.resource_ID
            `, [categoryId]);

            const formattedResources = rows.map(resource => ({
                ...resource,
                tags: resource.tags ? resource.tags.split(',') : []
            }));

            res.json({
                success: true,
                data: formattedResources
            });

        } catch (error) {
            console.error('Error fetching resources by category:', error);
            next(error);
        }
    }

    searchResources = async (req, res, next) => {
        try {
            const { query } = req.query;
            console.log(`Searching resources with query: ${query}`);

            const [rows] = await db.execute(`
                SELECT 
                    r.*,
                    c.name as category_name,
                    c.icon as category_icon,
                    GROUP_CONCAT(t.name) as tags
                FROM Resources r
                LEFT JOIN Categories c ON r.category_ID = c.category_ID
                LEFT JOIN Used_In ui ON r.resource_ID = ui.resource_ID
                LEFT JOIN Tags t ON ui.tag_ID = t.tag_ID
                WHERE r.name LIKE ? OR r.description LIKE ?
                GROUP BY r.resource_ID
            `, [`%${query}%`, `%${query}%`]);

            const formattedResources = rows.map(resource => ({
                ...resource,
                tags: resource.tags ? resource.tags.split(',') : []
            }));

            res.json({
                success: true,
                data: formattedResources
            });

        } catch (error) {
            console.error('Error searching resources:', error);
            next(error);
        }
    }
}

module.exports = new ResourceController();