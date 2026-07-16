require("dotenv").config();
const mongoose = require("mongoose");
const Property = require("../models/Property");

const JP_PROJECTS = [
  {
    title: "Maruti 7 Wonder City",
    description: "India's first Seven Wonders themed gated township spanning 60 acres in Sankra, Greater Raipur. Premium residential plots with world-class amenities and clear RERA documentation.",
    price: 2500000,
    priceLabel: "₹25 L* Onwards",
    status: "For Sale",
    propertyType: "Plot",
    location: { city: "Raipur", area: "Sankra (Amleshwar)", address: "Greater Raipur" },
    specs: { sqft: 800, bedrooms: 0, bathrooms: 0, parking: 0 },
    amenities: ["7 Wonders Theme", "Gated Township", "60 Acres", "Bank Loan Ready"],
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"],
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    reraApproved: true,
    reraNumber: "PCGRERA230922001524",
    featured: true,
  },
  {
    title: "Godrej Raipur Plots",
    description: "Pre-launch residential plots on Old Dhamtari Road, Raipur. ~750 plots ranging 1,200–2,000 sq.ft with EOI now open.",
    price: 6000000,
    priceLabel: "₹60 L* Onwards",
    status: "For Sale",
    propertyType: "Plot",
    location: { city: "Raipur", area: "Old Dhamtari Road", address: "Raipur" },
    specs: { sqft: 1200, bedrooms: 0, bathrooms: 0, parking: 0 },
    amenities: ["Pre-Launch", "EOI Open", "Premium Location"],
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop"],
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    reraApproved: false,
    featured: true,
  },
  {
    title: "Avinash Ecocity",
    description: "Eco-friendly residential plots in Sejbahar, Raipur. 319 plots across 18 acres with sizes from 600–1,800 sq.ft.",
    price: 1800000,
    priceLabel: "₹18 L* Onwards",
    status: "For Sale",
    propertyType: "Plot",
    location: { city: "Raipur", area: "Sejbahar", address: "Raipur" },
    specs: { sqft: 600, bedrooms: 0, bathrooms: 0, parking: 0 },
    amenities: ["Eco-Friendly", "18 Acres", "Gated Community"],
    images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop"],
    coverImage: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop",
    reraApproved: true,
    reraNumber: "PCGRERA-ECOCITY",
    featured: true,
  },
  {
    title: "Wallfort Greens",
    description: "Affordable residential plots starting at ₹6.75 lakhs in Amleshwar. Plot sizes 600–2,400 sq.ft with T&CP approval.",
    price: 675000,
    status: "For Sale",
    propertyType: "Plot",
    location: { city: "Raipur", area: "Amleshwar", address: "Mahadev Ghat Road" },
    specs: { sqft: 600, bedrooms: 0, bathrooms: 0, parking: 0 },
    amenities: ["Affordable", "T&CP Approved", "Clear Title"],
    images: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop"],
    coverImage: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
    reraApproved: true,
    featured: true,
  },
  {
    title: "New Aadarsh Vihar",
    description: "Residential plots in the Naya Raipur corridor near Ganod. Close to New Vidhan Sabha and Mantralay Road.",
    price: 1500000,
    status: "For Sale",
    propertyType: "Plot",
    location: { city: "Raipur", area: "Naya Raipur", address: "Ganod Corridor" },
    specs: { sqft: 1000, bedrooms: 0, bathrooms: 0, parking: 0 },
    amenities: ["Naya Raipur", "Growth Corridor", "Site Visit Available"],
    images: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop"],
    coverImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop",
    reraApproved: true,
    featured: false,
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await Property.countDocuments();
    if (count > 0) {
      console.log(`Database has ${count} properties. Run with FORCE_SEED=1 to replace.`);
      if (process.env.FORCE_SEED !== "1") process.exit(0);
      await Property.deleteMany({});
    }
    await Property.insertMany(JP_PROJECTS);
    console.log(`✅ Seeded ${JP_PROJECTS.length} JP Group projects.`);
    process.exit(0);
  } catch (err) {
    console.error("Failed:", err.message);
    process.exit(1);
  }
})();
