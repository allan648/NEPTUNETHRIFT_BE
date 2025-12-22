const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
// const productRoutes = require('./productRoutes'); // Nanti tambah ini
const productRoutes = require('./productRoutes');

// Prefix URL nanti: /api/admin/...
router.use('/', userRoutes); // Jadi /api/admin/users
router.use('/products', productRoutes); // Jadi /api/admin/products
module.exports = router;