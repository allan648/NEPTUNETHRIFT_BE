const db = require('../../db');
const fs = require('fs');
const path = require('path');

// 1. AMBIL PRODUK (Bisa Semua, atau Filter by Brand/Category)
const getProducts = async (req, res) => {
    try {
        // Tambahkan 'promo' ke destructuring query
        const { category_id, brand_id, search, admin, promo } = req.query; 
        
        let query = `
            SELECT p.*, c.name as category_name, b.name as brand_name 
            FROM products p
            JOIN categories c ON p.category_id = c.id
            JOIN brands b ON p.brand_id = b.id
            WHERE 1=1
        `;

        const params = [];

        // --- LOGIKA FILTER ---

        if (admin === 'true') {
            // Jika Admin: Tampilkan semua tanpa kecuali (untuk Management Product)
        } else {
            // Jika BUKAN Admin (Pembeli):
            query += " AND p.status = 'active'";

            if (promo === 'true') {
                // Jika sedang buka halaman PROMO: Tampilkan yang is_promotion = 1
                query += " AND p.is_promotion = 1";
            } else {
                // Jika sedang buka halaman PRODUCT BIASA: Tampilkan yang is_promotion = 0
                query += " AND p.is_promotion = 0";
            }
        }

        // --- FILTER TAMBAHAN (Kategori, Brand, Search) ---

        if (category_id) {
            query += " AND p.category_id = ?";
            params.push(category_id);
        }

        if (brand_id) {
            query += " AND p.brand_id = ?";
            params.push(brand_id);
        }

        if (search) {
            query += " AND p.name LIKE ?";
            params.push(`%${search}%`);
        }

        query += " ORDER BY p.createdAt DESC";

        const [products] = await db.query(query, params);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mengambil data produk" });
    }
};
// 2. TAMBAH PRODUK BARU
const createProduct = async (req, res) => {
    const { name, description, price, condition, size, category_id, brand_id } = req.body;
    
    // Ambil file dari req.files (karena pakai upload.fields)
    // Cek apakah file ada, jika ada buat URL-nya
    const files = req.files || {};
    const image1 = files['image'] ? `http://localhost:3000/uploads/${files['image'][0].filename}` : null;
    const image2 = files['image_2'] ? `http://localhost:3000/uploads/${files['image_2'][0].filename}` : null;
    const image3 = files['image_3'] ? `http://localhost:3000/uploads/${files['image_3'][0].filename}` : null;

    try {
        await db.query(
            "INSERT INTO products (name, description, price, `condition`, size, category_id, brand_id, image, image_2, image_3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [name, description, price, condition, size, category_id, brand_id, image1, image2, image3]
        );
        res.status(201).json({ message: "Produk berhasil ditambahkan!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal menambah produk" });
    }
};// 3. EDIT PRODUK
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { 
        name, 
        description, 
        price, 
        condition, 
        size, 
        category_id, 
        brand_id, 
        is_promotion, 
        discount_price 
    } = req.body;
    
    try {
        // 1. Pastikan nilai angka benar-benar angka (karena FormData mengirim string)
        const finalPrice = parseFloat(price) || 0;
        const finalDiscountPrice = parseFloat(discount_price) || 0;
        const finalIsPromotion = parseInt(is_promotion) || 0;
        const finalCondition = parseInt(condition) || 5;

        // 2. Susun Query Dasar
        // Gunakan backticks pada `condition` karena itu reserved word di MySQL
        let sql = `
            UPDATE products 
            SET name = ?, 
                description = ?, 
                price = ?, 
                \`condition\` = ?, 
                size = ?, 
                category_id = ?, 
                brand_id = ?, 
                is_promotion = ?, 
                discount_price = ?
        `;

        // 3. Susun Array Params sesuai urutan tanda tanya di atas
        let params = [
            name, 
            description, 
            finalPrice, 
            finalCondition, 
            size, 
            category_id, 
            brand_id, 
            finalIsPromotion, 
            finalDiscountPrice
        ];

        // 4. Cek jika ada upload gambar baru
        if (req.file) {
            const newImage = `http://localhost:3000/uploads/${req.file.filename}`;
            sql += ", image = ? ";
            params.push(newImage);
        }

        // 5. Terakhir tambahkan ID untuk WHERE
        sql += " WHERE id = ?";
        params.push(id);

        // 6. Eksekusi
        await db.query(sql, params);
        
        res.json({ message: "Produk berhasil diupdate!" });
    } catch (error) {
        console.error("Detail Error SQL:", error);
        res.status(500).json({ error: "Gagal update produk", detail: error.message });
    }
};

// 4. HAPUS PRODUK
// Menghapus (Ubah status jadi inactive)
const softDeleteProduct = async (req, res) => {
    const { id } = req.params;
    await db.query("UPDATE products SET status = 'inactive' WHERE id = ?", [id]);
    res.json({ message: "Produk dinonaktifkan dari user" });
};

// Mengembalikan (Ubah status jadi active)
const restoreProduct = async (req, res) => {
    const { id } = req.params;
    await db.query("UPDATE products SET status = 'active' WHERE id = ?", [id]);
    res.json({ message: "Produk diaktifkan kembali" });
};
// Helper untuk Dropdown di Frontend
const getMetadata = async (req, res) => {
    try {
        const [categories] = await db.query("SELECT * FROM categories");
        const [brands] = await db.query("SELECT * FROM brands");
        res.json({ categories, brands });
    } catch (error) {
        res.status(500).json({ error: "Gagal ambil metadata" });
    }
};


module.exports = { getProducts, createProduct, updateProduct, softDeleteProduct, getMetadata, restoreProduct };