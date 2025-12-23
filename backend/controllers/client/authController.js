// Perhatikan jumlah titik (..) sesuaikan dengan lokasi file db.js Anda
// Jika file ini di folder 'backend/controllers/', maka '../db'
// Jika file ini di folder 'backend/controllers/client/', maka '../../db'
const db = require('../../db'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Helper Function: Kirim Email
const sendEmail = async (to, subject, htmlContent) => {
    try {
        await transporter.sendMail({
            from: `"Neptune Thrift Support" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent
        });
        console.log(`Email terkirim ke ${to}`);
    } catch (error) {
        console.error("Gagal kirim email:", error);
    }
};


// 1. SIGNUP (Dulunya Register)
// 1. SIGNUP (Updated)
const signup = async (req, res) => {
    const { email, password } = req.body; // Username otomatis dibuat sistem

    try {
        // 1. Validasi
        if (!email || !password) return res.status(400).json({ message: "Email dan Password wajib diisi!" });

        // 2. Cek Duplikat
        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) return res.status(400).json({ message: "Email sudah terdaftar" });

        // 3. Persiapan Data
        const defaultUsername = `User-${Date.now()}`;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // --- LOGIC BARU: TOKEN VERIFIKASI ---
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // 4. Simpan ke DB (is_verified = 0)
        await db.query(
            `INSERT INTO users 
            (username, email, password, role, is_active, is_verified, verification_token, createdAt, updatedAt) 
            VALUES (?, ?, ?, 'customer', 1, 0, ?, NOW(), NOW())`,
            [defaultUsername, email, hashedPassword, verificationToken]
        );

        // 5. Kirim Email Verifikasi
        // Link mengarah ke Frontend (Vue)
        const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
        
        const emailHtml = `
            <h3>Selamat Datang di Neptune Thrift!</h3>
            <p>Terima kasih telah mendaftar. Silakan klik tombol di bawah ini untuk memverifikasi akun Anda:</p>
            <a href="${verifyLink}" style="background-color: #1d4ed8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verifikasi Akun Saya</a>
            <br><br>
            <p>Atau klik link ini: <a href="${verifyLink}">${verifyLink}</a></p>
        `;

        await sendEmail(email, "Verifikasi Akun Neptune Thrift", emailHtml);

        res.status(201).json({ message: "Registrasi berhasil! Silakan cek email Anda untuk verifikasi." });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Gagal registrasi" });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.body; // Frontend akan mengirim token ini

    try {
        // Cari user dengan token tersebut
        const [rows] = await db.query("SELECT * FROM users WHERE verification_token = ?", [token]);
        
        if (rows.length === 0) {
            return res.status(400).json({ message: "Token verifikasi tidak valid atau kedaluwarsa." });
        }

        const user = rows[0];

        // Update User jadi Verified dan Hapus Tokennya
        await db.query("UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?", [user.id]);

        res.json({ message: "Verifikasi berhasil! Silakan login." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal verifikasi" });
    }
};

// A. REQUEST LUPA PASSWORD (Kirim Email)
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) return res.status(404).json({ message: "Email tidak ditemukan" });

        const user = rows[0];
        
        // Buat Token Reset & Expired time (1 Jam dari sekarang)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expireTime = new Date(Date.now() + 3600000); // 1 jam

        await db.query("UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?", [resetToken, expireTime, user.id]);

        // Link Reset Password Frontend
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        
        const emailHtml = `
            <h3>Permintaan Reset Password</h3>
            <p>Anda meminta untuk mereset password. Klik link di bawah ini (berlaku 1 jam):</p>
            <a href="${resetLink}" style="background-color: #d33; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        `;

        await sendEmail(email, "Reset Password Neptune Thrift", emailHtml);

        res.json({ message: "Link reset password telah dikirim ke email Anda." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal memproses permintaan." });
    }
};

// B. EKSEKUSI RESET PASSWORD (Ganti Password Baru)
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        // Cari user dgn token yg valid & belum expired
        const [rows] = await db.query(
            "SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()", 
            [token]
        );

        if (rows.length === 0) return res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa." });

        const user = rows[0];
        
        // Hash Password Baru
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update Password & Bersihkan Token
        await db.query(
            "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?", 
            [hashedPassword, user.id]
        );

        res.json({ message: "Password berhasil diubah. Silakan login." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mereset password." });
    }
};
// 2. LOGIN
// ... (fungsi signup biarkan yang baru) ...

// 2. LOGIN (VERSI STANDAR - TANPA CAPTCHA SEMENTARA)
const login = async (req, res) => {
    // Hapus recaptchaToken dari request body
    const { email, password } = req.body;

    try {
        // Cari user berdasarkan EMAIL (Pastikan user login pakai email)
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Email tidak ditemukan" });
        }

        const user = rows[0];

        // Cek Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password salah" });
        }

        // Cek Verifikasi Email
        if (user.is_verified === 0) {
            return res.status(403).json({ message: "Harap verifikasi email Anda terlebih dahulu." });
        }

        // Cek Aktif
        if (user.is_active === 0) {
            return res.status(403).json({ message: "Akun dinonaktifkan." });
        }

        // Buat Token JWT
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

        // Logika Avatar Pintar
        let avatarUrl = null;
        if (user.avatar) {
            if (user.avatar.startsWith('http://') || user.avatar.startsWith('https://')) {
                avatarUrl = user.avatar; 
            } else {
                avatarUrl = `http://localhost:3000/uploads/${user.avatar}`;
            }
        }

        res.json({
            message: "Login berhasil",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: avatarUrl,
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

// ...
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
module.exports = { signup, login, logout, getStatus, verifyEmail, forgotPassword, resetPassword };