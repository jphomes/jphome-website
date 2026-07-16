/** Canonical listing types used across filters, forms, and schema. */
const PROPERTY_TYPES = [
  "Residential",
  "Commercial Land",
  "Commercial Shop & Offices",
  "Land Parcel",
  "Residential Flat",
  "Residential Bungalow",
];

/** Older values kept so existing Mongo documents still validate. */
const LEGACY_PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Bungalow",
  "Plot",
  "Commercial",
  "Penthouse",
];

const ALL_PROPERTY_TYPES = [...PROPERTY_TYPES, ...LEGACY_PROPERTY_TYPES];

module.exports = {
  PROPERTY_TYPES,
  LEGACY_PROPERTY_TYPES,
  ALL_PROPERTY_TYPES,
};
