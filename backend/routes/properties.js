const express = require("express");
const Property = require("../models/Property");
const requireAdmin = require("../middleware/auth");
const {
  destroyPropertyImages,
  destroyByPublicId,
  extractPublicIdFromUrl,
  configureCloudinary,
  cloudinary,
} = require("../utils/cloudinary");
const { parsePagination, paginationMeta } = require("../utils/pagination");

const router = express.Router();

/** Strip broken Cloudinary flags and try raw + image delivery URLs. */
function brochureFetchCandidates(brochureUrl, brochurePublicId) {
  const urls = [];
  const clean = (u) =>
    String(u)
      .trim()
      .replace(/\/upload\/fl_attachment(?::[^/]+)?\//, "/upload/");

  if (brochureUrl) {
    const c = clean(brochureUrl);
    if (c) {
      urls.push(c);
      if (c.includes("/image/upload/")) urls.push(c.replace("/image/upload/", "/raw/upload/"));
      if (c.includes("/raw/upload/")) urls.push(c.replace("/raw/upload/", "/image/upload/"));
    }
  }

  if (brochurePublicId && configureCloudinary()) {
    for (const resource_type of ["raw", "image"]) {
      try {
        const built = cloudinary.url(brochurePublicId, {
          resource_type,
          type: "upload",
          secure: true,
          format: "pdf",
        });
        if (built) urls.push(built);
      } catch {
        /* ignore */
      }
    }
  }

  return [...new Set(urls.filter(Boolean))];
}

async function fetchBrochureBuffer(candidates) {
  let lastError = null;
  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        lastError = new Error(`HTTP ${res.status} for ${url}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (!buf.length) {
        lastError = new Error(`Empty body for ${url}`);
        continue;
      }
      return { buffer: buf, contentType: res.headers.get("content-type") || "application/pdf" };
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("Brochure file not reachable.");
}

// GET /api/properties  — public list with filters + pagination (newest first)
router.get("/", async (req, res) => {
  try {
    const {
      city,
      propertyType,
      status,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      bedrooms,
      q,
      featured,
      rera,
    } = req.query;
    const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 10, maxLimit: 50 });

    const filter = {};
    if (city) filter["location.city"] = new RegExp(city, "i");
    if (propertyType) filter.propertyType = propertyType;
    if (status) filter.status = status;
    if (bedrooms) filter["specs.bedrooms"] = { $gte: Number(bedrooms) };
    if (featured) filter.featured = featured === "true";
    if (rera === "true") filter.reraApproved = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minArea || maxArea) {
      filter["specs.sqft"] = {};
      if (minArea) filter["specs.sqft"].$gte = Number(minArea);
      if (maxArea) filter["specs.sqft"].$lte = Number(maxArea);
    }
    if (q) filter.$text = { $search: q };

    const [properties, total] = await Promise.all([
      Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Property.countDocuments(filter),
    ]);

    res.json({
      properties,
      ...paginationMeta(total, page, limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch properties.", error: err.message });
  }
});

// GET /api/properties/admin/:id — admin fetch by Mongo id (for edit form)
router.get("/admin/:id", requireAdmin, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found." });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch property.", error: err.message });
  }
});

// GET /api/properties/:slug/brochure — proxy PDF download (avoids Cloudinary 400 / CORS)
router.get("/:slug/brochure", async (req, res) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug }).select(
      "title brochureUrl brochurePublicId"
    );
    if (!property) return res.status(404).json({ message: "Property not found." });
    if (!property.brochureUrl && !property.brochurePublicId) {
      return res.status(404).json({ message: "No brochure for this property." });
    }

    const candidates = brochureFetchCandidates(property.brochureUrl, property.brochurePublicId);
    const { buffer, contentType } = await fetchBrochureBuffer(candidates);

    const safeName = `${String(property.title || "brochure")
      .replace(/[^\w\-]+/g, "_")
      .slice(0, 40)}.pdf`;

    res.setHeader("Content-Type", contentType.includes("pdf") ? "application/pdf" : contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${safeName}"`);
    res.setHeader("Cache-Control", "private, max-age=300");
    return res.send(buffer);
  } catch (err) {
    console.error("Brochure download error:", err.message);
    return res.status(502).json({
      message:
        "Could not download brochure. Re-upload the PDF in Admin (stored as raw) and try again.",
      error: err.message,
    });
  }
});

