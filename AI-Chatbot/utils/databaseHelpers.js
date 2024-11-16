// utils/databaseHelpers.js
const formatResourceResponse = (resource) => ({
    ...resource,
    tags: resource.tags ? resource.tags.split(',') : [],
    id: resource.resource_ID,
    category_name: resource.category_name || 'Uncategorized'
});

const executeQuery = async (db, query, params = []) => {
    try {
        const [rows] = await db.execute(query, params);
        return rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error(`Database query failed: ${error.message}`);
    }
};

module.exports = {
    formatResourceResponse,
    executeQuery
};