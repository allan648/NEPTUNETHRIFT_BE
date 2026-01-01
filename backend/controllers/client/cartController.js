const db = require('../../db');

// 1. TAMBAH KE KERANJANG (Ditambah pengecekan status barang)
const addToCart = async (req, res) => {
    const user_id = req.user.id; 
    const { product_id } = req.body;

    try {
        // Cek apakah barang aktif? (Jangan biarkan barang laku masuk keranjang)
        const [product] = await db.query("SELECT status FROM products WHERE id = ?", [product_id]);
        if (product.length === 0 || product[0].status !== 'active') {
            return res.status(400).json({ message: "Maaf, barang ini sudah tidak tersedia." });
        }

        // Cek apakah barang sudah ada di keranjang user ini?
        const [existing] = await db.query(
            "SELECT * FROM carts WHERE user_id = ? AND product_id = ?",
            [user_id, product_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Produk sudah ada di keranjang!" });
        }

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

// 2. LIHAT KERANJANG (Filter Inactive & Hitung Harga Promo)
const getMyCart = async (req, res) => {
    const user_id = req.user.id;

    try {
        const query = `
            SELECT 
                c.id as cart_id, c.quantity, c.is_selected, 
                p.id as product_id, p.name, p.price, p.image, 
                p.size, p.condition, p.status,
                p.is_promotion, p.discount_price
            FROM carts c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ? AND p.status = 'active'
        `;
        const [items] = await db.query(query, [user_id]);

        // Hitung Total dengan LOGIKA PROMO
        let totalPrice = 0;
        items.forEach(item => {
            if (item.is_selected === 1) {
                // Jika promo, gunakan discount_price, jika tidak gunakan price asli
                const activePrice = item.is_promotion === 1 ? item.discount_price : item.price;
                totalPrice += activePrice * item.quantity;
            }
        });

        res.json({ items, totalPrice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mengambil data keranjang" });
    }
};

// 3. AMBIL JUMLAH KERANJANG (Untuk Navbar Badge - FIX BUG ANGKA)
const getCartCount = async (req, res) => {
    const user_id = req.user.id;
    try {
        // HANYA hitung produk yang statusnya masih 'active'
        const [result] = await db.query(`
            SELECT COUNT(*) as count 
            FROM carts c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ? AND p.status = 'active'
        `, [user_id]);

        res.json({ count: result[0].count });
    } catch (error) {
        res.status(500).json({ error: "Gagal menghitung keranjang" });
    }
};

// 4. UPDATE STATUS CENTANG
const updateCartItem = async (req, res) => {
    const userId = req.user.id;
    const cartId = req.params.id;
    const { is_selected } = req.body;

    try {
        await db.query(
            "UPDATE carts SET is_selected = ? WHERE id = ? AND user_id = ?",
            [is_selected ? 1 : 0, cartId, userId]
        );
        res.json({ message: "Status checklist diperbarui" });
    } catch (error) {
        res.status(500).json({ message: "Gagal update status item" });
    }
};

// 5. HAPUS ITEM
const deleteCartItem = async (req, res) => {
    const user_id = req.user.id;
    const cart_id = req.params.id;

    try {
        await db.query("DELETE FROM carts WHERE id = ? AND user_id = ?", [cart_id, user_id]);
        res.json({ message: "Item dihapus" });
    } catch (error) {
        res.status(500).json({ error: "Gagal menghapus item" });
    }
};

module.exports = { addToCart, getMyCart, getCartCount, updateCartItem, deleteCartItem };