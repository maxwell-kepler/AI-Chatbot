// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

if (process.env.NODE_ENV !== 'test') {
    console.log('Category controller methods:', {
        getAllCategories: !!categoryController.getAllCategories,
    }, '\n');
}

router.get('/', categoryController.getAllCategories);

module.exports = router;