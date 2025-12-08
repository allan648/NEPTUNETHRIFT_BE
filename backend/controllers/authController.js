const db = require("../db");
const bcrypt = require("bcryptjs");

// ===============================
// SIGNUP
// ===============================
exports.signup = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword)
    return res.status(400).json({ message: "Semua field wajib diisi." });

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Password tidak cocok." });

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Server error." });

    if (result.length > 0)
      return res.status(400).json({ message: "Email sudah digunakan." });

    const hashed = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashed],
      (err) => {
        if (err) return res.status(500).json({ message: "Gagal daftar." });
        res.json({ message: "Registrasi berhasil!" });
      }
    );
  });
};

// ===============================
// LOGIN
// ===============================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Server error." });

    if (result.length === 0)
      return res.status(400).json({ message: "Email tidak ditemukan." });

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Password salah." });

    req.session.user = {
      id: user.id,
      email: user.email,
    };

    res.json({ message: "Login berhasil", user: req.session.user });
  });
};

// ===============================
// LOGOUT
// ===============================
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logout berhasil" });
  });
};

// ===============================
// CEK USER LOGIN
// ===============================
exports.me = (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Belum login" });

  res.json({ user: req.session.user });
};
