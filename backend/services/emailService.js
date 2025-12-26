const nodemailer = require('nodemailer');
require('dotenv').config(); // Pastikan dotenv dipanggil agar bisa baca .env

// 1. Konfigurasi Pengirim (Ambil dari .env)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // <--- Pakai variabel environment
        pass: process.env.EMAIL_PASS  // <--- Pakai variabel environment
    }
});

// 2. Fungsi Kirim Email Resi
const sendResiEmail = async (userEmail, recipientName, orderId, trackingNumber, courierName) => {
    
    const emailHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #1e3a8a; margin: 0;">Neptune Thrift 🌊</h1>
                <p style="color: #888; margin-top: 5px;">Fashion Berkualitas, Harga Pas</p>
            </div>

            <hr style="border: 0; border-top: 1px solid #eee;">

            <div style="padding: 20px 0;">
                <h2 style="color: #333;">Paketmu Sedang Meluncur! 🚚</h2>
                <p>Halo <strong>${recipientName}</strong>,</p>
                <p>Pesananmu dengan ID <strong>#${orderId}</strong> sudah kami proses dan serahkan ke kurir.</p>
                
                <div style="background-color: #f0f9ff; border-left: 4px solid #1e3a8a; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #555; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Kurir Pengiriman</p>
                    <p style="margin: 5px 0 10px 0; font-size: 18px; font-weight: bold; color: #333;">${courierName}</p>
                    
                    <p style="margin: 0; color: #555; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Nomor Resi</p>
                    <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #1e3a8a; letter-spacing: 2px;">
                        ${trackingNumber}
                    </p>
                </div>

                <p>Kamu bisa memantau perjalanan paketmu langsung melalui website kami:</p>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="http://localhost:5173/myorder" 
                       style="background-color: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">
                       Lacak Pesanan Saya
                    </a>
                </div>
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;">

            <div style="text-align: center; font-size: 12px; color: #aaa; margin-top: 20px;">
                <p>&copy; 2025 Neptune Thrift. All rights reserved.</p>
                <p>Ini adalah email otomatis, mohon jangan dibalas.</p>
            </div>
        </div>
    `;

    const mailOptions = {
        from: `"Neptune Thrift Admin" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `📦 Paket Dikirim (${courierName})! Resi Pesanan #${orderId}`,
        html: emailHTML
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email resi (${courierName}) sukses terkirim ke: ${userEmail}`);
    } catch (error) {
        console.error("❌ Gagal kirim email:", error);
    }
};

const sendArrivedEmail = async (userEmail, recipientName, orderId) => {
    const emailHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #16a34a;">Paket Telah Tiba! 📦</h2>
            <p>Halo <strong>${recipientName}</strong>,</p>
            <p>Admin kami telah memverifikasi bahwa pesanan <strong>#${orderId}</strong> sudah sampai di alamat tujuan.</p>
            
            <p>Mohon cek kondisi barang. Jika aman, silakan klik tombol di bawah untuk menyelesaikan pesanan:</p>
            
            <a href="http://localhost:5173/my-order" style="background-color: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
                Konfirmasi Pesanan Diterima
            </a>
        </div>
    `;

    const mailOptions = {
        from: '"Neptune Thrift" <no-reply@neptunethrift.com>',
        to: userEmail,
        subject: `📦 Paket Sampai - Konfirmasi Order #${orderId}`,
        html: emailHTML
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email Arrived terkirim ke: ${userEmail}`);
    } catch (error) {
        console.error("❌ Gagal kirim email:", error);
    }
};

module.exports = { sendResiEmail, sendArrivedEmail };