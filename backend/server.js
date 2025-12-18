require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');
const routes = require('./routes'); // Mengambil dari routes/index.js

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// === MIDDLEWARE ===
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Akses folder gambar

app.use(session({
    secret: process.env.SESSION_SECRET || 'rahasia_negara',
    resave: false,
    saveUninitialized: false,
    name: 'NeptuneSession',
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true, 
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

// === PASSPORT CONFIG (GOOGLE AUTH) ===
// Biarkan di sini agar ringkas, atau pindahkan ke config/passport.js nanti
app.use(passport.initialize());
app.use(passport.session());

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
            // PERBAIKAN: Hanya update waktu login (updatedAt). 
             // Avatar & Username dibiarkan sesuai apa yang ada di database (foto upload manual kamu).
            await db.query("UPDATE users SET updatedAt = NOW() WHERE id = ?", [existingUser.id]);

            // Kembalikan data asli dari database, jangan ditimpa data Google
            return done(null, existingUser);
        } else {
            const [result] = await db.query(
                "INSERT INTO users (email, is_google, avatar, username, role, is_active, createdAt, updatedAt) VALUES (?, 1, ?, ?, 'customer', 1, NOW(), NOW())", 
                [email, photoUrl, name]
            );
            const newUser = { id: result.insertId, email, avatar: photoUrl, username: name, role: 'customer' };
            return done(null, newUser);
        }
    } catch (error) { return done(error, null); }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        done(null, rows[0] || false);
    } catch (err) { done(err, null); }
});

// Route Google Auth (Manual di sini karena butuh passport)
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/api/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login-failed' }),
    (req, res) => {
        req.session.userId = req.user.id;
        req.session.role = req.user.role;
        res.redirect(CLIENT_URL);
    }
);

// === MAIN ROUTES ===
// Semua logika dipanggil di sini dengan awalan /api
app.use('/api', routes);

// === START SERVER ===
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan rapi di http://localhost:${PORT}`);
});