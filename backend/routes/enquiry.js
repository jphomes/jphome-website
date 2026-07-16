const express = require("express");
const rateLimit = require("express-rate-limit");
const Enquiry = require("../models/Enquiry");
const Property = require("../models/Property");
const requireAdmin = require("../middleware/auth");
const { sendEnquiryMails } = require("../utils/mailer");

const router = express.Router();

const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { message: "Too many enquiries submitted. Please try again later." },
});

// POST /api/enquiry — public. Used by the general contact form AND the
// "Enquire about this property" form (pass propertyId to link it).
router.post("/", enquiryLimiter, async (req, res) => {
  try {
    const { name, email, phone, message, propertyId } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required." });
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
      phone,
      message,
      property: propertyId || undefined,
      propertyTitle,
      source,
    });

    // Don't block the response on email deliverability issues.
    sendEnquiryMails(enquiry).catch((err) =>
      console.error("Enquiry email failed to send:", err.message)
    );

    res.status(201).json({ message: "Enquiry submitted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Could not submit enquiry.", error: err.message });
  }
});

// GET /api/enquiry — admin only, view all enquiries
router.get("/", requireAdmin, async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 }).populate("property", "title slug");
  res.json(enquiries);
});

// PUT /api/enquiry/:id — admin only, update status (New / Contacted / Closed)
router.put("/:id", requireAdmin, async (req, res) => {
  const enquiry = await Enquiry.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!enquiry) return res.status(404).json({ message: "Enquiry not found." });
  res.json(enquiry);
});

module.exports = router;
