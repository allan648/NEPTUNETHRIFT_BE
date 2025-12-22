const db = require('../../db');
const fs = require('fs');
const path = require('path');

// 1. AMBIL PRODUK (Bisa Semua, atau Filter by Brand/Category)
const getProducts = async (req, res) => {
    try {
        const { category_id, brand_id, search } = req.query;
        
        let query = `
            SELECT p.*, c.name as category_name, b.name as brand_name 
            FROM products p
            JOIN categories c ON p.category_id = c.id
            JOIN brands b ON p.brand_id = b.id
            WHERE 1=1
        `;
        const params = [];

        // Logika Filter Pintar
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
    // TAMBAH 'size' DI SINI
    const { name, description, price, condition, size, category_id, brand_id } = req.body;
    
    try {
        let imageQuery = "";
        // TAMBAH 'size' KE ARRAY PARAMS
        let params = [name, description, price, condition, size, category_id, brand_id];

        if (req.file) {
            const newImage = `http://localhost:3000/uploads/${req.file.filename}`;
            imageQuery = ", image = ?";
            params.push(newImage);
        }

        params.push(id);

        await db.query(
            // TAMBAH size=? DI QUERY
            `UPDATE products SET name=?, description=?, price=?, \`condition\`=?, size=?, category_id=?, brand_id=? ${imageQuery} WHERE id=?`,
            params
        );
        res.json({ message: "Produk berhasil diupdate!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal update produk" });
    }
};

// 4. HAPUS PRODUK
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM products WHERE id = ?", [id]);
        res.json({ message: "Produk berhasil dihapus!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal menghapus produk" });
    }
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

module.exports = { getProducts, createProduct, updateProduct, deleteProduct, getMetadata };