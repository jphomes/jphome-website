const mongoose = require("mongoose");

const ENQUIRY_STATUSES = ["New", "Pending", "Resolved"];

const EnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    propertyTitle: { type: String },
    source: { type: String, default: "General Enquiry" },
    // New = unread · Pending = opened / in progress · Resolved = done
    status: { type: String, enum: ENQUIRY_STATUSES, default: "New" },
    readAt: { type: Date },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

const Enquiry = mongoose.model("Enquiry", EnquirySchema);
Enquiry.ENQUIRY_STATUSES = ENQUIRY_STATUSES;

module.exports = Enquiry;
