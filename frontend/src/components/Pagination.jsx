import React from "react";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-2 mt-12 md:mt-16"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="pagination-btn min-w-[88px] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← Prev
      </button>

      <div className="hidden sm:flex items-center gap-2">
        {pages.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPageChange(n)}
            className={`pagination-num ${n === page ? "pagination-num-active" : ""}`}
            aria-current={n === page ? "page" : undefined}
          >
            {n}
          </button>
        ))}
      </div>

      <span className="sm:hidden font-mono text-xs text-ink/50 px-3">
        {page} / {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="pagination-btn min-w-[88px] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </nav>
  );
}
