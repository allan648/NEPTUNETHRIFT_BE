const db = require('../../db');

// 1. TAMBAH KE KERANJANG
const addToCart = async (req, res) => {
    const user_id = req.user.id; 
    const { product_id } = req.body;

    try {
        // Cek apakah barang sudah ada?
        const [existing] = await db.query(
            "SELECT * FROM carts WHERE user_id = ? AND product_id = ?",
            [user_id, product_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Produk sudah ada di keranjang!" });
        }

        // Masukkan barang (Default quantity = 1, Default is_selected = 1 / Tercentang)
        await db.query(
            "INSERT INTO carts (user_id, product_id, quantity, is_selected) VALUES (?, ?, 1, 1)",
            [user_id, product_id]
        );

        res.status(201).json({ message: "Berhasil masuk keranjang" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal menambahkan ke keranjang" });
    }
};

// 2. LIHAT KERANJANG (GET)
const getMyCart = async (req, res) => {
    const user_id = req.user.id;

    try {
        // PERBAIKAN PENTING: Ambil kolom 'c.is_selected'
        const query = `
            SELECT 
                c.id as cart_id, 
                c.quantity, 
                c.is_selected, 
                p.id as product_id, 
                p.name, 
                p.price, 
                p.image, 
                p.size, 
                p.condition 
            FROM carts c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        `;
        const [items] = await db.query(query, [user_id]);

        // Hitung Total (Hanya yang dicentang / is_selected = 1)
        let totalPrice = 0;
        items.forEach(item => {
            if (item.is_selected === 1) {
                totalPrice += item.price * item.quantity;
            }
        });

        res.json({ items, totalPrice });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mengambil data keranjang" });
    }
};

// 3. UPDATE STATUS CENTANG (CHECKBOX)
// Fungsi ini HANYA UPDATE, TIDAK MENGHAPUS DATA.
const updateCartItem = async (req, res) => {
    const userId = req.user.id;
    const cartId = req.params.id;
    const { is_selected } = req.body; // Menerima true/false dari Frontend

    try {
        await db.query(
            "UPDATE carts SET is_selected = ? WHERE id = ? AND user_id = ?",
            [is_selected ? 1 : 0, cartId, userId]
        );
        res.json({ message: "Status checklist diperbarui" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal update status item" });
    }
};

// 4. HAPUS ITEM (TOMBOL SAMPAH)
const deleteCartItem = async (req, res) => {
    const user_id = req.user.id;
    const cart_id = req.params.id;

    try {
        const [result] = await db.query(
            "DELETE FROM carts WHERE id = ? AND user_id = ?",
            [cart_id, user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Item tidak ditemukan" });
        }

        res.json({ message: "Item dihapus permanen dari keranjang" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal menghapus item" });
    }
};

module.exports = { addToCart, getMyCart, updateCartItem, deleteCartItem };