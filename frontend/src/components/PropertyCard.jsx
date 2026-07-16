import React from "react";
import { Link } from "react-router-dom";
import { formatPrice, formatLocation } from "../utils/property.js";

export default function PropertyCard({ property }) {
  const { title, slug, coverImage, location, specs, status, reraApproved } = property;

  return (
    <Link to={`/properties/${slug}`} className="group card-elevated block bg-white overflow-hidden">
      <div className="relative overflow-hidden">
        <img src={coverImage} alt={title} className="w-full h-44 md:h-52 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <span className="bg-primary/90 text-white text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full">
            {status}
          </span>
          {reraApproved && (
            <span className="rera-badge !text-[9px] !py-0.5">RERA</span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-primary text-[15px] leading-snug line-clamp-2">{title}</h3>
        <p className="text-xs text-muted mt-1 flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" />
          </svg>
          {formatLocation(location)}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-sage/50">
          <span className="text-sm font-semibold text-secondary">{formatPrice(property)}</span>
          <span className="text-[11px] text-muted">{specs.sqft?.toLocaleString("en-IN")} sq.ft</span>
        </div>
        <p className="text-[11px] font-semibold text-gold mt-2">View Details →</p>
      </div>
    </Link>
  );
}
