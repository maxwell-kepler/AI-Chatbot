// routes/resourceRoutes.js
const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

console.log('Resource controller methods:', {
    getAllResources: !!resourceController.getAllResources,
    searchResources: !!resourceController.searchResources,
    getResourcesByCategory: !!resourceController.getResourcesByCategory,
}, '\n');

router.get('/', resourceController.getAllResources);
router.get('/search', resourceController.searchResources);
router.get('/category/:categoryId', resourceController.getResourcesByCategory);
router.post('/match', resourceController.matchResources);
router.post('/access', resourceController.recordAccess);

module.exports = router;