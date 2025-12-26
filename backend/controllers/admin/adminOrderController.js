const db = require('../../db');
const { sendResiEmail, sendArrivedEmail } = require('../../services/emailService');

// 1. Get All Orders
const getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT * FROM orders ORDER BY created_at DESC
        `);
        res.json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengambil data pesanan." });
    }
};

// 2. Get Order Details
const getOrderDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const [order] = await db.query("SELECT * FROM orders WHERE id = ?", [id]);
        if (order.length === 0) return res.status(404).json({ message: "Order tidak ditemukan" });
        
        const [items] = await db.query(`
            SELECT oi.*, p.name, p.image 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ?
        `, [id]);

        res.json({ order: order[0], items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengambil detail pesanan." });
    }
};

// 3. Send Order (UPDATE: Menerima data Resi + Kurir JNE/JNT)
const sendOrder = async (req, res) => {
    const { id } = req.params;
    const { tracking_number, courier } = req.body; // <--- Menerima 'courier' dari Radio Button Frontend

    try {
        // Ambil data pembeli & email
        const [orderData] = await db.query(`
            SELECT o.*, u.email 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            WHERE o.id = ?
        `, [id]);

        if (orderData.length === 0) return res.status(404).json({ message: "Order not found" });
        const order = orderData[0];

        // Update database: status jadi 'shipped' dan simpan resi
        await db.query(
            "UPDATE orders SET status = 'shipped', tracking_number = ? WHERE id = ?",
            [tracking_number, id]
        );

        // KIRIM EMAIL: Sekarang menyertakan variabel courier
        // Fungsi di emailService: (email, nama, id, resi, kurir)
        await sendResiEmail(
            order.email, 
            order.recipient_name, 
            id, 
            tracking_number, 
            courier
        );

        res.json({ message: `Resi ${courier} berhasil diupdate dan email terkirim.` });
    } catch (error) {
        console.error("Error Send Order:", error);
        res.status(500).json({ message: "Gagal memproses pengiriman." });
    }
};

// 4. Set Order Delivered (Tandai Sampai)
const setOrderDelivered = async (req, res) => {
    const { id } = req.params;

    try {
        const [orderData] = await db.query(`
            SELECT o.*, u.email 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            WHERE o.id = ?
        `, [id]);

        if (orderData.length === 0) return res.status(404).json({ message: "Order not found" });
        const order = orderData[0];

        // Update status ke delivered
        await db.query("UPDATE orders SET status = 'delivered' WHERE id = ?", [id]);

        // Kirim email notifikasi barang sampai
        await sendArrivedEmail(order.email, order.recipient_name, id);

        res.json({ message: "Status diperbarui menjadi DELIVERED dan email terkirim." });
    } catch (error) {
        console.error("Error Delivered Order:", error);
        res.status(500).json({ message: "Gagal memperbarui status sampai." });
    }
};

module.exports = {
    getAllOrders,
    getOrderDetails,
    sendOrder,
    setOrderDelivered
};