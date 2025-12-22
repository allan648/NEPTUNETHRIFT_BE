// Perhatikan jumlah titik (..) sesuaikan dengan lokasi file db.js Anda
// Jika file ini di folder 'backend/controllers/', maka '../db'
// Jika file ini di folder 'backend/controllers/client/', maka '../../db'
const db = require('../../db'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// 1. SIGNUP (Dulunya Register)
const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Cek email duplikat
        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email sudah terdaftar" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan ke DB (Default role: customer, Default active: 1)
        await db.query(
            "INSERT INTO users (username, email, password, role, is_active) VALUES (?, ?, ?, 'customer', 1)",
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: "Registrasi berhasil, silakan login" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal registrasi" });
    }
};

// 2. LOGIN
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Cari user
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Email tidak ditemukan" });
        }

        const user = rows[0];

        let avatarUrl = null;
        if (user.avatar) {
            // Cek apakah string avatar dimulai dengan http atau https (Google atau Localhost yg sudah lengkap)
            if (user.avatar.startsWith('http://') || user.avatar.startsWith('https://')) {
                avatarUrl = user.avatar; 
            } else {
                // Jika tidak ada http, berarti ini hanya nama file. Tambahkan path localhost.
                avatarUrl = `http://localhost:3000/uploads/${user.avatar}`;
            }
        }

        // Cek Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password salah" });
        }

        // Cek Aktif
        if (user.is_active === 0) {
            return res.status(403).json({ message: "Akun dinonaktifkan." });
        }

        // Buat Token
        const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // Kirim Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // False di localhost
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 
        });

        // Response JSON
        res.json({
            message: "Login berhasil",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                phone: user.phone || "",
                address: user.address || "",
                isGoogle: user.is_google
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};

// 3. LOGOUT
const logout = (req, res) => {
    res.clearCookie('token');
    return res.json({ message: "Logout berhasil" });
};

// 4. GET STATUS (Baru)
// Fungsi ini mengecek token manual tanpa middleware authMiddleware
// agar tidak melempar error 401, tapi melempar status isAuthenticated: false
const getStatus = async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ isAuthenticated: false, user: null });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [rows] = await db.query(
            "SELECT id, username, email, role, avatar, phone, address, is_google FROM users WHERE id = ?", 
            [decoded.id]
        );
        
        if (rows.length === 0) return res.json({ isAuthenticated: false, user: null });

        const user = rows[0];

        // --- LOGIKA AVATAR DIPERBAIKI DISINI ---
        let avatarUrl = null;
        if (user.avatar) {
            if (user.avatar.startsWith('http://') || user.avatar.startsWith('https://')) {
                avatarUrl = user.avatar;
            } else {
                avatarUrl = `http://localhost:3000/uploads/${user.avatar}`;
            }
        }
        // ---------------------------------------

        return res.json({
            isAuthenticated: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: avatarUrl, // <--- Gunakan variabel ini
                phone: user.phone || "",
                address: user.address || "",
                isGoogle: user.is_google
            }
        });

    } catch (error) {
        return res.json({ isAuthenticated: false, user: null });
    }
};
module.exports = { signup, login, logout, getStatus };