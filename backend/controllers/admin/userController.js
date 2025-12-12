const db = require('../../db');

const getAllUsers = async (req, res) => {
    try {
        // Ambil data user yang aktif (is_active = 1)
        const [users] = await db.query("SELECT id, username, email, phone, role FROM users WHERE is_active = 1 ORDER BY createdAt DESC");
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mengambil data user" });
    }
};

const deactivateUser = async (req, res) => {
    const userId = req.params.id;
    try {
        // Soft delete (set is_active = 0)
        await db.query("UPDATE users SET is_active = 0 WHERE id = ?", [userId]);
        res.json({ message: "User berhasil dinonaktifkan" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal menghapus user" });
    }
};

module.exports = { getAllUsers, deactivateUser };