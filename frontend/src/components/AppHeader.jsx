import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BRAND } from "../config/brand.js";

const PAGE_TITLES = {
  "/properties": "Properties",
  "/blogs": "Blogs",
  "/blog": "Blogs",
  "/about": "About",
  "/contact": "Contact",
};

export default function AppHeader({ title, showBack = false }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const pageTitle = title || PAGE_TITLES[location.pathname];

  return (
    <header className="app-header safe-top">
      <div className="flex items-center justify-between gap-3">
        {showBack ? (
          <button type="button" onClick={() => window.history.back()} className="app-header-btn" aria-label="Go back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : (
          <Link to="/" className="font-display text-lg text-primary leading-none font-semibold">
            JP <span className="text-secondary font-medium">Group</span>
          </Link>
        )}

        {pageTitle && !isHome ? (
          <h1 className="text-sm font-medium text-ink/80 truncate flex-1 text-center">{pageTitle}</h1>
        ) : (
          <p className="text-[10px] tracking-widest uppercase text-muted">{BRAND.tagline}</p>
        )}

        <Link to="/contact" className="app-header-btn" aria-label="Contact">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
