const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
// const productRoutes = require('./productRoutes'); // Nanti tambah ini

// Prefix URL nanti: /api/admin/...
router.use('/', userRoutes); // Jadi /api/admin/users

module.exports = router;