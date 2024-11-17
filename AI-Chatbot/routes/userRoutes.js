// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/firebase/:firebaseId', userController.getUserByFirebaseId);
router.put('/firebase/:firebaseId/login', userController.updateLastLogin);
router.get('/firebase/:firebaseId/active-conversations', userController.getActiveConversations);

module.exports = router;