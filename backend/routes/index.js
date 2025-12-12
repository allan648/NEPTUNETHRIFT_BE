const express = require('express');
const router = express.Router();

const clientRoutes = require('./client');
const adminRoutes = require('./admin');

// 1. Jalur Admin -> /api/admin
router.use('/admin', adminRoutes);

// 2. Jalur Client -> /api
router.use('/', clientRoutes);

module.exports = router;