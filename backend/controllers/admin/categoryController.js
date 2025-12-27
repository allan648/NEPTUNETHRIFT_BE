const db = require('../../db');

// 1. Ambil Semua Kategori
const getAllCategories = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM categories ORDER BY id DESC");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengambil data kategori" });
    }
};

// 2. Tambah Kategori Baru
const createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        await db.query("INSERT INTO categories (name) VALUES (?)", [name]);
        res.status(201).json({ message: "Kategori berhasil ditambahkan" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambah kategori" });
    }
};

// 3. Update Kategori
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        await db.query("UPDATE categories SET name = ? WHERE id = ?", [name, id]);
        res.json({ message: "Kategori berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui kategori" });
    }
};

// 4. Hapus Kategori
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM categories WHERE id = ?", [id]);
        res.json({ message: "Kategori berhasil dihapus" });
    } catch (error) {
        // Biasanya error jika kategori masih dipakai oleh produk (Foreign Key)
        res.status(500).json({ message: "Gagal hapus. Kategori mungkin masih digunakan produk." });
    }
};

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};