// GET /api/properties/:slug — public detail, also increments view count
router.get("/:slug", async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!property) return res.status(404).json({ message: "Property not found." });

    // Prefer same property type; fill with same-city if fewer than 3
    let related = await Property.find({
      _id: { $ne: property._id },
      propertyType: property.propertyType,
    })
      .limit(3)
      .select("title slug coverImage price location specs status propertyType");

    if (related.length < 3) {
      const extra = await Property.find({
        _id: { $nin: [property._id, ...related.map((r) => r._id)] },
        "location.city": property.location.city,
      })
        .limit(3 - related.length)
        .select("title slug coverImage price location specs status propertyType");
      related = [...related, ...extra];
    }

    res.json({ property, related });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch property.", error: err.message });
  }
});

function normalizeYoutubeUrl(url) {
  if (!url || typeof url !== "string") return "";
  return url.trim();
}

function collectPublicIds(images = [], providedIds = []) {
  const ids = [...(providedIds || []).filter(Boolean)];
  images.forEach((url) => {
    const id = extractPublicIdFromUrl(url);
    if (id && !ids.includes(id)) ids.push(id);
  });
  return ids;
}

// POST /api/properties — admin only
router.post("/", requireAdmin, async (req, res) => {
  try {
    const body = { ...req.body, createdBy: req.admin.id };
    body.youtubeUrl = normalizeYoutubeUrl(body.youtubeUrl);
    const images = body.images || [];
    body.imagePublicIds = collectPublicIds(images, body.imagePublicIds);
    if (!body.coverImage && images[0]) body.coverImage = images[0];

    const property = await Property.create(body);
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ message: "Could not create property.", error: err.message });
  }
});

// PUT /api/properties/:id — admin only
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const existing = await Property.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Property not found." });

    const body = { ...req.body };
    if (body.youtubeUrl !== undefined) {
      body.youtubeUrl = normalizeYoutubeUrl(body.youtubeUrl);
    }

    const nextImages = body.images || existing.images || [];
    if (body.images) {
      body.imagePublicIds = collectPublicIds(nextImages, body.imagePublicIds);
      const prevIds = new Set([
        ...(existing.imagePublicIds || []),
        ...((existing.images || []).map(extractPublicIdFromUrl).filter(Boolean)),
      ]);
      const nextIds = new Set(body.imagePublicIds);
      const removed = [...prevIds].filter((id) => !nextIds.has(id));
      await Promise.all(removed.map((id) => destroyByPublicId(id)));
    }

    if (body.images?.length && !body.coverImage) {
      body.coverImage = body.images[0];
    }

    // Replace brochure → delete previous Cloudinary PDF
    if (
      body.brochurePublicId !== undefined &&
      existing.brochurePublicId &&
      body.brochurePublicId !== existing.brochurePublicId
    ) {
      await destroyByPublicId(existing.brochurePublicId, "raw");
      await destroyByPublicId(existing.brochurePublicId, "image");
    }
    if (body.brochureUrl === "" && existing.brochurePublicId) {
      await destroyByPublicId(existing.brochurePublicId, "raw");
      await destroyByPublicId(existing.brochurePublicId, "image");
      body.brochurePublicId = "";
    }

    const property = await Property.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: "Could not update property.", error: err.message });
  }
});

// DELETE /api/properties/:id — admin only (also removes Cloudinary images)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found." });

    await destroyPropertyImages(property);
    await property.deleteOne();

    res.json({ message: "Property deleted." });
  } catch (err) {
    res.status(500).json({ message: "Could not delete property.", error: err.message });
  }
});

module.exports = router;
