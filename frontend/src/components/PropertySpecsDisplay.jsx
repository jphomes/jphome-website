import React from "react";
import { getFilledSpecRows } from "../config/propertyTypes.js";

/**
 * Property detail specs grid — only filled values, grouped when needed.
 */
export default function PropertySpecsDisplay({ propertyType, specs }) {
  const rows = getFilledSpecRows(propertyType, specs);
  if (!rows.length) return null;

  const ungrouped = rows.filter((r) => !r.group);
  const groups = {};
  rows.filter((r) => r.group).forEach((r) => {
    if (!groups[r.group]) groups[r.group] = [];
    groups[r.group].push(r);
  });

  return (
    <div className="property-specs-display">
      {ungrouped.length > 0 && (
        <div className="property-specs-grid">
          {ungrouped.map((row) => (
            <div key={row.key} className="spec-tile text-center py-2.5">
              <p className="text-sm font-semibold text-forest">{row.value}</p>
              <p className="text-[9px] uppercase text-ink/40 mt-0.5">{row.label}</p>
            </div>
          ))}
        </div>
      )}

      {Object.entries(groups).map(([groupName, groupRows]) => (
        <div key={groupName} className="property-specs-group">
          <h3 className="property-specs-group-title">{groupName}</h3>
          <div className="property-specs-grid">
            {groupRows.map((row) => (
              <div key={row.key} className="spec-tile text-center py-2.5">
                <p className="text-sm font-semibold text-forest">{row.value}</p>
                <p className="text-[9px] uppercase text-ink/40 mt-0.5">{row.label}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
