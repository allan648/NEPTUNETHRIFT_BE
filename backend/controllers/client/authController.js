const bcrypt = require('bcryptjs');
const db = require('../../db'); // Sesuaikan path ke db.js Anda

const signup = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) return res.status(400).json({ error: "Password tidak sama" });

    try {
        const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
        if (rows.length > 0) return res.status(409).json({ error: "Email sudah digunakan" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            "INSERT INTO users (email, password, role, is_active, createdAt, updatedAt) VALUES (?, ?, 'customer', 1, NOW(), NOW())",
            [email, hashedPassword]
        );
        res.status(201).json({ message: "Pendaftaran berhasil!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mendaftar" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Cek user aktif saja
        const [rows] = await db.query("SELECT * FROM users WHERE email = ? AND is_active = 1", [email]);
        if (rows.length === 0) return res.status(401).json({ error: "Email/Password salah atau Akun Nonaktif" });

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Email/Password salah" });

        req.session.userId = user.id;
        req.session.role = user.role; // Simpan role di session
        
        res.json({ message: "Login berhasil", userId: user.id, role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "Gagal logout" });
        res.clearCookie('NeptuneSession');
        res.json({ message: "Logout berhasil" });
    });
};

const getStatus = async (req, res) => {
    if (req.session.userId) {
        try {
            const [rows] = await db.query("SELECT avatar, username, email, role FROM users WHERE id = ?", [req.session.userId]);
            const user = rows[0];
            res.json({
                isAuthenticated: true,
                userId: req.session.userId,
                avatar: user ? user.avatar : null,
                username: user ? user.username : "User",
                email: user ? user.email : "",
                role: user ? user.role : "customer"
            });
        } catch (error) {
            res.json({ isAuthenticated: true, role: "customer" });
        }
    } else {
        res.json({ isAuthenticated: false });
    }
};

module.exports = { signup, login, logout, getStatus };