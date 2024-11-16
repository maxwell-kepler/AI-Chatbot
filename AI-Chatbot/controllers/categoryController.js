// controllers/categoryController.js
const db = require('../config/database');
class CategoryController {
    getAllCategories = async (req, res, next) => {
        try {
            console.log('Fetching all categories');

            const [categories] = await db.execute('SELECT * FROM Categories');

            res.json({
                success: true,
                data: categories
            });

        } catch (error) {
            console.error('Error fetching categories:', error);
            next(error);
        }
    }
}

module.exports = new CategoryController();