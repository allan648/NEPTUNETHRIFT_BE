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


const getUsersList = async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT id, username, email FROM users WHERE role != 'admin' ORDER BY username ASC"
        );
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mengubah role user menjadi admin
const makeAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("UPDATE users SET role = 'admin' WHERE id = ?", [id]);
        res.json({ message: "User successfully promoted to admin" });
    } catch (error) {
        res.status(500).json({ message: error.message });
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

const getUserDetail = async (req, res) => {
    const userId = req.params.id;
    try {
        // 1. Ambil Data Profil User
        const [user] = await db.query(
            "SELECT id, username, email, phone, avatar, role, is_active, createdAt FROM users WHERE id = ?", 
            [userId]
        );

        if (user.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });

        // 2. Ambil Riwayat Order User
        const [orders] = await db.query(
            "SELECT id, total_price, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC",
            [userId]
        );

        // 3. Ambil Statistik Singkat
        const [stats] = await db.query(
            "SELECT COUNT(*) as total_orders, SUM(total_price) as total_spent FROM orders WHERE user_id = ? AND status != 'cancelled'",
            [userId]
        );

        res.json({
            profile: user[0],
            orders: orders,
            stats: stats[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body; // Mengambil 'admin' atau 'customer' dari frontend

    try {
        // 1. Validasi input
        if (!['admin', 'customer'].includes(role)) {
            return res.status(400).json({ message: "Role tidak valid!" });
        }

        // 2. Update ke Database
        const [result] = await db.query(
            "UPDATE users SET role = ? WHERE id = ?", 
            [role, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        res.json({ 
            message: `Role user berhasil diperbarui menjadi ${role.toUpperCase()}` 
        });

    } catch (error) {
        console.error("Error Update Role:", error);
        res.status(500).json({ message: "Gagal memperbarui role" });
    }
};

module.exports = { getAllUsers, deactivateUser, reactivateUser, getUsersList, makeAdmin, getUserDetail, updateUserRole };