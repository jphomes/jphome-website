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

// Required behind Vercel / Cloudflare proxies (fixes rate-limit crashes)
app.set("trust proxy", 1);

function parseOrigins(value) {
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const allowedOrigins = parseOrigins(
  process.env.CLIENT_URL ||
    "http://localhost:5173,https://jphomes.in,https://www.jphomes.in"
);

let mongoConnectPromise = null;

function getMongoConnectPromise() {
  if (mongoConnectPromise) return mongoConnectPromise;

  mongoConnectPromise = (async () => {
    const mongo = resolveMongoUri();
    if (mongoose.connection.readyState === 1) {
      return mongo.label;
    }
    await mongoose.connect(mongo.uri);
    console.log(`✅ MongoDB connected (${mongo.label})`);
    return mongo.label;
  })().catch((err) => {
    // Allow retry on next request
    mongoConnectPromise = null;
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  });

  return mongoConnectPromise;
}

app.use(async (req, res, next) => {
  // Health can run without DB so we can diagnose env issues on Vercel
  if (req.path === "/api/health" || req.path === "/api/health/") {
    return next();
  }
  try {
    await getMongoConnectPromise();
    next();
  } catch (err) {
    res.status(503).json({
      message: "Database unavailable.",
      error: err.message,
      hint: "Set APP_ENV=prod and MONGO_URI_PROD (or MONGO_URI) in Vercel Environment Variables, then Redeploy.",
    });
  }
});

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      // Do not throw — throwing crashes the serverless function
      console.warn(`CORS blocked for origin: ${origin}`);
      return callback(null, false);
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

app.get("/api/health", (req, res) => {
  const appEnv = process.env.APP_ENV || process.env.NODE_ENV || "";
  res.json({
    status: "ok",
    vercel: isVercel,
    appEnv,
    hasMongoProd: Boolean((process.env.MONGO_URI_PROD || "").trim()),
    hasMongoStage: Boolean((process.env.MONGO_URI_STAGE || "").trim()),
    hasMongoLegacy: Boolean((process.env.MONGO_URI || "").trim()),
    hasJwtSecret: Boolean((process.env.JWT_SECRET || "").trim()),
    mongoReadyState: mongoose.connection.readyState,
    clientUrlConfigured: Boolean((process.env.CLIENT_URL || "").trim()),
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.message?.startsWith("CORS blocked")) {
    return res.status(403).json({ message: err.message });
  }
  if (err instanceof multer.MulterError || err.message === "Only image files are allowed.") {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: "Something went wrong on the server.", error: err.message });
});

if (!isVercel) {
  getMongoConnectPromise()
    .then(() => {
      app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
      console.error("❌", err.message);
      process.exit(1);
    });
}

module.exports = app;
