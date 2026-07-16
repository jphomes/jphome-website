import React from "react";

export default function PropertyRowSkeleton() {
  return (
    <div className="featured-row skeleton-row" aria-hidden>
      <div className="featured-row-img skeleton-shimmer" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 w-20 rounded skeleton-shimmer" />
        <div className="h-4 w-full rounded skeleton-shimmer" />
        <div className="h-3 w-3/4 rounded skeleton-shimmer" />
        <div className="h-4 w-28 rounded skeleton-shimmer mt-2" />
      </div>
    </div>
  );
}
