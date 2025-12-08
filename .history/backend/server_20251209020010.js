// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs'); 
const db = require('./db'); // Import koneksi database yang sudah di-promise
const cors = require('cors');
const passport = require('passport'); // TAMBAHAN
const GoogleStrategy = require('passport-google-oauth20').Strategy; // TAMBAHAN

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;

// Middleware
app.use(cors({
    origin: CLIENT_URL, 
    credentials: true, // WAJIB: Untuk mengizinkan transfer session cookie
}));
app.use(express.json()); 

// Setup session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'NeptuneSession', // Nama cookie sesi
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // true jika di production (HTTPS)
        httpOnly: true, // Mencegah akses cookie via JavaScript
        maxAge: 1000 * 60 * 60 * 24 // 24 jam
    } 
}));

// Initialize Passport (TAMBAHAN)
app.use(passport.initialize());
app.use(passport.session());

// ======================= KONFIGURASI PASSPORT GOOGLE =======================
// ... import dan setup lainnya

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const photoUrl = (profile.photos && profile.photos.length > 0) ? profile.photos[0].value : null;
        const name = profile.displayName; // <--- AMBIL NAMA DARI GOOGLE

        // 1. Cek User di DB
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length > 0) {
            const existingUser = rows[0];
            
            // UPDATE avatar DAN username agar selalu fresh
            await db.query("UPDATE users SET avatar = ?, username = ? WHERE id = ?", [photoUrl, name, existingUser.id]);
            
            existingUser.avatar = photoUrl;
            existingUser.username = name; // Update object session
            
            return done(null, existingUser);
        } else {
            // INSERT User Baru (tambahkan username)
            const [result] = await db.query(
                "INSERT INTO users (email, password, is_google, avatar, username) VALUES (?, ?, ?, ?, ?)", 
                [email, null, 1, photoUrl, name]
            );
            
            const newUser = { id: result.insertId, email: email, avatar: photoUrl, username: name };
            return done(null, newUser);
        }
    } catch (error) {
        console.error("Error di Google Strategy:", error);
        return done(error, null);
    }
}));

// ... sisa kode lainnya
// Serialize & Deserialize User (Diperlukan Passport)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        
        // Cek jika user tidak ditemukan
        if (!rows || rows.length === 0) {
            // Jika user tidak ada di DB (mungkin terhapus), kembalikan null/false
            // Ini akan otomatis membuat user dianggap "logout"
            return done(null, false);
        }

        // Jika user ada, kembalikan data user
        done(null, rows[0]);
    } catch (err) {
        console.error("Error saat deserialize user:", err);
        done(err, null);
    }
});


// ======================= ROUTES GOOGLE AUTH =======================

// 1. Trigger Login ke Google
app.get('/api/auth/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

// 2. Callback setelah user login di Google
app.get('/api/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login-failed' }),
    (req, res) => {
        // Login berhasil via Passport, sekarang kita set session manual 
        // agar kompatibel dengan sistem login email/password Anda yang lama.
        req.session.userId = req.user.id;
        
        // Redirect kembali ke Frontend (Halaman Utama)
        res.redirect(CLIENT_URL);
    }
);

// ======================= EXISTING ROUTES =======================

app.get("/api/auth/status", async (req, res) => {
    if (req.session.userId) {
        try {
            // Ambil avatar user dari database berdasarkan ID session
            const [rows] = await db.query("SELECT avatar FROM users WHERE id = ?", [req.session.userId]);
            
            const userAvatar = rows.length > 0 ? rows[0].avatar : null;

            res.json({ 
                isAuthenticated: true, 
                userId: req.session.userId,
                avatar: userAvatar // Kirim avatar ke frontend
            });
        } catch (error) {
            console.error("Error fetch status:", error);
            res.json({ isAuthenticated: true, userId: req.session.userId, avatar: null });
        }
    } else {
        res.json({ isAuthenticated: false });
    }
});
// ======================= 1. SIGN UP (POST /api/auth/signup) =======================

app.post("/api/auth/signup", async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    // 1. Validasi Input
    if (!email || !password || !confirmPassword) {
        return res.status(400).json({ error: "Semua field wajib diisi" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Password tidak sama" });
    }

    try {
        // 2. Cek apakah email sudah ada
        const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
        
        if (rows.length > 0) {
            return res.status(409).json({ error: "Email sudah digunakan" });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Insert user baru
        await db.query(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [email, hashedPassword]
        );

        // 5. Kirim respons
        return res.status(201).json({ message: "Pendaftaran berhasil! Silakan login." });

    } catch (error) {
        console.error("Sign up error:", error);
        return res.status(500).json({ error: "Server error saat mendaftar" });
    }
});

// ======================= 2. LOGIN (POST /api/auth/login) =======================

app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email dan password wajib diisi" });
    }

    try {
        // 1. Cari user berdasarkan email
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: "Email atau password salah" });
        }

        const user = rows[0];

        // 2. Bandingkan password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: "Email atau password salah" });
        }

        // 3. Buat sesi (berhasil login)
        req.session.userId = user.id;

        // 4. Kirim respons berhasil
        return res.json({ message: "Login berhasil", userId: user.id });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Server error saat memproses login" });
    }
});

// ======================= 3. LOGOUT (POST /api/auth/logout) =======================

app.post("/api/auth/logout", (req, res) => {
    // Hapus sesi pengguna
    req.session.destroy((err) => {
        if (err) {
            console.error("Session Destroy Error:", err);
            return res.status(500).json({ error: "Gagal logout" });
        }
        // Bersihkan cookie sesi
        res.clearCookie('NeptuneSession'); 
        res.json({ message: "Logout berhasil" });
    });
});


// ======================= RUN SERVER =======================

app.listen(PORT, () => {
    console.log(`Server backend berjalan di http://localhost:${PORT}`);
});