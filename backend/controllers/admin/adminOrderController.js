const db = require('../../db');
// 👇👇👇 TAMBAHKAN KOMA DAN FUNGSI BARU 👇👇👇
const { sendResiEmail, sendArrivedEmail } = require('../../services/emailService');

// 1. AMBIL SEMUA ORDER (Untuk Tabel Admin)
const getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT o.*, u.email 
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `);
        res.json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal ambil data order" });
    }
};

// 2. KIRIM BARANG (Input Resi)
const sendOrder = async (req, res) => {
    const orderId = req.params.id;
    const { tracking_number } = req.body; // Data resi dari inputan Admin

    // Validasi: Resi tidak boleh kosong
    if (!tracking_number) {
        return res.status(400).json({ message: "Nomor resi wajib diisi!" });
    }

    try {
        // A. Update Database: Ubah status jadi 'shipped' & Simpan Resi
        await db.query(
            "UPDATE orders SET status = 'shipped', tracking_number = ? WHERE id = ?", 
            [tracking_number, orderId]
        );

        // B. Ambil Email & Nama Pembeli (Untuk dikirimi notifikasi)
        // Kita perlu join ke tabel users untuk dapat emailnya
        const [rows] = await db.query(`
            SELECT o.recipient_name, u.email 
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        `, [orderId]);

        if (rows.length > 0) {
            const { email, recipient_name } = rows[0];
            
            // C. PANGGIL EMAIL SERVICE
            // Kita jalankan fungsi ini untuk mengirim email ke pembeli
            console.log(`Mengirim email ke ${email}...`);
            await sendResiEmail(email, recipient_name, orderId, tracking_number);
        }

        res.json({ message: "Resi disimpan & Email notifikasi terkirim!", status: 'shipped' });

    } catch (error) {
        console.error("Gagal update resi:", error);
        res.status(500).json({ message: "Terjadi kesalahan server saat update resi." });
    }
};
const getOrderDetails = async (req, res) => {
    const orderId = req.params.id;
    try {
        // Ambil Item + Data Produk (Gambar, Nama, Ukuran)
        const [items] = await db.query(`
            SELECT oi.*, p.name, p.image, p.size, p.category_id 
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `, [orderId]);

        res.json({ items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal ambil detail item" });
    }
};
const setOrderDelivered = async (req, res) => {
    const orderId = req.params.id;

    try {
        // 1. Update status jadi 'delivered'
        await db.query("UPDATE orders SET status = 'delivered' WHERE id = ?", [orderId]);

        // 2. Ambil Email User
        const [rows] = await db.query(`
            SELECT o.recipient_name, u.email 
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        `, [orderId]);

        if (rows.length > 0) {
            // 3. Kirim Email "Konfirmasi Dong"
            const { email, recipient_name } = rows[0];
            sendArrivedEmail(email, recipient_name, orderId);
        }

        res.json({ message: "Status diubah jadi SAMPAI & Email terkirim", status: 'delivered' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal update status" });
    }
};

module.exports = { getAllOrders, sendOrder, getOrderDetails, setOrderDelivered };