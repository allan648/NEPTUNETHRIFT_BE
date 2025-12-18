const multer = require('multer');
const path = require('path');
const fs = require('fs'); // <--- TAMBAHAN 1: Import File System

// Tentukan lokasi folder uploads
const uploadDir = path.join(__dirname, '../uploads');

// <--- TAMBAHAN 2: Cek apakah folder ada, jika tidak, buat baru
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Folder 'uploads' berhasil dibuat otomatis!");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Gunakan variabel uploadDir yang sudah pasti ada
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
};

const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } 
});

module.exports = upload;