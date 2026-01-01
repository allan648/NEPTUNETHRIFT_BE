const db = require('../../db');
const midtransClient = require('midtrans-client');

// --- KONFIGURASI MIDTRANS DARI .ENV ---
const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// 1. BUAT PESANAN & MINTA TOKEN (DIPERBARUI DENGAN LOGIKA PROMO)
const createOrder = async (req, res) => {
    const userId = req.user.id;
    const { recipient_name, recipient_phone, shipping_address, shipping_city } = req.body;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Ambil Email User
        const [userData] = await connection.query("SELECT email FROM users WHERE id = ?", [userId]);
        const userEmail = userData.length > 0 ? userData[0].email : "";

        // 2. Ambil Data Keranjang (Ditambah kolom promo)
        const [cartItems] = await connection.query(
            `SELECT c.*, p.price, p.discount_price, p.is_promotion, p.name 
             FROM carts c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ? AND c.is_selected = 1`, 
            [userId]
        );

        if (cartItems.length === 0) throw new Error("Keranjang kosong.");

        // --- LOGIKA PERHITUNGAN HARGA PROMO ---
        let subTotal = 0;
        const midtransItemDetails = [];
        const processedItems = [];

        for (const item of cartItems) {
            // Tentukan harga: Jika is_promotion = 1, pakai discount_price. Jika tidak, pakai price.
            const priceToUse = item.is_promotion === 1 ? item.discount_price : item.price;
            const lineTotal = priceToUse * item.quantity;
            
            subTotal += lineTotal;

            // Simpan data untuk kebutuhan Midtrans item_details
            midtransItemDetails.push({
                id: `PROD-${item.product_id}`,
                price: priceToUse,
                quantity: item.quantity,
                name: item.name
            });

            // Simpan data untuk kebutuhan insert order_items ke DB nanti
            processedItems.push({
                product_id: item.product_id,
                quantity: item.quantity,
                price: priceToUse // Snapshot harga yang dibayar
            });
        }

        const shippingCost = 0; 
        const serviceFee = 1000;
        const totalAmount = subTotal + shippingCost + serviceFee;

        // Tambahkan biaya layanan ke detail Midtrans agar balance (gross_amount == total items)
        midtransItemDetails.push({
            id: 'SERVICE_FEE',
            price: serviceFee,
            quantity: 1,
            name: 'Biaya Layanan'
        });

        // 3. Simpan Order Awal ke Database
        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, total_price, status, recipient_name, recipient_phone, shipping_address, shipping_city, created_at) 
             VALUES (?, ?, 'pending', ?, ?, ?, ?, NOW())`,
            [userId, totalAmount, recipient_name, recipient_phone, shipping_address, shipping_city]
        );

        const orderId = orderResult.insertId;
        const customOrderId = `INV-${orderId}-${Date.now()}`;

        // 4. Simpan Item Order (Menggunakan harga yang sudah difilter promo)
        for (const item of processedItems) {
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        // 5. Bersihkan Keranjang
        await connection.query("DELETE FROM carts WHERE user_id = ? AND is_selected = 1", [userId]);

        // --- 6. REQUEST KE MIDTRANS ---
        const parameter = {
            transaction_details: {
                order_id: customOrderId,
                gross_amount: totalAmount // Total akhir
            },
            item_details: midtransItemDetails, // Detail item (Harga promo tampil di sini)
            customer_details: {
                first_name: recipient_name,
                email: userEmail,
                phone: recipient_phone,
                billing_address: { address: shipping_address, city: shipping_city || "Indonesia" }
            }
        };

        const transaction = await snap.createTransaction(parameter);
        const snapToken = transaction.token;

        // 7. Update Token Midtrans ke DB
        await connection.query(
            "UPDATE orders SET snap_token = ?, midtrans_order_id = ? WHERE id = ?", 
            [snapToken, customOrderId, orderId]
        );

        await connection.commit();
        res.status(201).json({ message: "Order dibuat", orderId, snap_token: snapToken });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("CREATE ORDER ERROR:", error);
        res.status(500).json({ message: error.message || "Gagal membuat pesanan" });
    } finally {
        if (connection) connection.release();
    }
};

// 2. GET MY ORDERS
const getMyOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const [orders] = await db.query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [userId]);
        
        const fullOrders = await Promise.all(orders.map(async (order) => {
            const [items] = await db.query(`
                SELECT oi.quantity, oi.price, p.name, p.image, p.size 
                FROM order_items oi 
                JOIN products p ON oi.product_id = p.id 
                WHERE oi.order_id = ?`, [order.id]);
            return { ...order, items };
        }));

        res.json({ orders: fullOrders });
    } catch (error) {
        res.status(500).json({ message: "Error fetch orders" });
    }
};

// 3. CANCEL ORDER
const cancelOrder = async (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;
    try {
        const [result] = await db.query("DELETE FROM orders WHERE id = ? AND user_id = ? AND status = 'pending'", [orderId, userId]);
        if (result.affectedRows === 0) return res.status(400).json({ message: "Gagal batal atau pesanan sudah diproses." });
        res.json({ message: "Pesanan dibatalkan." });
    } catch (error) {
        res.status(500).json({ message: "Error cancel order" });
    }
};

// 4. UPDATE PAYMENT STATUS (Dari Midtrans Status SDK)
const updatePaymentStatus = async (req, res) => {
    const orderId = req.params.id;
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        const [rows] = await connection.query(
            "SELECT midtrans_order_id, status, created_at FROM orders WHERE id = ?", 
            [orderId]
        );

        if (rows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Order tidak ditemukan" });
        }

        const order = rows[0];

        if (order.status === 'paid' || order.status === 'cancelled') {
            await connection.rollback();
            return res.json({ message: "Status sudah final", status: order.status });
        }

        let midtransResponse;
        try {
            midtransResponse = await snap.transaction.status(order.midtrans_order_id);
        } catch (error) {
            if (error.httpStatusCode === '404') {
                await connection.rollback();
                return res.status(404).json({ message: "Transaksi belum dimulai." });
            }
            throw error; 
        }

        const transactionStatus = midtransResponse.transaction_status;
        const fraudStatus = midtransResponse.fraud_status;
        let newStatus = 'pending';

        if ((transactionStatus === 'capture' && fraudStatus === 'accept') || transactionStatus === 'settlement') {
            newStatus = 'paid';
        } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
            newStatus = 'cancelled';
        }

        if (newStatus === 'paid') {
            await connection.query("UPDATE orders SET status = 'paid' WHERE id = ?", [orderId]);
            const [orderItems] = await connection.query("SELECT product_id FROM order_items WHERE order_id = ?", [orderId]);
            for (const item of orderItems) {
                await connection.query("UPDATE products SET status = 'inactive' WHERE id = ?", [item.product_id]);
            }
        } else if (newStatus === 'cancelled') {
            await connection.query("UPDATE orders SET status = 'cancelled' WHERE id = ?", [orderId]);
            const [orderItems] = await connection.query("SELECT product_id FROM order_items WHERE order_id = ?", [orderId]);
            for (const item of orderItems) {
                await connection.query("UPDATE products SET status = 'active' WHERE id = ?", [item.product_id]);
            }
        }

        await connection.commit();
        res.json({ message: "Status diperbarui", status: newStatus });

    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ message: "Gagal memperbarui status" });
    } finally {
        if (connection) connection.release();
    }
};

// 5. COMPLETE ORDER (User klik pesanan diterima)
const completeOrder = async (req, res) => {
    const orderId = req.params.id;
    try {
        await db.query("UPDATE orders SET status = 'completed' WHERE id = ?", [orderId]);
        res.json({ message: "Pesanan selesai", status: 'completed' });
    } catch (error) {
        res.status(500).json({ message: "Gagal menyelesaikan pesanan" });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    cancelOrder,
    updatePaymentStatus,
    completeOrder
};