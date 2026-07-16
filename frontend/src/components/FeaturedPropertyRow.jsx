import React from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiChevronRight } from "react-icons/fi";
import { formatPrice, formatLocation } from "../utils/property.js";

function configLabel(property) {
  const { specs, propertyType } = property;
  if (specs?.sqft) return `${specs.sqft.toLocaleString("en-IN")} Sq.Ft · ${propertyType}`;
  return propertyType;
}

export default function FeaturedPropertyRow({ property }) {
  const { title, slug, coverImage, location, reraApproved } = property;

  return (
    <Link to={`/properties/${slug}`} className="featured-row group">
      <div className="featured-row-media">
        <img src={coverImage} alt={title} className="featured-row-img" loading="lazy" />
      </div>

      <div className="featured-row-body min-w-0 flex-1">
        {reraApproved && <span className="rera-badge mb-1.5">RERA Approved</span>}
        <h3 className="featured-row-title">{title}</h3>
        <p className="featured-row-meta">
          <FiMapPin size={12} className="shrink-0" />
          {formatLocation(location)}
        </p>
        <p className="text-xs text-muted mt-1">{configLabel(property)}</p>
        <p className="featured-row-price">
          Starting {formatPrice(property)}
          <span className="text-muted/50 font-normal text-xs"> onwards</span>
        </p>
      </div>

      <span className="featured-row-arrow" aria-hidden>
        <FiChevronRight size={18} />
      </span>
    </Link>
  );
}
