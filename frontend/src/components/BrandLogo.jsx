import React from "react";
import { logos } from "../assets/logos/index.js";
import { BRAND } from "../config/brand.js";

const VARIANTS = {
  horizontal: logos.horizontal,
  mark: logos.mark,
  square: logos.square,
  wordmark: logos.wordmark,
};

/**
 * @param {"horizontal"|"mark"|"square"|"wordmark"} variant
 */
export default function BrandLogo({
  variant = "horizontal",
  className = "",
  alt = BRAND.fullName,
  ...imgProps
}) {
  const src = VARIANTS[variant] || logos.horizontal;
  return (
    <img
      src={src}
      alt={alt}
      className={`brand-logo brand-logo--${variant} ${className}`.trim()}
      decoding="async"
      {...imgProps}
    />
  );
}
