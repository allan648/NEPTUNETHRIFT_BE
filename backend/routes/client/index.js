const express = require('express');
const router = express.Router();
const db = require('../../db'); // <--- PENTING: Import Database

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

// --- RUTE LAMA (JANGAN DIHAPUS) ---
router.use('/auth', authRoutes);
router.use('/user', userRoutes);

// --- RUTE BARU: PUBLIC API PRODUK ---

// 1. Ambil Semua Produk (Support Filter & Sort)
router.get('/products', async (req, res) => {
    try {
        const { brand_id, category_id, sort } = req.query;
        
        // Query Dasar: Join ke Brands dan Categories biar dapat namanya
        let query = `
            SELECT p.*, b.name as brand_name, c.name as category_name 
            FROM products p
            JOIN brands b ON p.brand_id = b.id
            JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        `;
        const params = [];

        // Logika Filter (Jika user memilih filter di sidebar)
        if (brand_id) {
            query += " AND p.brand_id = ?";
            params.push(brand_id);
        }
        if (category_id) {
            query += " AND p.category_id = ?";
            params.push(category_id);
        }

        // Logika Sorting (Newest, Price High/Low)
        if (sort === 'low_high') query += " ORDER BY p.price ASC";
        else if (sort === 'high_low') query += " ORDER BY p.price DESC";
        else if (sort === 'newest') query += " ORDER BY p.createdAt DESC";
        else query += " ORDER BY p.createdAt DESC"; // Default: Terbaru

        const [products] = await db.query(query, params);
        res.json(products);
    } catch (error) {
        console.error("Error fetch products:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

// 2. Metadata untuk Sidebar Filter (Dropdown Brand & Category)
router.get('/metadata', async (req, res) => {
    try {
        const [brands] = await db.query("SELECT * FROM brands");
        const [categories] = await db.query("SELECT * FROM categories");
        res.json({ brands, categories });
    } catch (error) {
        console.error("Error fetch metadata:", error);
        res.status(500).json({ error: "Error loading metadata" });
    }
});


// ... kode sebelumnya ...

// 3. API PUBLIC: Ambil Detail 1 Produk
router.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Ambil data produk + Nama Brand + Nama Kategori
        const [rows] = await db.query(`
            SELECT p.*, b.name as brand_name, c.name as category_name 
            FROM products p
            JOIN brands b ON p.brand_id = b.id
            JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        const product = rows[0];

        // Ambil Produk Serupa (Related Products) berdasarkan Kategori yang sama
        // Limit 4, dan kecualikan produk yang sedang dibuka
        const [related] = await db.query(`
            SELECT * FROM products 
            WHERE category_id = ? AND id != ? 
            ORDER BY RAND() 
            LIMIT 4
        `, [product.category_id, id]);

        res.json({ product, related });

    } catch (error) {
        console.error("Error fetch detail:", error);
        res.status(500).json({ error: "Server Error" });
    }
});



module.exports = router;