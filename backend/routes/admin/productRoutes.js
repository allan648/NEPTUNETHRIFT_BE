const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');
const { isAuthenticated, isAdmin } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');

// ... import lainnya

// Konfigurasi Upload untuk 3 Field Berbeda
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },   // Foto Utama
  { name: 'image_2', maxCount: 1 }, // Foto Detail 1
  { name: 'image_3', maxCount: 1 }  // Foto Detail 2
]);

router.use(isAuthenticated, isAdmin);
// Update Rute Create & Update
router.post('/', uploadFields, productController.createProduct);
router.put('/:id', uploadFields, productController.updateProduct);

// ...
// Proteksi: Hanya Admin

// Rute Produk
router.get('/', productController.getProducts);         // Lihat semua + Filter
router.get('/metadata', productController.getMetadata); // Ambil list Kategori & Brand (untuk dropdown)
router.post('/', upload.single('image'), productController.createProduct); // Tambah
router.put('/:id', upload.single('image'), productController.updateProduct); // Edit
// router.put('/:id/soft-delete', softDeleteProduct)
router.put('/:id/soft-delete', productController.softDeleteProduct); // Soft Delete
router.put('/:id/restore', productController.restoreProduct);     // Restore
module.exports = router;