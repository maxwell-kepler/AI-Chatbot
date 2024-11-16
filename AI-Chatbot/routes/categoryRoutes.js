// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

console.log('Setting up category routes');

router.get('/', categoryController.getAllCategories);

module.exports = router;