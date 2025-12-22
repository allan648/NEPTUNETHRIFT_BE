const db = require('../../db');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const UPLOADS_FOLDER = path.join(process.cwd(), 'uploads');

const updateProfile = async (req, res) => {
    const userId = req.user.id; // Didapat dari Token (Middleware)
    const { username, phone, address } = req.body;
    const file = req.file; // File gambar dari Multer

    try {
        // 1. Cek User Lama (Untuk hapus foto lama jika perlu)
        const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
        const oldUser = rows[0];

        if (!oldUser) return res.status(404).json({ message: "User tidak ditemukan" });

        // 2. LOGIKA UPDATE
        if (file) {
            // --- SKENARIO A: User Ganti Foto ---
            
            // Hapus foto lama jika ada (opsional, biar server gak penuh)
            if (oldUser.avatar) {
                // Bersihkan nama file dari URL jika ada
                const oldFilename = oldUser.avatar.replace('http://localhost:3000/uploads/', '');
                
                // Gunakan path absolut yang aman
                const oldPath = path.join(UPLOADS_FOLDER, oldFilename);
                
                // Cek dan hapus
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            // Update Semua Field Termasuk Avatar
            await db.query(
                "UPDATE users SET username = ?, phone = ?, address = ?, avatar = ?, updatedAt = NOW() WHERE id = ?",
                [username, phone, address, file.filename, userId]
            );

            // Kirim balasan URL avatar baru ke frontend
            res.json({ 
                message: "Profil dan Foto berhasil diupdate",
                newAvatar: `http://localhost:3000/uploads/${file.filename}`
            });

        } else {
            // --- SKENARIO B: User Cuma Ganti Teks (Tanpa Foto) ---
            
            await db.query(
                "UPDATE users SET username = ?, phone = ?, address = ?, updatedAt = NOW() WHERE id = ?",
                [username, phone, address, userId]
            );

            res.json({ message: "Data profil berhasil diupdate" });
        }

    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Gagal mengupdate profil" });
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