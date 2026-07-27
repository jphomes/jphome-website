/** Canonical listing types for filters & admin forms. */
export const PROPERTY_TYPES = [
  "Residential Plot",
  "Commercial Land",
  "Commercial Office",
  "Commercial Shop",
  "Land Parcel",
  "Residential Flat",
  "Residential Bungalow",
];

export const LEGACY_PROPERTY_TYPES = [
  "Residential",
  "Commercial Shop & Offices",
  "Apartment",
  "Villa",
  "Bungalow",
  "Plot",
  "Commercial",
  "Penthouse",
];

export const PROPERTY_TYPE_ALIASES = {
  Residential: "Residential Plot",
  "Commercial Shop & Offices": "Commercial Office",
  Plot: "Residential Plot",
  Apartment: "Residential Flat",
  Villa: "Residential Bungalow",
  Bungalow: "Residential Bungalow",
  Commercial: "Commercial Office",
  Penthouse: "Residential Flat",
};

export function normalizePropertyType(type) {
  if (!type) return "Land Parcel";
  if (PROPERTY_TYPES.includes(type)) return type;
  if (PROPERTY_TYPE_ALIASES[type]) return PROPERTY_TYPE_ALIASES[type];
  return type;
}

export const FACING_OPTIONS = [
  "North",
  "South",
  "East",
  "West",
  "Northeast",
  "Northwest",
  "Southeast",
  "Southwest",
];

export const YES_NO_OPTIONS = ["Yes", "No"];
export const OPEN_SIDES_OPTIONS = ["1", "2", "3+"];
export const POSSESSION_OPTIONS = ["Ready to Move", "Under Construction"];
export const FURNISHED_OPTIONS = ["Fully Furnished", "Semi Furnished", "Unfurnished"];

/**
 * Field definitions per property type.
 * key → stored on specs[key]
 * kind: number | text | select
 */
export const SPECS_BY_TYPE = {
  "Residential Plot": [
    { key: "sqft", label: "Size (sq ft)", kind: "number" },
    { key: "front", label: "Front (ft)", kind: "number" },
    { key: "depth", label: "Depth (ft)", kind: "number" },
    { key: "facing", label: "Facing", kind: "select", options: FACING_OPTIONS },
    { key: "roadWidth", label: "Width of facing road (ft)", kind: "number" },
    { key: "cornerProperty", label: "Corner property", kind: "select", options: YES_NO_OPTIONS },
    { key: "openSides", label: "No. of open sides", kind: "select", options: OPEN_SIDES_OPTIONS },
  ],
  "Commercial Land": [
    { key: "sqft", label: "Size (sq ft)", kind: "number" },
    { key: "front", label: "Front (ft)", kind: "number" },
    { key: "depth", label: "Depth (ft)", kind: "number" },
    { key: "facing", label: "Facing", kind: "select", options: FACING_OPTIONS },
    { key: "roadWidth", label: "Width of facing road (ft)", kind: "number" },
    { key: "cornerProperty", label: "Corner property", kind: "select", options: YES_NO_OPTIONS },
    { key: "openSides", label: "No. of open sides", kind: "select", options: OPEN_SIDES_OPTIONS },
    { key: "preleased", label: "Preleased / Prerented", kind: "select", options: YES_NO_OPTIONS },
  ],
  "Commercial Office": [
    { key: "sqft", label: "Size (sq ft)", kind: "number" },
    { key: "carpetArea", label: "Carpet area (sq ft)", kind: "number" },
    { key: "builtUpArea", label: "Built-up area (sq ft)", kind: "number" },
    { key: "possessionStatus", label: "Possession status", kind: "select", options: POSSESSION_OPTIONS },
    { key: "floorAvailable", label: "Floor available", kind: "text" },
    { key: "facing", label: "Facing", kind: "select", options: FACING_OPTIONS },
    { key: "preleased", label: "Preleased / Prerented", kind: "select", options: YES_NO_OPTIONS },
    { key: "totalFloors", label: "Total floors", kind: "number", group: "Floors details" },
    { key: "yourFloor", label: "Your floor", kind: "number", group: "Floors details" },
  ],
  "Commercial Shop": [
    { key: "sqft", label: "Size (sq ft)", kind: "number" },
    { key: "carpetArea", label: "Carpet area (sq ft)", kind: "number" },
    { key: "builtUpArea", label: "Built-up area (sq ft)", kind: "number" },
    { key: "possessionStatus", label: "Possession status", kind: "select", options: POSSESSION_OPTIONS },
    { key: "floorAvailable", label: "Floor available", kind: "text" },
    { key: "facing", label: "Facing", kind: "select", options: FACING_OPTIONS },
    { key: "preleased", label: "Preleased / Prerented", kind: "select", options: YES_NO_OPTIONS },
    { key: "noOfFloors", label: "No. of floors", kind: "number" },
  ],
  "Land Parcel": [
    { key: "acres", label: "Size (acres)", kind: "number" },
    { key: "landUse", label: "Land use", kind: "text" },
    { key: "fencing", label: "Fencing", kind: "select", options: YES_NO_OPTIONS },
    { key: "roadWidth", label: "Width of facing road (ft)", kind: "number" },
  ],
  "Residential Flat": [
    { key: "sqft", label: "Size (sq ft)", kind: "number" },
    { key: "carpetArea", label: "Carpet area (sq ft)", kind: "number" },
    { key: "builtUpArea", label: "Built-up area (sq ft)", kind: "number" },
    { key: "bedrooms", label: "No. of BHK", kind: "number" },
    { key: "possessionStatus", label: "Possession status", kind: "select", options: POSSESSION_OPTIONS },
    { key: "furnishedType", label: "Furnished type", kind: "select", options: FURNISHED_OPTIONS },
    { key: "facing", label: "Facing", kind: "select", options: FACING_OPTIONS },
    { key: "totalFloors", label: "Total floors", kind: "number", group: "Floors details" },
    { key: "yourFloor", label: "Your floor", kind: "number", group: "Floors details" },
    { key: "servantRoom", label: "Servant room", kind: "select", options: YES_NO_OPTIONS },
  ],
  "Residential Bungalow": [
    { key: "plotSize", label: "Plot size (sq ft)", kind: "number" },
    { key: "constructionArea", label: "Construction area (sq ft)", kind: "number" },
    { key: "totalFloors", label: "Total no. of floors", kind: "number" },
    { key: "bedrooms", label: "No. of BHK", kind: "number" },
    { key: "facing", label: "Facing", kind: "select", options: FACING_OPTIONS },
    { key: "possessionStatus", label: "Possession status", kind: "select", options: POSSESSION_OPTIONS },
    { key: "furnishedType", label: "Furnished type", kind: "select", options: FURNISHED_OPTIONS },
    { key: "roadWidth", label: "Width of facing road (ft)", kind: "number" },
    { key: "servantRoom", label: "Servant room", kind: "select", options: YES_NO_OPTIONS },
  ],
};

