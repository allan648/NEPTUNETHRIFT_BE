const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/client/cartController');
const { isAuthenticated } = require('../../middleware/authMiddleware'); 

// Middleware Auth untuk semua route cart
router.use(isAuthenticated);

// 1. Tambah Barang (POST)
router.post('/', cartController.addToCart);

// 2. Lihat Barang (GET)
router.get('/', cartController.getMyCart);

// 3. Update Checkbox/Centang (PUT) -> PENTING: Arahkan ke updateCartItem
router.put('/:id', cartController.updateCartItem);

// 4. Hapus Barang/Sampah (DELETE) -> PENTING: Arahkan ke deleteCartItem
router.delete('/:id', cartController.deleteCartItem);

module.exports = router;