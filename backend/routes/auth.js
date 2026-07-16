const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const Admin = require("../models/Admin");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

// Slow down brute-force attempts on the single admin account.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts. Try again later." },
});

// POST /api/auth/login
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const ok = await admin.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      token,
      admin: { username: admin.username, name: admin.name, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
});

// GET /api/auth/me — verify token & fetch profile for the admin panel
router.get("/me", requireAdmin, async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select("-password");
  if (!admin) return res.status(404).json({ message: "Admin not found." });
  res.json(admin);
});

module.exports = router;
