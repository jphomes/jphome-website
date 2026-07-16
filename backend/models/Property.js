const mongoose = require("mongoose");
const slugify = require("slugify");

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    priceLabel: { type: String }, // e.g. "On Request" overrides numeric display if set
    status: {
      type: String,
      enum: ["For Sale", "For Rent", "Sold", "Rented"],
      default: "For Sale",
    },
    propertyType: {
      type: String,
      enum: ["Apartment", "Villa", "Bungalow", "Plot", "Commercial", "Penthouse"],
      default: "Apartment",
    },
    location: {
      city: { type: String, required: true },
      area: { type: String, required: true },
      address: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
    specs: {
      sqft: { type: Number, required: true },
      bedrooms: { type: Number, default: 0 },
      bathrooms: { type: Number, default: 0 },
      parking: { type: Number, default: 0 },
      floors: { type: Number },
      yearBuilt: { type: Number },
    },
    amenities: [{ type: String }],
    images: [{ type: String, required: true }], // URLs or /uploads/ paths
    coverImage: { type: String, required: true },
    reraApproved: { type: Boolean, default: false },
    reraNumber: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

PropertySchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(`${this.title}-${Date.now().toString().slice(-5)}`, {
      lower: true,
      strict: true,
    });
  }
  next();
});

PropertySchema.index({ title: "text", "location.city": "text", "location.area": "text" });

module.exports = mongoose.model("Property", PropertySchema);
