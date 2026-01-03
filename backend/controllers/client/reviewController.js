// controllers/reviewController.js
const db = require('../../db');

const submitReview = async (req, res) => {
    const { rating, comment } = req.body;
    const userId = req.user.id; // Diambil dari middleware isAuthenticated

    try {
        if (!rating || !comment) {
            return res.status(400).json({ message: "Rating dan komentar wajib diisi!" });
        }

        await db.query(
            "INSERT INTO reviews (user_id, rating, comment) VALUES (?, ?, ?)",
            [userId, rating, comment]
        );

        res.status(201).json({ message: "Review berhasil dikirim, terima kasih!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengirim review." });
    }
};

module.exports = { submitReview };