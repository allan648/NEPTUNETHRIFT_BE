const db = require('../../db');

// 1. Tambah ke Keranjang
const addToCart = async (req, res) => {
    // User ID didapat dari Middleware Auth (req.user)
    const user_id = req.user.id; 
    const { product_id } = req.body;

    try {
        // Cek apakah barang sudah ada di keranjang user ini?
        const [existing] = await db.query(
            "SELECT * FROM carts WHERE user_id = ? AND product_id = ?",
            [user_id, product_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Produk sudah ada di keranjang!" });
        }

        // Karena Thrift (barang unik), quantity otomatis 1
        await db.query(
            "INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, 1)",
            [user_id, product_id]
        );

        res.status(201).json({ message: "Berhasil masuk keranjang" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal menambahkan ke keranjang" });
    }
};

// 2. Lihat Isi Keranjang
const getMyCart = async (req, res) => {
    const user_id = req.user.id;

    try {
        // Join ke tabel products untuk dapat nama, harga, dan gambar
        const query = `
            SELECT c.id as cart_id, c.quantity, p.id as product_id, p.name, p.price, p.image, p.size, p.condition 
            FROM carts c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        `;
        const [items] = await db.query(query, [user_id]);

        // Hitung Total Harga
        let totalPrice = 0;
        items.forEach(item => {
            totalPrice += item.price * item.quantity;
        });

        res.json({ items, totalPrice });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mengambil data keranjang" });
    }
};

// 3. Hapus Item dari Keranjang
const deleteCartItem = async (req, res) => {
    const user_id = req.user.id;
    const cart_id = req.params.id;

    try {
        // Pastikan yang dihapus adalah milik user yang login
        const [result] = await db.query(
            "DELETE FROM carts WHERE id = ? AND user_id = ?",
            [cart_id, user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Item tidak ditemukan atau bukan milik Anda" });
        }

        res.json({ message: "Item dihapus dari keranjang" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal menghapus item" });
    }
};

module.exports = { addToCart, getMyCart, deleteCartItem };