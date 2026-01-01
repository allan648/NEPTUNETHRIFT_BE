require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken'); // <--- 1. JANGAN LUPA TAMBAHKAN INI
const db = require('./db');
const routes = require('./routes'); 
const orderRoutes = require('./routes/client/orderRoutes');
const adminOrderRoutes = require('./routes/admin/adminOrderRoutes');
const categoryRoutes = require('./routes/admin/categoryRoutes');
const brandRoutes = require('./routes/admin/brandRoutes');


const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = "http://localhost:5173"; 

// ... (Bagian Middleware App Use dll BIARKAN SAMA) ...
app.use(cors({ origin: CLIENT_URL, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({ secret: process.env.SESSION_SECRET || 'rahasia', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use('/api/orders', orderRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/report', require('./routes/admin/adminReportRoutes'));
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/admin/brands', brandRoutes);
// app.use(passport.session()); // Tidak wajib lagi karena kita override pakai JWT, tapi dibiarkan tidak apa-apa.

// ... (Bagian Passport Strategy BIARKAN SAMA) ...
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const photoUrl = profile.photos?.[0]?.value;
        const name = profile.displayName;

        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        
        if (rows.length > 0) {
            const existingUser = rows[0];
            if (existingUser.is_active === 0) return done(null, false);
            // Update last login
            await db.query("UPDATE users SET updatedAt = NOW() WHERE id = ?", [existingUser.id]);
            return done(null, existingUser);
        } else {
            const [result] = await db.query(
                "INSERT INTO users (username, email, is_google, avatar, role, is_active, createdAt, updatedAt) VALUES (?, ?, 1, ?, 'customer', 1, NOW(), NOW())", 
                [name, email, photoUrl]
            );
            const newUser = { id: result.insertId, email, avatar: photoUrl, username: name, role: 'customer' };
            return done(null, newUser);
        }
    } catch (error) { return done(error, null); }
}));

// Serialize (Standar)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        done(null, rows[0]);
    } catch (err) { done(err, null); }
});

// Route Auth Google
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// --- 2. PERBAIKAN UTAMA DI SINI (CALLBACK) ---
app.get('/api/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        // Jika Error
        if (err || !user) {
            return res.redirect(`${CLIENT_URL}/?error=login_failed`);
        }

        // --- DISINI KITA BUAT JWT MANUAL ---
        // Agar sama persis dengan Login Manual
        const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // Set Cookie Token
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // localhost
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 
        });

        // Redirect ke Frontend (Home)
        res.redirect(CLIENT_URL);
        
    })(req, res, next);
});

// Routes Lain
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});