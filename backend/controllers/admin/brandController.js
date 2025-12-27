const db = require('../../db');

// 1. Ambil Semua Brand
const getAllBrands = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM brands ORDER BY id DESC");
        res.json(rows);
    } catch (error) {
        console.error("Error Get Brands:", error);
        res.status(500).json({ message: "Gagal mengambil data brand." });
    }
};

// 2. Tambah Brand Baru
const createBrand = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Nama brand wajib diisi." });

    try {
        await db.query("INSERT INTO brands (name) VALUES (?)", [name]);
        res.status(201).json({ message: "Brand berhasil ditambahkan!" });
    } catch (error) {
        console.error("Error Create Brand:", error);
        res.status(500).json({ message: "Gagal menambah brand." });
    }
};

// 3. Update Brand
const updateBrand = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const [result] = await db.query("UPDATE brands SET name = ? WHERE id = ?", [name, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Brand tidak ditemukan." });
        
        res.json({ message: "Brand berhasil diperbarui!" });
    } catch (error) {
        console.error("Error Update Brand:", error);
        res.status(500).json({ message: "Gagal memperbarui brand." });
    }
};

// 4. Hapus Brand
const deleteBrand = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("DELETE FROM brands WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Brand tidak ditemukan." });

        res.json({ message: "Brand berhasil dihapus!" });
    } catch (error) {
        console.error("Error Delete Brand:", error);
        // Error biasanya terjadi jika ID brand masih terikat dengan produk (Foreign Key Constraint)
        res.status(500).json({ message: "Gagal hapus. Brand mungkin masih digunakan oleh produk." });
    }
};

module.exports = {
    getAllBrands,
    createBrand,
    updateBrand,
    deleteBrand
};