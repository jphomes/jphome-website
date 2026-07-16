import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import WhatsAppButton from "./WhatsAppButton.jsx";
import { buildGeneralWhatsAppMessage } from "../utils/whatsapp.js";
import { BRAND } from "../config/brand.js";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/properties", label: "Properties" },
  { to: "/blogs", label: "Blogs" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="site-nav-inner">
        <Link to="/" className="site-logo" onClick={() => setMenuOpen(false)}>
          JP <span>Group</span>
        </Link>

        <div className="site-nav-links hidden lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `site-nav-link ${isActive ? "site-nav-link-active" : ""}`}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <WhatsAppButton message={buildGeneralWhatsAppMessage()} label="Enquire Now" variant="primary" className="!py-2 !px-5 !text-xs" />
        </div>

        <button
          type="button"
          className="lg:hidden app-header-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="site-mobile-menu lg:hidden">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setMenuOpen(false)} className="site-mobile-link">
              {l.label}
            </NavLink>
          ))}
          <p className="text-xs text-muted px-4 py-2">{BRAND.tagline}</p>
        </div>
      )}
    </header>
  );
}
