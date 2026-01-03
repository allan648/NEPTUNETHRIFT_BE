const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');
const { isAuthenticated, isAdmin } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');
const db = require('../../db'); // Pastikan db diimport untuk rute inline

// Konfigurasi Upload untuk 3 Field
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'image_2', maxCount: 1 },
  { name: 'image_3', maxCount: 1 }
]);

// ==========================================
// RUTE PUBLIK (Bisa diakses Customer & Guest)
// ==========================================

router.get('/promo', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM products WHERE is_promotion = 1 AND status = 'active'");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Gagal ambil data promo" });
    }
});

router.get('/metadata', productController.getMetadata); // Untuk filter di frontend
router.get('/', productController.getProducts);         // List produk publik
router.get('/:id', productController.getProductDetail); // DETAIL PRODUK (Penting!)

// ==========================================
// RUTE ADMIN (Hanya Admin yang bisa akses)
// ==========================================

router.use(isAuthenticated, isAdmin); // Proteksi mulai dari sini ke bawah

router.post('/', uploadFields, productController.createProduct);
router.put('/:id', uploadFields, productController.updateProduct);
router.put('/:id/soft-delete', productController.softDeleteProduct);
router.put('/:id/restore', productController.restoreProduct);

module.exports = router;