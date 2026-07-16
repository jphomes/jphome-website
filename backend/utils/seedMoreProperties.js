require("dotenv").config();
const mongoose = require("mongoose");
const Property = require("../models/Property");

const EXTRA_PROPERTIES = [
  {
    title: "Courtyard Home — Jayanagar",
    description:
      "A rare Jayanagar residence with an internal courtyard, teak flooring, and a kitchen designed for people who actually cook.",
    price: 22000000,
    status: "For Sale",
    propertyType: "Bungalow",
    location: { city: "Bengaluru", area: "Jayanagar", address: "4th Block, 11th Main" },
    specs: { sqft: 2900, bedrooms: 4, bathrooms: 3, parking: 2, floors: 2, yearBuilt: 2015 },
    amenities: ["Courtyard", "Modular Kitchen", "Solar Water"],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop",
    featured: true,
  },
  {
    title: "Park-Facing 3BHK — Sarjapur Road",
    description:
      "East-facing living room overlooking a neighbourhood park. Quiet society with strong resale in the school belt.",
    price: 15800000,
    status: "For Sale",
    propertyType: "Apartment",
    location: { city: "Bengaluru", area: "Sarjapur Road", address: "Doddakannelli" },
    specs: { sqft: 1650, bedrooms: 3, bathrooms: 3, parking: 1, floors: 12, yearBuilt: 2018 },
    amenities: ["Park View", "Clubhouse", "Visitor Parking"],
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
    featured: false,
  },
  {
    title: "Corner Plot Villa — Electronic City",
    description:
      "Corner plot villa with dual-side setbacks, ample natural light, and scope for a rooftop garden.",
    price: 19500000,
    status: "For Sale",
    propertyType: "Villa",
    location: { city: "Bengaluru", area: "Electronic City", address: "Phase 1, Neeladri Road" },
    specs: { sqft: 2400, bedrooms: 4, bathrooms: 4, parking: 2, floors: 2, yearBuilt: 2020 },
    amenities: ["Corner Plot", "Rooftop Access", "Gated Community"],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop",
    featured: false,
  },
];

(async () => {
  try {
    const { resolveMongoUri } = require("./mongoUri");
    const mongo = resolveMongoUri();
    await mongoose.connect(mongo.uri);

    const count = await Property.countDocuments();
    if (count >= 9) {
      console.log(`Database already has ${count} properties. No extra seed needed.`);
      process.exit(0);
    }

    const toInsert = EXTRA_PROPERTIES.slice(0, 9 - count);
    await Property.insertMany(toInsert);
    console.log(`✅ Added ${toInsert.length} more demo properties (total now ~${count + toInsert.length}).`);
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed extra properties:", err.message);
    process.exit(1);
  }
})();
