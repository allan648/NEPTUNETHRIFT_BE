const db = require('../../db');
const midtransClient = require('midtrans-client'); // Pastikan sudah npm install midtrans-client

// --- KONFIGURASI MIDTRANS DARI .ENV ---
const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true', // Konversi string .env jadi boolean
    serverKey: process.env.MIDTRANS_SERVER_KEY, // Ambil dari .env
    clientKey: process.env.MIDTRANS_CLIENT_KEY  // Ambil dari .env
});

// 1. BUAT PESANAN & MINTA TOKEN
const createOrder = async (req, res) => {
    const userId = req.user.id;
    const { recipient_name, recipient_phone, shipping_address, shipping_city } = req.body;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // 1. AMBIL EMAIL USER (Agar muncul di Dashboard Midtrans)
        const [userData] = await connection.query("SELECT email FROM users WHERE id = ?", [userId]);
        const userEmail = userData.length > 0 ? userData[0].email : "";

        // 2. Ambil Data Keranjang
        const [cartItems] = await connection.query(
            `SELECT c.*, p.price, p.name 
             FROM carts c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ? AND c.is_selected = 1`, 
            [userId]
        );

        if (cartItems.length === 0) throw new Error("Keranjang kosong.");

        const subTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingCost = 0; 
        const serviceFee = 1000;
        const totalAmount = subTotal + shippingCost + serviceFee;

        // 3. Simpan Order Awal
        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, total_price, status, recipient_name, recipient_phone, shipping_address, shipping_city, created_at) 
             VALUES (?, ?, 'pending', ?, ?, ?, ?, NOW())`,
            [userId, totalAmount, recipient_name, recipient_phone, shipping_address, shipping_city]
        );

        const orderId = orderResult.insertId; // Ini ID asli database (contoh: 5)

        // 4. GENERATE CUSTOM ORDER ID UNTUK MIDTRANS & DATABASE
        // Format: INV-[ID Database]-[Timestamp]
        const customOrderId = `INV-${orderId}-${Date.now()}`;

        // 5. Simpan Item Order
        for (const item of cartItems) {
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        await connection.query("DELETE FROM carts WHERE user_id = ? AND is_selected = 1", [userId]);

        // --- E. REQUEST KE MIDTRANS ---
        const parameter = {
            transaction_details: {
                order_id: customOrderId, // <--- Pakai ID yang sudah kita simpan variabelnya
                gross_amount: totalAmount
            },
            customer_details: {
                first_name: recipient_name,
                email: userEmail, // <--- INI AGAR EMAIL MUNCUL DI DASHBOARD
                phone: recipient_phone,
                billing_address: { address: shipping_address, city: shipping_city || "Indonesia" }
            }
        };

        const transaction = await snap.createTransaction(parameter);
        const snapToken = transaction.token;

        // 6. UPDATE DATABASE (Simpan Token DAN Midtrans Order ID)
        await connection.query(
            "UPDATE orders SET snap_token = ?, midtrans_order_id = ? WHERE id = ?", 
            [snapToken, customOrderId, orderId]
        );

        await connection.commit();

        res.status(201).json({ message: "Order dibuat", orderId, snap_token: snapToken });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: error.message || "Gagal order" });
    } finally {
        connection.release();
    }
};
// 2. GET ORDERS (Sama seperti sebelumnya)
const getMyOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const [orders] = await db.query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [userId]);
        if (orders.length === 0) return res.json({ orders: [] });

        const fullOrders = await Promise.all(orders.map(async (order) => {
            const [items] = await db.query(`
                SELECT oi.quantity, oi.price, p.name, p.image, p.size 
                FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`, [order.id]);
            return { ...order, items };
        }));

        res.json({ orders: fullOrders });
    } catch (error) {
        res.status(500).json({ message: "Error fetch orders" });
    }
};

// 3. CANCEL ORDER (Sama seperti sebelumnya)
const cancelOrder = async (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;
    try {
        const [result] = await db.query("DELETE FROM orders WHERE id = ? AND user_id = ? AND status = 'pending'", [orderId, userId]);
        if (result.affectedRows === 0) return res.status(400).json({ message: "Gagal batal." });
        res.json({ message: "Pesanan dibatalkan." });
    } catch (error) {
        res.status(500).json({ message: "Error cancel order" });
    }
};
const updatePaymentStatus = async (req, res) => {
    const orderId = req.params.id;
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Ambil Data Order & Itemnya
        const [rows] = await connection.query("SELECT midtrans_order_id, status FROM orders WHERE id = ?", [orderId]);
        if (rows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Order tidak ditemukan" });
        }

        const order = rows[0];
        if (order.status === 'paid' || order.status === 'cancelled') {
            await connection.rollback();
            return res.json({ message: "Order sudah diproses sebelumnya", status: order.status });
        }

        // 2. Cek Status ke Midtrans
        const midtransResponse = await snap.transaction.status(order.midtrans_order_id);
        const transactionStatus = midtransResponse.transaction_status;
        const fraudStatus = midtransResponse.fraud_status;

        let newStatus = 'pending';

        // 3. LOGIKA PENENTUAN STATUS
        if (transactionStatus == 'capture' && fraudStatus == 'accept') {
            newStatus = 'paid';
        } else if (transactionStatus == 'settlement') {
            newStatus = 'paid';
        } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
            newStatus = 'cancelled'; // Pembayaran gagal atau waktu habis
        }

        // 4. EKSEKUSI UPDATE DATABASE
        if (newStatus === 'paid') {
            // JIKA LUNAS: Set Order 'paid' & Produk 'inactive'
            await connection.query("UPDATE orders SET status = 'paid' WHERE id = ?", [orderId]);
            
            const [orderItems] = await connection.query("SELECT product_id FROM order_items WHERE order_id = ?", [orderId]);
            for (const item of orderItems) {
                await connection.query("UPDATE products SET status = 'inactive' WHERE id = ?", [item.product_id]);
            }
            console.log(`[PAID] Order #${orderId} sukses, produk ditarik dari etalase.`);

        } else if (newStatus === 'cancelled') {
            // JIKA GAGAL/EXPIRED: Set Order 'cancelled' & Kembalikan Produk ke 'active'
            await connection.query("UPDATE orders SET status = 'cancelled' WHERE id = ?", [orderId]);
            
            const [orderItems] = await connection.query("SELECT product_id FROM order_items WHERE order_id = ?", [orderId]);
            for (const item of orderItems) {
                await connection.query("UPDATE products SET status = 'active' WHERE id = ?", [item.product_id]);
            }
            console.log(`[CANCELLED] Order #${orderId} batal, produk dikembalikan ke etalase.`);
        }

        await connection.commit();
        res.json({ message: "Status diperbarui", status: newStatus });

    } catch (error) {
        await connection.rollback();
        console.error("[ERROR]", error);
        res.status(500).json({ message: "Gagal update status" });
    } finally {
        connection.release();
    }
};

const completeOrder = async (req, res) => {
    const orderId = req.params.id;
    // const userId = req.user.id; // Aktifkan jika ingin validasi pemilik

    try {
        // Update status jadi completed
        // Hanya bisa jika status sebelumnya 'delivered' (atau shipped jika mau longgar)
        await db.query(
            "UPDATE orders SET status = 'completed' WHERE id = ?", 
            [orderId]
        );

        res.json({ message: "Pesanan selesai", status: 'completed' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// JANGAN LUPA TAMBAHKAN updatePaymentStatus KE MODULE EXPORTS
module.exports = {
    createOrder,
    getMyOrders,
    cancelOrder,
    updatePaymentStatus,
    completeOrder // <--- Tambahkan ini
};