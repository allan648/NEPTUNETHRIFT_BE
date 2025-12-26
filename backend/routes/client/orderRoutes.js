const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/client/orderController'); // Pastikan path benar
const { isAuthenticated } = require('../../middleware/authMiddleware');

router.use(isAuthenticated); // Wajib Login

// 1. Buat Pesanan (Dipakai saat Checkout)
router.post('/', orderController.createOrder);
// 2. Lihat Riwayat (Dipakai di halaman My Order)
router.get('/', orderController.getMyOrders);
// 3. Batalkan Pesanan (Dipakai di halaman My Order)
router.delete('/:id', orderController.cancelOrder);
// 4. Update Status Pembayaran (Callback dari Midtrans)
router.put('/:id/status', orderController.updatePaymentStatus);
// 5. Tandai Selesai (Dipakai di halaman My Order)
router.put('/:id/complete', orderController.completeOrder);

module.exports = router;