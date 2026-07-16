import React from "react";

const ROWS = [
  {
    type: "You type",
    result: "On the site",
    isHeader: true,
  },
  {
    type: "# Main heading",
    result: "Largest section title",
  },
  {
    type: "## Subheading",
    result: "Section title (most common)",
  },
  {
    type: "### Smaller heading",
    result: "Sub-section title",
  },
  {
    type: "**bold text**",
    result: "bold text",
  },
  {
    type: "*italic text*",
    result: "italic text",
  },
  {
    type: "- First point\n- Second point",
    result: "• Bullet list",
  },
  {
    type: "1. First step\n2. Second step",
    result: "1. Numbered list",
  },
  {
    type: "Normal paragraph\n\nNext paragraph",
    result: "Blank line = new paragraph",
  },
];

const EXAMPLE = `## Why prices have stayed strong

Bengaluru stays resilient because of **IT demand** and infrastructure.

### Areas to watch

- North Bengaluru & airport corridor
- Marathahalli
- Sarjapur Road

1. Check commute
2. Check developer track record
3. Buy for long-term value`;

/**
 * Formatting guide for journal / blog creators in admin.
 */
export default function MarkdownCheatSheet({ compact = false }) {
  return (
    <aside className={`admin-md-sheet ${compact ? "admin-md-sheet--compact" : ""}`} aria-label="Content formatting cheat sheet">
      <div className="admin-md-sheet-head">
        <h3>Content formatting cheat sheet</h3>
        <p>Use these codes in the Content box. Leave a blank line between sections.</p>
      </div>

      <div className="admin-md-sheet-table" role="table">
        {ROWS.map((row) =>
          row.isHeader ? (
            <div key="hdr" className="admin-md-sheet-row admin-md-sheet-row--head" role="row">
              <span role="columnheader">{row.type}</span>
              <span role="columnheader">{row.result}</span>
            </div>
          ) : (
            <div key={row.type} className="admin-md-sheet-row" role="row">
              <pre role="cell">{row.type}</pre>
              <span role="cell">{row.result}</span>
            </div>
          )
        )}
      </div>

      {!compact && (
        <details className="admin-md-sheet-example">
          <summary>Full example you can copy</summary>
          <pre>{EXAMPLE}</pre>
        </details>
      )}
    </aside>
  );
}
