const jwt = require("jsonwebtoken");

module.exports = function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Login required." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload; // { id, username }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }
};
