const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/client/orderController');

// --- PERBAIKAN DI SINI ---
// Kita import 'isAuthenticated' (sesuai nama di file authMiddleware.js Anda)
const { isAuthenticated } = require('../../middleware/authMiddleware'); 

// Route Membuat Order
// Gunakan 'isAuthenticated' sebagai penjaga (middleware)
router.post('/', isAuthenticated, orderController.createOrder);

module.exports = router;