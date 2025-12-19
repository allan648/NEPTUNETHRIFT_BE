const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const { isAuthenticated, isAdmin } = require('../../middleware/authMiddleware');

// Proteksi ganda: Harus Login & Harus Admin
router.use(isAuthenticated, isAdmin);

router.get('/users', userController.getAllUsers);
router.put('/users/:id/deactivate', userController.deactivateUser);
router.put('/users/:id/activate', userController.reactivateUser);
module.exports = router;