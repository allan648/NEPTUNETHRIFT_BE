const express = require('express');
const router = express.Router();
const userController = require('../../controllers/client/userController');
const { isAuthenticated } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');

router.use(isAuthenticated); // Semua butuh login

router.put('/profile', upload.single('avatar'), userController.updateProfile);
router.put('/change-password', userController.changePassword);

module.exports = router;