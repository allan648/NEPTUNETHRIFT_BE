const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/admin/categoryController');
const { isAuthenticated, isAdmin } = require('../../middleware/authMiddleware');

// Gunakan middleware proteksi jika sudah ada
router.use(isAuthenticated, isAdmin);

router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;