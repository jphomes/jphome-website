const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    propertyTitle: { type: String }, // snapshot, in case property is later deleted
    source: { type: String, default: "General Enquiry" }, // "Property Enquiry" | "Contact Page" etc.
    status: { type: String, enum: ["New", "Contacted", "Closed"], default: "New" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", EnquirySchema);
