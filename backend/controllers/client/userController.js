const db = require('../../db');
const bcrypt = require('bcryptjs');

const updateProfile = async (req, res) => {
    const { username, phone, address } = req.body;
    const userId = req.session.userId;
    const newAvatar = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;

    try {
        if (newAvatar) {
            await db.query("UPDATE users SET username=?, phone=?, address=?, avatar=? WHERE id=?", [username, phone, address, newAvatar, userId]);
        } else {
            await db.query("UPDATE users SET username=?, phone=?, address=? WHERE id=?", [username, phone, address, userId]);
        }
        res.json({ message: "Profil berhasil diperbarui!", newAvatar });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal update profil" });
    }
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.session.userId;
    try {
        const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [userId]);
        const user = rows[0];
        
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) return res.status(400).json({ error: "Password lama salah" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);
        
        res.json({ message: "Password berhasil diubah!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal ganti password" });
    }
};

module.exports = { updateProfile, changePassword };