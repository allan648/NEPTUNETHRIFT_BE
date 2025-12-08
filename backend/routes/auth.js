const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// SIGN UP
router.post("/signup", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // validasi input
  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const db = req.db;

  try {
    // cek email sudah ada atau belum
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", err });

        if (result.length > 0) {
          return res.status(400).json({ message: "Email already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert user baru
        db.query(
          "INSERT INTO users (email, password) VALUES (?, ?)",
          [email, hashedPassword],
          (err, result) => {
            if (err) return res.status(500).json({ message: "Insert failed", err });

            return res.status(201).json({ message: "User registered successfully" });
          }
        );
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