export function getSpecFieldsForType(propertyType) {
  const type = normalizePropertyType(propertyType);
  return SPECS_BY_TYPE[type] || SPECS_BY_TYPE["Land Parcel"];
}

/** Empty specs object for forms. */
export function emptySpecsValues() {
  return {
    sqft: "",
    acres: "",
    plotSize: "",
    constructionArea: "",
    carpetArea: "",
    builtUpArea: "",
    front: "",
    depth: "",
    facing: "",
    roadWidth: "",
    cornerProperty: "",
    openSides: "",
    preleased: "",
    possessionStatus: "",
    floorAvailable: "",
    totalFloors: "",
    yourFloor: "",
    noOfFloors: "",
    landUse: "",
    fencing: "",
    bedrooms: "",
    furnishedType: "",
    servantRoom: "",
    bathrooms: "",
    parking: "",
  };
}

export function specsFromProperty(specs = {}) {
  const base = emptySpecsValues();
  Object.keys(base).forEach((key) => {
    if (specs[key] !== undefined && specs[key] !== null && specs[key] !== "") {
      base[key] = String(specs[key]);
    }
  });
  return base;
}

/**
 * Build Mongo-ready specs: only include filled fields; coerce numbers.
 */
export function buildSpecsPayload(propertyType, values = {}) {
  const fields = getSpecFieldsForType(propertyType);
  const out = {};

  fields.forEach(({ key, kind }) => {
    const raw = values[key];
    if (raw === undefined || raw === null || String(raw).trim() === "") return;

    if (kind === "number") {
      const n = Number(raw);
      if (Number.isFinite(n)) out[key] = n;
      return;
    }
    out[key] = String(raw).trim();
  });

  // Keep sqft populated for cards/filters when plot/construction size is used
  if (out.sqft == null && out.plotSize != null) out.sqft = out.plotSize;
  if (out.sqft == null && out.constructionArea != null) out.sqft = out.constructionArea;
  if (out.sqft == null && out.acres != null) {
    // Approximate for list filters (1 acre ≈ 43560 sq ft)
    out.sqft = Math.round(Number(out.acres) * 43560);
  }
  if (out.sqft == null) out.sqft = 0;

  return out;
}

function formatNumber(n) {
  if (n == null || n === "") return "";
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return num.toLocaleString("en-IN");
}

/** Rows for property detail UI — skips empty / zero-noise values. */
export function getFilledSpecRows(propertyType, specs = {}) {
  const fields = getSpecFieldsForType(propertyType);
  return fields
    .map((field) => {
      const raw = specs[field.key];
      if (raw === undefined || raw === null || raw === "") return null;
      if (typeof raw === "number" && raw === 0 && field.key !== "yourFloor") return null;

      let value;
      if (field.kind === "number") {
        value = formatNumber(raw);
        if (field.key === "sqft" || field.key === "carpetArea" || field.key === "builtUpArea"
          || field.key === "plotSize" || field.key === "constructionArea") {
          value = `${value} sq ft`;
        } else if (field.key === "acres") {
          value = `${value} acres`;
        } else if (field.key === "front" || field.key === "depth" || field.key === "roadWidth") {
          value = `${value} ft`;
        } else if (field.key === "bedrooms") {
          value = `${value} BHK`;
        }
      } else {
        value = String(raw);
      }

      return {
        key: field.key,
        label: field.label,
        value,
        group: field.group || null,
      };
    })
    .filter(Boolean);
}

/** Short line for cards / WhatsApp. */
export function formatSpecsSummary(propertyType, specs = {}) {
  if (!specs) return "";
  const type = normalizePropertyType(propertyType);
  const parts = [];

  if (type === "Land Parcel" && specs.acres) {
    parts.push(`${formatNumber(specs.acres)} acres`);
  } else if (specs.sqft) {
    parts.push(`${formatNumber(specs.sqft)} sq ft`);
  } else if (specs.plotSize) {
    parts.push(`${formatNumber(specs.plotSize)} sq ft plot`);
  }

  if (specs.bedrooms) parts.push(`${specs.bedrooms} BHK`);
  if (specs.facing) parts.push(`${specs.facing} facing`);
  if (specs.possessionStatus) parts.push(specs.possessionStatus);

  return parts.join(" · ");
}
