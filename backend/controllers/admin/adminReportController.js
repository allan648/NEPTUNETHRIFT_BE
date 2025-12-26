const db = require('../../db');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Inisialisasi Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getAiAnalysis = async (req, res) => {
    try {
        console.log("1. Memulai proses Analisa AI...");

        // --- AMBIL DATA DARI DB ---
        const [incomeData] = await db.query(`
            SELECT COUNT(*) as total_orders, COALESCE(SUM(total_price), 0) as total_revenue 
            FROM orders WHERE status IN ('paid', 'shipped', 'delivered', 'completed')
        `);
        
        const [topProducts] = await db.query(`
            SELECT p.name, p.image, SUM(oi.quantity) as sold
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id
            WHERE o.status IN ('paid', 'shipped', 'delivered', 'completed')
            GROUP BY p.id
            ORDER BY sold DESC
            LIMIT 3
        `);

        const [pendingData] = await db.query(`SELECT COUNT(*) as count FROM orders WHERE status = 'pending'`);

        console.log("2. Data Database berhasil diambil.");

        // --- BIKIN PROMPT ---
        const dataContext = `
            DATA TOKO:
            - Revenue: ${incomeData[0].total_revenue}
            - Sales: ${incomeData[0].total_orders}
            - Pending: ${pendingData[0].count}
        `;

        const prompt = `
            ${dataContext}
            Analisa data ini sebagai Business Intelligence. 
            Berikan output Markdown (Ringkasan, Analisis, Rekomendasi).
            Bahasa Indonesia.
        `;

        // --- PANGGIL GEMINI ---
        console.log("3. Mengirim request ke Google Gemini...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Pastikan model sesuai
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("4. Balasan AI diterima. Panjang teks:", text.length);

        // --- SIMPAN KE DB (DISINI BIASANYA ERROR) ---
        console.log("5. Mencoba menyimpan ke tabel ai_reports...");
        
        try {
            await db.query("INSERT INTO ai_reports (analysis_text) VALUES (?)", [text]);
            console.log("✅ BERHASIL MENYIMPAN KE DB!");
        } catch (dbError) {
            console.error("❌ GAGAL INSERT DB:", dbError.message);
            // Kita lanjut saja agar frontend tetap dapat respon walau gagal simpan
        }

        // --- KIRIM KE FRONTEND ---
        res.json({ 
            analysis: text,
            topProductsData: topProducts
        });

    } catch (error) {
        console.error("❌ GLOBAL ERROR:", error);
        res.status(500).json({ message: "Gagal menganalisa data." });
    }
};
const getReportHistory = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM ai_reports ORDER BY created_at DESC");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal ambil riwayat." });
    }
};

module.exports = { getAiAnalysis, getReportHistory };