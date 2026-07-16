import {
  formatPrice,
  formatLocation,
  formatSpecs,
  truncateText,
  getPropertyUrl,
} from "./property.js";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "9191787187138";

export function getWhatsAppNumber() {
  return WHATSAPP_NUMBER.replace(/\D/g, "");
}

export function buildPropertyWhatsAppMessage(property) {
  if (!property) {
    return "Hello, I'd like to enquire about properties at *JP Group Raipur*.";
  }

  const { title, status, propertyType, location, specs, description, slug, reraNumber } = property;
  const overview = truncateText(description, 140);
  const listingUrl = getPropertyUrl(slug);

  return [
    "Hello, I'm interested in this project from *JP Group Raipur*:",
    "",
    `*${title}*`,
    `${status} · ${propertyType}`,
    `📍 ${formatLocation(location)}`,
    `💰 ${formatPrice(property)}`,
    `📐 ${formatSpecs(specs)}`,
    reraNumber ? `📋 RERA: ${reraNumber}` : null,
    "",
    overview ? `_${overview}_` : "",
    overview ? "" : null,
    `View listing: ${listingUrl}`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function buildGeneralWhatsAppMessage() {
  return [
    "Hello, I'd like to enquire about residential plots at *JP Group Raipur*.",
    "",
    "Please share available projects and schedule a free site visit.",
  ].join("\n");
}

export function buildWhatsAppUrl(message) {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message) {
  window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
}
