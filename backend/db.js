const mysql = require('mysql2');
require('dotenv').config();

// Gunakan createPool (Kumpulan Koneksi), BUKAN createConnection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Maksimal 10 koneksi sekaligus (biar server gak jebol)
    queueLimit: 0
});

// Cek koneksi sekali di awal (Opsional, biar tau di terminal kalau sukses)
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database Connection Failed:', err.message);
    } else {
        console.log('✅ Connected to MySQL via Pool');
        connection.release(); // Kembalikan koneksi ke pool
    }
});

// Export versi Promise agar bisa pakai async/await di controller
module.exports = pool.promise();