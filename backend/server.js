require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { resolveMongoUri } = require("./utils/mongoUri");

const app = express();
const PORT = process.env.PORT || 5000;
const isVercel = Boolean(process.env.VERCEL);

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
    if (mongoose.connection.readyState === 1) return mongo.label;
    await mongoose.connect(mongo.uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected (" + mongo.label + ")");
    return mongo.label;
  })().catch((err) => {
    mongoConnectPromise = null;
    console.error("MongoDB connection error:", err.message);
    throw err;
  });

  return mongoConnectPromise;
}

app.get(["/api/health", "/health"], (req, res) => {
  res.status(200).json({
    status: "ok",
    vercel: isVercel,
    appEnv: process.env.APP_ENV || process.env.NODE_ENV || "",
    hasMongoProd: Boolean((process.env.MONGO_URI_PROD || "").trim()),
    hasMongoStage: Boolean((process.env.MONGO_URI_STAGE || "").trim()),
    hasMongoLegacy: Boolean((process.env.MONGO_URI || "").trim()),
    hasJwtSecret: Boolean((process.env.JWT_SECRET || "").trim()),
    mongoReadyState: mongoose.connection.readyState,
    clientUrlConfigured: Boolean((process.env.CLIENT_URL || "").trim()),
  });
});

app.use(async (req, res, next) => {
  const p = req.path || "";
  if (p === "/api/health" || p === "/health" || p.endsWith("/health")) {
    return next();
  }
  try {
    await getMongoConnectPromise();
    return next();
  } catch (err) {
    return res.status(503).json({
      message: "Database unavailable.",
      error: err.message,
      hint: "Set APP_ENV=prod and MONGO_URI_PROD in Vercel Environment Variables, then Redeploy.",
    });
  }
});

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      console.warn("CORS blocked for origin: " + origin);
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));

try {
  app.use("/api/auth", require("./routes/auth"));
  app.use("/api/properties", require("./routes/properties"));
  app.use("/api/blogs", require("./routes/blogs"));
  app.use("/api/enquiry", require("./routes/enquiry"));
  app.use("/api/upload", require("./routes/upload"));
} catch (err) {
  console.error("Failed to mount routes:", err);
  app.use("/api", (req, res) => {
    res.status(500).json({ message: "API routes failed to load.", error: err.message });
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof multer.MulterError || err.message === "Only image files are allowed.") {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: "Something went wrong on the server.", error: err.message });
});

if (!isVercel) {
  getMongoConnectPromise()
    .then(() => {
      app.listen(PORT, () => console.log("Server running on http://localhost:" + PORT));
    })
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}

module.exports = app;
