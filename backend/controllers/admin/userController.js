const db = require('../../db');

const getAllUsers = async (req, res) => {
    try {
        // PERUBAHAN:
        // 1. Hapus 'WHERE is_active = 1' (supaya user non-aktif tetap muncul di list)
        // 2. Tambahkan 'is_active' ke dalam SELECT
        // 3. Order by is_active DESC (User aktif di atas, non-aktif di bawah)
        const [users] = await db.query(
            "SELECT id, username, email, phone, address, role, is_active FROM users ORDER BY is_active DESC, createdAt DESC"
        );
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal ambil data" });
    }
};

const reactivateUser = async (req, res) => {
    const userId = req.params.id;
    try {
        await db.query("UPDATE users SET is_active = 1 WHERE id = ?", [userId]);
        res.json({ message: "User berhasil diaktifkan kembali" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mengaktifkan user" });
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

module.exports = { getAllUsers, deactivateUser, reactivateUser };