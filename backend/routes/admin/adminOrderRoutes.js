const express = require('express');
const router = express.Router();
const adminOrderController = require('../../controllers/admin/adminOrderController');
// Pastikan ada middleware admin auth kalau sudah buat, kalau belum skip dulu
// const { verifyToken, isAdmin } = require('../../middleware/authMiddleware');

// router.use(verifyToken, isAdmin); // Proteksi Admin

router.get('/', adminOrderController.getAllOrders);
router.put('/:id/send', adminOrderController.sendOrder);

router.get('/:id', adminOrderController.getOrderDetails);
// Route Admin Tandai Sampai
router.put('/:id/deliver', adminOrderController.setOrderDelivered);

module.exports = router;