const express = require("express");
const rateLimit = require("express-rate-limit");
const Enquiry = require("../models/Enquiry");
const Property = require("../models/Property");
const requireAdmin = require("../middleware/auth");
const { parsePagination, paginationMeta } = require("../utils/pagination");

const ENQUIRY_STATUSES = Enquiry.ENQUIRY_STATUSES;
const router = express.Router();

const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { message: "Too many enquiries submitted. Please try again later." },
});

/** Map legacy statuses from older installs onto the new set. */
function normalizeStatus(status) {
  if (status === "Contacted") return "Pending";
  if (status === "Closed") return "Resolved";
  if (ENQUIRY_STATUSES.includes(status)) return status;
  return "New";
}

async function migrateLegacyStatuses() {
  await Enquiry.updateMany({ status: "Contacted" }, { $set: { status: "Pending" } });
  await Enquiry.updateMany({ status: "Closed" }, { $set: { status: "Resolved" } });
}

// POST /api/enquiry — public (saves to DB as status: New)
router.post("/", enquiryLimiter, async (req, res) => {
  try {
    const { name, email, phone, message, propertyId } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required." });
    }

    const phoneDigits = String(phone || "").replace(/\D/g, "");
    if (!/^\d{10}$/.test(phoneDigits)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits." });
    }

    let propertyTitle = null;
    let source = "Contact Page";
    if (propertyId) {
      const property = await Property.findById(propertyId).select("title");
      if (property) {
        propertyTitle = property.title;
        source = "Property Enquiry";
      }
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone: phoneDigits,
      message,
      property: propertyId || undefined,
      propertyTitle,
      source,
      status: "New",
    });

    res.status(201).json({
      message: "Enquiry submitted successfully.",
      id: enquiry._id,
      status: enquiry.status,
    });
  } catch (err) {
    res.status(500).json({ message: "Could not submit enquiry.", error: err.message });
  }
});

// GET /api/enquiry — admin only, paginated (newest first)
// query: status=New|Pending|Resolved|all (default all), page, limit
router.get("/", requireAdmin, async (req, res) => {
  try {
    await migrateLegacyStatuses();

    const filter = {};
    const status = req.query.status;
    if (status && status !== "all") {
      filter.status = normalizeStatus(status);
    }

    const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 10, maxLimit: 50 });

    const [enquiries, filteredTotal, newCount, pendingCount, resolvedCount, allCount] =
      await Promise.all([
        Enquiry.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("property", "title slug"),
        Enquiry.countDocuments(filter),
        Enquiry.countDocuments({ status: "New" }),
        Enquiry.countDocuments({ status: "Pending" }),
        Enquiry.countDocuments({ status: "Resolved" }),
        Enquiry.countDocuments(),
      ]);

    res.json({
      enquiries,
      counts: { New: newCount, Pending: pendingCount, Resolved: resolvedCount, all: allCount },
      ...paginationMeta(filteredTotal, page, limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch enquiries.", error: err.message });
  }
});

// POST /api/enquiry/:id/read — mark New → Pending when admin opens it
router.post("/:id/read", requireAdmin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found." });

    if (enquiry.status === "New") {
      enquiry.status = "Pending";
      enquiry.readAt = new Date();
      await enquiry.save();
    }

    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ message: "Could not mark enquiry as read.", error: err.message });
  }
});

// PUT /api/enquiry/:id — update status (New / Pending / Resolved)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const nextStatus = normalizeStatus(req.body.status);
    if (!ENQUIRY_STATUSES.includes(nextStatus)) {
      return res.status(400).json({ message: "Invalid status. Use New, Pending, or Resolved." });
    }

    const update = { status: nextStatus };
    if (nextStatus === "Pending" && !req.body.keepReadAt) {
      update.readAt = new Date();
    }
    if (nextStatus === "Resolved") {
      update.resolvedAt = new Date();
    }
    if (nextStatus === "New") {
      update.readAt = null;
      update.resolvedAt = null;
    }

    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found." });
    res.json(enquiry);
  } catch (err) {
    res.status(400).json({ message: "Could not update enquiry.", error: err.message });
  }
});

module.exports = router;
