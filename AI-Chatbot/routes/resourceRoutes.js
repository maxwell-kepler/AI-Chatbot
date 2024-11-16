// routes/resourceRoutes.js
const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

console.log('Setting up resource routes');

router.get('/', resourceController.getAllResources);
router.get('/search', resourceController.searchResources);
router.get('/category/:categoryId', resourceController.getResourcesByCategory);

module.exports = router;