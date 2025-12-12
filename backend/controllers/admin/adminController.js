const db = require("../../db");

const getUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, username, email, phone, role FROM users WHERE is_active = 1 ORDER BY createdAt DESC"
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal ambil data" });
  }
};

const deactivateUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await db.query("UPDATE users SET is_active = 0 WHERE id = ?", [userId]);
    res.json({ message: "User dinonaktifkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal hapus user" });
  }
};

module.exports = { getUsers, deactivateUser };
