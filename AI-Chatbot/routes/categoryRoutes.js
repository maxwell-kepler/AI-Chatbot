// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

console.log('Category controller methods:', {
    getAllCategories: !!categoryController.getAllCategories,
}, '\n');

router.get('/', categoryController.getAllCategories);

module.exports = router;