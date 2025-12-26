const express = require('express');
const router = express.Router();
const adminReportController = require('../../controllers/admin/adminReportController');
const { isAuthenticated, isAdmin } = require('../../middleware/authMiddleware');

router.use(isAuthenticated, isAdmin);

// Endpoint Analisa AI
router.get('/analyze', adminReportController.getAiAnalysis);
router.get('/history', adminReportController.getReportHistory);

module.exports = router;