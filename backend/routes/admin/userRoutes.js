// Di routes/admin/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const { isAuthenticated, isAdmin } = require('../../middleware/authMiddleware');

router.use(isAuthenticated, isAdmin);

// Rute GET
router.get('/users', userController.getAllUsers);
router.get('/users/list', userController.getUsersList); 
router.get('/users/:id/detail', userController.getUserDetail);

// Rute ACTION
router.put('/users/:id/deactivate', userController.deactivateUser);
router.put('/users/:id/activate', userController.reactivateUser);

// Rute ROLE (Sekarang memanggil fungsi dari controller)
router.put('/users/:id/role', userController.updateUserRole);

module.exports = router;