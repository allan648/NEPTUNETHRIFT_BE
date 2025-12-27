const express = require('express');
const router = express.Router();
const brandController = require('../../controllers/admin/brandController');
const { isAuthenticated, isAdmin } = require('../../middleware/authMiddleware');

// Proteksi: Hanya Admin yang bisa mengelola Brand
router.use(isAuthenticated, isAdmin);

// Endpoint: /api/admin/brands
router.get('/', brandController.getAllBrands);       // GET untuk ambil data
router.post('/', brandController.createBrand);      // POST untuk tambah data
router.put('/:id', brandController.updateBrand);    // PUT untuk edit data
router.delete('/:id', brandController.deleteBrand); // DELETE untuk hapus data

module.exports = router;