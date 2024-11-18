// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

console.log('User controller methods:', {
    createUser: !!userController.createUser,
    getUserByFirebaseId: !!userController.getUserByFirebaseId,
    updateLastLogin: !!userController.updateLastLogin,
    getActiveConversations: !!userController.getActiveConversations,
    deleteUserAccount: !!userController.deleteUserAccount
}, '\n')

router.post('/', userController.createUser);
router.get('/firebase/:firebaseId', userController.getUserByFirebaseId);
router.put('/firebase/:firebaseId/login', userController.updateLastLogin);
router.get('/firebase/:firebaseId/active-conversations', userController.getActiveConversations);
router.delete('/firebase/:firebaseId', userController.deleteUserAccount);

module.exports = router;