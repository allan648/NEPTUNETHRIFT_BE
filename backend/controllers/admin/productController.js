const db = require('../../db');
const fs = require('fs');
const path = require('path');

// 1. AMBIL PRODUK (Publik & Admin)
const getProducts = async (req, res) => {
    try {
        const { category_id, brand_id, search, admin, promo } = req.query; 
        
        let query = `
            SELECT p.*, c.name as category_name, b.name as brand_name 
            FROM products p
            JOIN categories c ON p.category_id = c.id
            JOIN brands b ON p.brand_id = b.id
            WHERE 1=1
        `;

        const params = [];

        if (admin === 'true') {
            // Admin: Tampilkan semua
        } else {
            query += " AND p.status = 'active'";
            if (promo === 'true') {
                query += " AND p.is_promotion = 1";
            } else {
                query += " AND p.is_promotion = 0";
            }
        }

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

// 2. AMBIL DETAIL PRODUK (Solusi Fix Error Router)
const getProductDetail = async (req, res) => {
    const { id } = req.params;
    try {
        // Ambil data produk utama
        const [rows] = await db.query(`
            SELECT p.*, c.name as category_name, b.name as brand_name 
            FROM products p
            JOIN categories c ON p.category_id = c.id
            JOIN brands b ON p.brand_id = b.id
            WHERE p.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        const product = rows[0];

        // Ambil produk terkait (Kategori sama, tapi bukan produk ini sendiri)
        const [related] = await db.query(`
            SELECT id, name, price, image, is_promotion, discount_price 
            FROM products 
            WHERE category_id = ? AND id != ? AND status = 'active'
            LIMIT 4
        `, [product.category_id, id]);

        res.json({ product, related });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mengambil detail produk" });
    }
};

// 3. TAMBAH PRODUK BARU
const createProduct = async (req, res) => {
    const { name, description, price, condition, size, category_id, brand_id } = req.body;
    
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
};

// 4. EDIT PRODUK
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { 
        name, description, price, condition, size, 
        category_id, brand_id, is_promotion, discount_price 
    } = req.body;
    
    try {
        const finalPrice = parseFloat(price) || 0;
        const finalDiscountPrice = parseFloat(discount_price) || 0;
        const finalIsPromotion = parseInt(is_promotion) || 0;
        const finalCondition = parseInt(condition) || 5;

        let sql = `
            UPDATE products 
            SET name = ?, description = ?, price = ?, \`condition\` = ?, 
                size = ?, category_id = ?, brand_id = ?, is_promotion = ?, 
                discount_price = ?
        `;

        let params = [
            name, description, finalPrice, finalCondition, 
            size, category_id, brand_id, finalIsPromotion, finalDiscountPrice
        ];

        // Cek upload gambar (Support 3 field gambar)
        const files = req.files || {};
        if (files['image']) {
            sql += ", image = ?";
            params.push(`http://localhost:3000/uploads/${files['image'][0].filename}`);
        }
        if (files['image_2']) {
            sql += ", image_2 = ?";
            params.push(`http://localhost:3000/uploads/${files['image_2'][0].filename}`);
        }
        if (files['image_3']) {
            sql += ", image_3 = ?";
            params.push(`http://localhost:3000/uploads/${files['image_3'][0].filename}`);
        }

        sql += " WHERE id = ?";
        params.push(id);

        await db.query(sql, params);
        res.json({ message: "Produk berhasil diupdate!" });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ error: "Gagal update produk" });
    }
};

// 5. SOFT DELETE & RESTORE
const softDeleteProduct = async (req, res) => {
    const { id } = req.params;
    await db.query("UPDATE products SET status = 'inactive' WHERE id = ?", [id]);
    res.json({ message: "Produk dinonaktifkan" });
};

const restoreProduct = async (req, res) => {
    const { id } = req.params;
    await db.query("UPDATE products SET status = 'active' WHERE id = ?", [id]);
    res.json({ message: "Produk diaktifkan kembali" });
};

// 6. METADATA
const getMetadata = async (req, res) => {
    try {
        const [categories] = await db.query("SELECT * FROM categories");
        const [brands] = await db.query("SELECT * FROM brands");
        res.json({ categories, brands });
    } catch (error) {
        res.status(500).json({ error: "Gagal ambil metadata" });
    }
};

// EXPORT SEMUA FUNGSI (Pastikan getProductDetail ada di sini)
module.exports = { 
    getProducts, 
    getProductDetail, // <-- Sangat penting
    createProduct, 
    updateProduct, 
    softDeleteProduct, 
    restoreProduct, 
    getMetadata 
};