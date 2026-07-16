/** Ensure display strings start with the Indian rupee sign. */
export function withRupee(value) {
  if (value == null || value === "") return "";
  const text = String(value).trim();
  if (!text) return "";
  if (text.includes("₹")) return text;
  // Normalise Rs / INR prefixes to ₹
  const stripped = text.replace(/^(rs\.?|inr)\s*/i, "");
  return `₹${stripped}`;
}

export function formatPrice(property) {
  if (!property) return "";
  if (property.priceLabel) return withRupee(property.priceLabel);

  const p = Number(property.price);
  if (!Number.isFinite(p) || p <= 0) return "Price on request";

  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  if (p >= 100000) return `₹${(p / 100000).toFixed(1)} L`;
  return `₹${p.toLocaleString("en-IN")}`;
}

export function formatLocation(location) {
  if (!location) return "";
  const parts = [location.area, location.city].filter(Boolean);
  return parts.join(", ");
}

export function formatSpecs(specs) {
  if (!specs) return "";
  const parts = [];
  if (specs.sqft) parts.push(`${specs.sqft.toLocaleString("en-IN")} sq.ft`);
  if (specs.bedrooms) parts.push(`${specs.bedrooms} Bed`);
  if (specs.bathrooms) parts.push(`${specs.bathrooms} Bath`);
  if (specs.parking) parts.push(`${specs.parking} Parking`);
  return parts.join(" · ");
}

export function truncateText(text, max = 160) {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function getPropertyUrl(slug) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/properties/${slug}`;
  }
  return `/properties/${slug}`;
}
