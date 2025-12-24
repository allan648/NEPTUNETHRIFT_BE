const db = require('../../db');

// FUNGSI: BUAT ORDER BARU
const createOrder = async (req, res) => {
    // 1. Ambil ID User dari Token Login
    const userId = req.user.id; 

    // 2. Ambil Data Alamat dari Input Frontend
    const { 
        recipient_name, 
        recipient_phone, 
        shipping_address, 
        shipping_city 
    } = req.body;

    // Validasi Input
    if (!recipient_name || !recipient_phone || !shipping_address || !shipping_city) {
        return res.status(400).json({ message: "Data pengiriman harus lengkap!" });
    }

    try {
        // 3. AMBIL DATA KERANJANG DARI DATABASE
        // Kita hitung total harga di backend agar aman (tidak dimanipulasi dari frontend)
        const queryCart = `
            SELECT c.id as cart_id, c.quantity, p.id as product_id, p.price, p.name 
            FROM carts c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = ?
        `;
        const [cartItems] = await db.query(queryCart, [userId]);

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Keranjang belanja kosong." });
        }

        // 4. HITUNG TOTAL HARGA
        let totalPrice = 0;
        cartItems.forEach(item => {
            totalPrice += item.price * item.quantity;
        });

        // 5. SIMPAN KE TABEL ORDERS
        const insertOrderQuery = `
            INSERT INTO orders 
            (user_id, recipient_name, recipient_phone, shipping_address, shipping_city, total_price, status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
        `;
        
        const [orderResult] = await db.query(insertOrderQuery, [
            userId, 
            recipient_name, 
            recipient_phone, 
            shipping_address, 
            shipping_city, 
            totalPrice
        ]);

        const newOrderId = orderResult.insertId;

        // 6. PINDAHKAN ITEM KERANJANG KE TABEL ORDER_ITEMS
        // Kita loop satu per satu (atau pakai bulk insert biar cepat)
        for (const item of cartItems) {
            await db.query(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                [newOrderId, item.product_id, item.quantity, item.price]
            );
        }

        // 7. KOSONGKAN KERANJANG USER (Karena sudah jadi order)
        await db.query("DELETE FROM carts WHERE user_id = ?", [userId]);

        // 8. RESPON SUKSES
        res.status(201).json({ 
            message: "Order berhasil dibuat", 
            order_id: newOrderId,
            total_price: totalPrice
        });

    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ message: "Gagal membuat pesanan." });
    }
};

module.exports = {
    createOrder
};