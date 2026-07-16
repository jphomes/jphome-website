const express = require("express");
const multer = require("multer");
const requireAdmin = require("../middleware/auth");
const { cloudinary, configureCloudinary } = require("../utils/cloudinary");

const router = express.Router();

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed."));
    }
    cb(null, true);
  },
});

const brochureUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB PDFs
  fileFilter: (_req, file, cb) => {
    const ok =
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf");
    if (!ok) return cb(new Error("Only PDF brochures are allowed."));
    cb(null, true);
  },
});

function uploadBuffer(buffer, folder, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder || process.env.CLOUDINARY_FOLDER || "jpgroup",
        resource_type: options.resource_type || "image",
        ...options,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

router.post("/", requireAdmin, imageUpload.single("image"), async (req, res) => {
  try {
    if (!configureCloudinary()) {
      return res.status(503).json({
        message: "Image upload is not configured. Set Cloudinary env vars on the server.",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    const folder = req.body.folder || process.env.CLOUDINARY_FOLDER || "jpgroup";
    const result = await uploadBuffer(req.file.buffer, folder);

    return res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    console.error("Upload error:", err.message);
    return res.status(500).json({ message: err.message || "Upload failed." });
  }
});

router.post("/many", requireAdmin, imageUpload.array("images", 10), async (req, res) => {
  try {
    if (!configureCloudinary()) {
      return res.status(503).json({
        message: "Image upload is not configured. Set Cloudinary env vars on the server.",
      });
    }

    if (!req.files?.length) {
      return res.status(400).json({ message: "No image files provided." });
    }

    const folder = req.body.folder || process.env.CLOUDINARY_FOLDER || "jpgroup";
    const results = await Promise.all(req.files.map((f) => uploadBuffer(f.buffer, folder)));

    return res.status(201).json({
      urls: results.map((r) => r.secure_url),
      publicIds: results.map((r) => r.public_id),
    });
  } catch (err) {
    console.error("Upload error:", err.message);
    return res.status(500).json({ message: err.message || "Upload failed." });
  }
});

// PDF brochure upload
router.post("/brochure", requireAdmin, brochureUpload.single("brochure"), async (req, res) => {
  try {
    if (!configureCloudinary()) {
      return res.status(503).json({
        message: "Upload is not configured. Set Cloudinary env vars on the server.",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No PDF file provided." });
    }

    const folder =
      req.body.folder ||
      `${process.env.CLOUDINARY_FOLDER || "jpgroup"}/brochures`;

    // Store as raw (no PDF transforms — those often 400 without Cloudinary's PDF add-on)
    const result = await uploadBuffer(req.file.buffer, folder, {
      resource_type: "raw",
      public_id: `brochure_${Date.now()}`,
      format: "pdf",
    });

    return res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id,
      bytes: result.bytes,
      format: result.format || "pdf",
      resourceType: "raw",
    });
  } catch (err) {
    console.error("Brochure upload error:", err.message);
    return res.status(500).json({ message: err.message || "Brochure upload failed." });
  }
});

module.exports = router;
