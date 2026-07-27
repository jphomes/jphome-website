require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const authRoutes = require("./routes/auth");
const propertyRoutes = require("./routes/properties");
const blogRoutes = require("./routes/blogs");
const enquiryRoutes = require("./routes/enquiry");
const uploadRoutes = require("./routes/upload");
const { resolveMongoUri } = require("./utils/mongoUri");

const app = express();
const PORT = process.env.PORT || 5000;
const isVercel = Boolean(process.env.VERCEL);

function parseOrigins(value) {
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const allowedOrigins = parseOrigins(
  process.env.CLIENT_URL || "http://localhost:5173"
);

let mongo;
try {
  mongo = resolveMongoUri();
} catch (err) {
  console.error("❌", err.message);
  if (!isVercel) process.exit(1);
  throw err;
}

const mongoReady = mongoose
  .connect(mongo.uri)
  .then(() => {
    console.log(`✅ MongoDB connected (${mongo.label})`);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    if (!isVercel) process.exit(1);
    throw err;
  });

app.use(async (req, res, next) => {
  try {
    await mongoReady;
    next();
  } catch (err) {
    res.status(503).json({ message: "Database unavailable." });
  }
});

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (no Origin) and configured frontends
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use((err, req, res, next) => {
  console.error(err);
  if (err.message?.startsWith("CORS blocked")) {
    return res.status(403).json({ message: err.message });
  }
  if (err instanceof multer.MulterError || err.message === "Only image files are allowed.") {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: "Something went wrong on the server." });
});

if (!isVercel) {
  mongoReady.then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  });
}

module.exports = app;
