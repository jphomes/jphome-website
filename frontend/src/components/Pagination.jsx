import React from "react";

/** Build a compact page list: 1 … 4 5 6 … 20 */
function buildPageItems(page, totalPages, siblingCount = 1) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items = [];
  const left = Math.max(2, page - siblingCount);
  const right = Math.min(totalPages - 1, page + siblingCount);

  items.push(1);
  if (left > 2) items.push("…");
  for (let n = left; n <= right; n += 1) items.push(n);
  if (right < totalPages - 1) items.push("…");
  items.push(totalPages);
  return items;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  className = "",
  compact = false,
}) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = buildPageItems(page, totalPages);

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-2 ${
        compact ? "mt-6" : "mt-12 md:mt-16"
      } ${className}`.trim()}
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="pagination-btn min-w-[72px] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← Prev
      </button>

      <div className="hidden sm:flex items-center gap-1.5">
        {pages.map((n, i) =>
          n === "…" ? (
            <span key={`e-${i}`} className="px-1.5 text-ink/40 text-sm select-none" aria-hidden>
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(n)}
              className={`pagination-num ${n === page ? "pagination-num-active" : ""}`}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </button>
          )
        )}
      </div>

      <span className="sm:hidden font-mono text-xs text-ink/50 px-2">
        {page} / {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="pagination-btn min-w-[72px] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </nav>
  );
}
