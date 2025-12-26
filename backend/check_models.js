require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ API Key tidak ditemukan di .env");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("🔍 Sedang mengecek model ke Google...");

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.error) {
        console.error("❌ Error dari Google:", data.error.message);
    } else if (data.models) {
        console.log("\n✅ MODEL YANG TERSEDIA UNTUK KAMU:");
        console.log("====================================");
        
        const contentModels = data.models.filter(m => 
            m.supportedGenerationMethods.includes("generateContent")
        );

        contentModels.forEach(m => {
            // Kita ambil nama bersihnya (misal: models/gemini-pro -> gemini-pro)
            console.log(`🔹 ${m.name.replace('models/', '')}`);
        });

        console.log("\n👉 Silakan pilih salah satu nama di atas (yang ada tanda 🔹) dan masukkan ke controller.");
    } else {
        console.log("⚠️ Tidak ada model yang ditemukan/format response beda.", data);
    }
  })
  .catch(err => console.error("❌ Gagal koneksi:", err));