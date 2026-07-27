/** Canonical listing types used across filters, forms, and schema. */
const PROPERTY_TYPES = [
  "Residential Plot",
  "Commercial Land",
  "Commercial Office",
  "Commercial Shop",
  "Land Parcel",
  "Residential Flat",
  "Residential Bungalow",
];

/** Older values kept so existing Mongo documents still validate. */
const LEGACY_PROPERTY_TYPES = [
  "Residential",
  "Commercial Shop & Offices",
  "Apartment",
  "Villa",
  "Bungalow",
  "Plot",
  "Commercial",
  "Penthouse",
];

const ALL_PROPERTY_TYPES = [...PROPERTY_TYPES, ...LEGACY_PROPERTY_TYPES];

/** Map old type names → current canonical type when editing/saving. */
const PROPERTY_TYPE_ALIASES = {
  Residential: "Residential Plot",
  "Commercial Shop & Offices": "Commercial Office",
  Plot: "Residential Plot",
  Apartment: "Residential Flat",
  Villa: "Residential Bungalow",
  Bungalow: "Residential Bungalow",
  Commercial: "Commercial Office",
  Penthouse: "Residential Flat",
};

function normalizePropertyType(type) {
  if (!type) return "Land Parcel";
  if (PROPERTY_TYPES.includes(type)) return type;
  if (PROPERTY_TYPE_ALIASES[type]) return PROPERTY_TYPE_ALIASES[type];
  return type;
}

module.exports = {
  PROPERTY_TYPES,
  LEGACY_PROPERTY_TYPES,
  ALL_PROPERTY_TYPES,
  PROPERTY_TYPE_ALIASES,
  normalizePropertyType,
};
