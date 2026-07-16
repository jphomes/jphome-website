import React from "react";

export default function SectionHeading({ eyebrow, title, subtitle, align = "left", className = "" }) {
  return (
    <div className={`section-heading ${align === "center" ? "text-center" : ""} ${className}`}>
      {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
