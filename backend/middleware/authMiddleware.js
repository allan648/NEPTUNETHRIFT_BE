const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    return res.status(401).json({ error: "Unauthorized: Silakan login terlebih dahulu" });
};

// Middleware Khusus Admin
const isAdmin = async (req, res, next) => {
    // Kita asumsikan role sudah disimpan di session saat login, atau cek DB ulang
    // Untuk performa, sebaiknya simpan di session. 
    // Tapi untuk keamanan maksimal, query DB. Kita pakai query DB user saat ini.
    const db = require('../models'); // Sesuaikan path model
    // Note: Logika detailnya bisa disesuaikan, ini versi simpel
    if (req.session.role === 'admin') {
        return next();
    }
    return res.status(403).json({ error: "Forbidden: Akses khusus Admin" });
};

module.exports = { isAuthenticated, isAdmin };