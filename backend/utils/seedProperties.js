require("dotenv").config();
const mongoose = require("mongoose");
const Property = require("../models/Property");

const DEMO_PROPERTIES = [
  {
    title: "Skyline Penthouse — Indiranagar",
    description:
      "A light-filled penthouse with floor-to-ceiling glass, private terrace, and uninterrupted city views. Finished in warm oak and brass accents.",
    price: 42500000,
    status: "For Sale",
    propertyType: "Penthouse",
    location: { city: "Bengaluru", area: "Indiranagar", address: "12th Main, HAL 2nd Stage" },
    specs: { sqft: 3200, bedrooms: 4, bathrooms: 4, parking: 2, floors: 18, yearBuilt: 2021 },
    amenities: ["Private Terrace", "Concierge", "Gym", "Smart Home"],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    featured: true,
  },
  {
    title: "Garden Villa — Whitefield",
    description:
      "Standalone villa on a quiet cul-de-sac with landscaped gardens, double-height living, and a sunlit study overlooking the pool.",
    price: 28500000,
    status: "For Sale",
    propertyType: "Villa",
    location: { city: "Bengaluru", area: "Whitefield", address: "Palm Meadows Road" },
    specs: { sqft: 4100, bedrooms: 5, bathrooms: 5, parking: 3, floors: 2, yearBuilt: 2019 },
    amenities: ["Swimming Pool", "Garden", "Home Office", "Servant Quarter"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop",
    featured: true,
  },
  {
    title: "Brass & Stone Apartment — Koramangala",
    description:
      "Thoughtfully renovated 3BHK with open kitchen, brass fixtures, and a balcony that catches the evening light.",
    price: 18500000,
    status: "For Sale",
    propertyType: "Apartment",
    location: { city: "Bengaluru", area: "Koramangala", address: "5th Block, 80 Feet Road" },
    specs: { sqft: 1850, bedrooms: 3, bathrooms: 3, parking: 1, floors: 9, yearBuilt: 2017 },
    amenities: ["Balcony", "Modular Kitchen", "Clubhouse", "24/7 Security"],
    images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=1200&auto=format&fit=crop",
    featured: true,
  },
  {
    title: "Heritage Bungalow — Richmond Town",
    description:
      "A restored colonial bungalow blending original teak beams with contemporary interiors. Quiet street, walkable to cafes.",
    price: 52000000,
    status: "For Sale",
    propertyType: "Bungalow",
    location: { city: "Bengaluru", area: "Richmond Town", address: "Cleveland Road" },
    specs: { sqft: 4800, bedrooms: 4, bathrooms: 4, parking: 2, floors: 2, yearBuilt: 1948 },
    amenities: ["Heritage Features", "Courtyard", "Wine Cellar", "Staff Quarters"],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop",
    featured: false,
  },
  {
    title: "Lakeview Residence — Hebbal",
    description:
      "Spacious 4BHK facing the lake with wraparound windows, Italian marble flooring, and a dedicated entertainment lounge.",
    price: 31000000,
    status: "For Sale",
    propertyType: "Apartment",
    location: { city: "Bengaluru", area: "Hebbal", address: "Bellary Road" },
    specs: { sqft: 2650, bedrooms: 4, bathrooms: 4, parking: 2, floors: 14, yearBuilt: 2020 },
    amenities: ["Lake View", "Infinity Pool", "Spa", "Kids Play Area"],
    images: [
      "https://images.unsplash.com/photo-1605276374101-de4c0a9a472b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1200&auto=format&fit=crop",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1605276374101-de4c0a9a472b?q=80&w=1200&auto=format&fit=crop",
    featured: false,
  },
  {
    title: "Studio Loft — HSR Layout",
    description:
      "Compact loft-style studio ideal for young professionals. High ceilings, exposed brick, and a rooftop common terrace.",
    price: 85000,
    status: "For Rent",
    propertyType: "Apartment",
    location: { city: "Bengaluru", area: "HSR Layout", address: "27th Main, Sector 2" },
    specs: { sqft: 720, bedrooms: 1, bathrooms: 1, parking: 1, floors: 5, yearBuilt: 2022 },
    amenities: ["Rooftop Terrace", "Co-working Lounge", "Power Backup"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop",
    ],
    coverImage:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
    featured: false,
  },
];

(async () => {
  try {
    const { resolveMongoUri } = require("./mongoUri");
    const mongo = resolveMongoUri();
    await mongoose.connect(mongo.uri);

    const existing = await Property.countDocuments();
    if (existing > 0) {
      console.log(`Database already has ${existing} properties. Skipping seed.`);
      process.exit(0);
    }

    await Property.insertMany(DEMO_PROPERTIES);
    console.log(`✅ Seeded ${DEMO_PROPERTIES.length} demo properties.`);
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed properties:", err.message);
    process.exit(1);
  }
})();
