const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/client/cartController');
const { isAuthenticated } = require('../../middleware/authMiddleware'); // Pastikan path ini benar

// Semua rute di bawah ini butuh Login
router.use(isAuthenticated);

router.post('/', cartController.addToCart);       // Tambah Item
router.get('/', cartController.getMyCart);        // Lihat Keranjang
router.delete('/:id', cartController.deleteCartItem); // Hapus Item

module.exports = router;