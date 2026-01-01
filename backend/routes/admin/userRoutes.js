const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const { isAuthenticated, isAdmin } = require('../../middleware/authMiddleware');

// Proteksi ganda: Harus Login & Harus Admin
router.use(isAuthenticated, isAdmin);

// 1. Ambil SEMUA user (untuk halaman utama Management User)
router.get('/users', userController.getAllUsers);

// 2. Ambil User List (khusus untuk fitur Add Admin / pencarian email)
// PASTIKAN BARIS INI ADA
router.get('/users/list', userController.getUsersList); 

// 3. Detail User (Profil, Stats, & Riwayat Order)
router.get('/users/:id/detail', userController.getUserDetail);

// 4. Update Status (Aktif/Non-aktif)
router.put('/users/:id/deactivate', userController.deactivateUser);
router.put('/users/:id/activate', userController.reactivateUser);

// 5. Ubah Role jadi Admin
router.put('/users/:id/make-admin', userController.makeAdmin);

module.exports = router;