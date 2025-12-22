const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    // 1. Ambil token dari Cookies
    const token = req.cookies.token; 

    // Jika tidak ada token, tolak!
    if (!token) {
        return res.status(401).json({ message: "Silakan login terlebih dahulu (Token hilang)." });
    }

    try {
        // 2. Cek keaslian token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. PENTING: Tempelkan data user ke request object
        // Agar bisa dibaca oleh Controller (req.user.id)
        req.user = decoded; 

        next(); // Lanjut ke Controller
    } catch (error) {
        return res.status(403).json({ message: "Sesi kadaluarsa, silakan login ulang." });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Akses ditolak! Khusus Admin." });
    }
};

module.exports = { isAuthenticated, isAdmin };