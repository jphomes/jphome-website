const express = require("express");
const Property = require("../models/Property");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

// GET /api/properties  — public list with filters + pagination
// query: page, limit, city, propertyType, status, minPrice, maxPrice, minArea, maxArea, bedrooms, q, featured, rera
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
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

    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
      Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Property.countDocuments(filter),
    ]);

    res.json({
      properties,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch properties.", error: err.message });
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

    // A few related listings in the same city, excluding itself
    const related = await Property.find({
      _id: { $ne: property._id },
      "location.city": property.location.city,
    })
      .limit(3)
      .select("title slug coverImage price location specs status");

    res.json({ property, related });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch property.", error: err.message });
  }
});

// POST /api/properties — admin only
router.post("/", requireAdmin, async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, createdBy: req.admin.id });
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ message: "Could not create property.", error: err.message });
  }
});

// PUT /api/properties/:id — admin only
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!property) return res.status(404).json({ message: "Property not found." });
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: "Could not update property.", error: err.message });
  }
});

// DELETE /api/properties/:id — admin only
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found." });
    res.json({ message: "Property deleted." });
  } catch (err) {
    res.status(500).json({ message: "Could not delete property.", error: err.message });
  }
});

module.exports = router;
