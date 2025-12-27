const db = require('../../db');

const getDashboardData = async (req, res) => {
    try {
        // 1. Ambil Angka Statistik
        const [u] = await db.query("SELECT COUNT(*) as total FROM users");
        const [o] = await db.query("SELECT COUNT(*) as total FROM orders WHERE status = 'paid'");
        const [p] = await db.query("SELECT COUNT(*) as total FROM products WHERE status = 'active'");
        const [c] = await db.query("SELECT COUNT(*) as total FROM comments");

        // 2. Ambil Data Grafik (7 Hari Terakhir)
        const [sales] = await db.query(`
            SELECT 
                DATE_FORMAT(created_at, '%d %b') as label, 
                SUM(total_price) as total 
            FROM orders 
            WHERE status != 'pending' 
              AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY label, DATE(created_at)
            ORDER BY DATE(created_at) ASC
        `);

        // 3. Kirim Gabungan Data
        res.json({
            stats: {
                users: u[0].total,
                orders: o[0].total,
                products: p[0].total,
                comments: c[0].total
            },
            salesGraph: sales
        });
    } catch (error) {
        console.error("Dashboard Controller Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Pastikan penulisan export seperti ini
module.exports = { 
    getDashboardData 
};