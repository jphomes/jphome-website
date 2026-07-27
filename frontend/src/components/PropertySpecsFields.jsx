import React from "react";
import { getSpecFieldsForType } from "../config/propertyTypes.js";

/** Shared admin field/select used inside specs forms. */
function SpecField({ field, value, onChange }) {
  const id = `spec-${field.key}`;

  if (field.kind === "select") {
    return (
      <div className="admin-field">
        <label htmlFor={id}>{field.label}</label>
        <select
          id={id}
          name={field.key}
          value={value ?? ""}
          onChange={onChange}
        >
          <option value="">Select…</option>
          {(field.options || []).map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="admin-field">
      <label htmlFor={id}>{field.label}</label>
      <input
        id={id}
        name={field.key}
        type={field.kind === "number" ? "number" : "text"}
        value={value ?? ""}
        onChange={onChange}
        placeholder={field.kind === "number" ? "Optional" : ""}
        min={field.kind === "number" ? 0 : undefined}
        step={field.key === "acres" ? "0.01" : undefined}
      />
    </div>
  );
}

/**
 * Type-dependent property specs inputs for admin create/edit.
 */
export default function PropertySpecsFields({ propertyType, values, onChange }) {
  const fields = getSpecFieldsForType(propertyType);

  const ungrouped = fields.filter((f) => !f.group);
  const groups = {};
  fields.filter((f) => f.group).forEach((f) => {
    if (!groups[f.group]) groups[f.group] = [];
    groups[f.group].push(f);
  });

  return (
    <div className="admin-specs-block">
      <div className="admin-panel-head" style={{ marginBottom: "0.75rem" }}>
        <h2 style={{ fontSize: "1rem" }}>Property details — {propertyType}</h2>
      </div>
      <p className="text-xs text-muted mb-3">
        Fields change with type. Leave blank if not applicable — empty fields won’t show on the site.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {ungrouped.map((field) => (
          <SpecField
            key={field.key}
            field={field}
            value={values[field.key]}
            onChange={onChange}
          />
        ))}
      </div>

      {Object.entries(groups).map(([groupName, groupFields]) => (
        <div key={groupName} className="admin-specs-group mt-4">
          <p className="admin-specs-group-title">{groupName}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {groupFields.map((field) => (
              <SpecField
                key={field.key}
                field={field}
                value={values[field.key]}
                onChange={onChange}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
