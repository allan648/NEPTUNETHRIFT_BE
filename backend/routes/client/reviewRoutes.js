const express = require('express');
const router = express.Router();
const db = require('../../db'); // sesuaikan path ke db.js kamu
const { isAuthenticated } = require('../../middleware/authMiddleware');

router.post('/', isAuthenticated, async (req, res) => {
    const { rating, comment } = req.body;
    const userId = req.user.id;

    try {
        await db.query(
            "INSERT INTO reviews (user_id, rating, comment) VALUES (?, ?, ?)",
            [userId, rating, comment]
        );
        res.json({ message: "Review berhasil disimpan!" });
    } catch (error) {
        res.status(500).json({ message: "Gagal simpan review" });
    }
});

// Di Backend: routes/reviewRoutes.js
router.get('/', async (req, res) => {
    try {
        // Query JOIN dengan tabel users agar dapat username-nya
        const [rows] = await db.query(`
            SELECT reviews.*, users.username 
            FROM reviews 
            JOIN users ON reviews.user_id = users.id 
            ORDER BY reviews.createdAt DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data review" });
    }
});

module.exports = router;