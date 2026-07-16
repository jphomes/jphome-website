import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import WhatsAppButton from "./WhatsAppButton.jsx";
import { buildGeneralWhatsAppMessage } from "../utils/whatsapp.js";

const links = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/blog", label: "Journal" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-charcoal/95 backdrop-blur" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4 sm:py-5">
        <Link to="/" className="font-display text-xl text-stone tracking-wide">
          Sondagar <span className="text-brass italic">Estates</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `font-body text-[13px] tracking-widest2 uppercase transition-colors ${
                  isActive ? "text-brass" : "text-stone/80 hover:text-brass"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <WhatsAppButton
            message={buildGeneralWhatsAppMessage()}
            label="WhatsApp"
            variant="outline"
            className="!border-brass/60 !text-brass hover:!bg-brass hover:!text-charcoal !px-5 !py-2"
          />
        </div>

        <button
          aria-label="Toggle menu"
          className="md:hidden text-stone"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {open ? (
              <path strokeWidth="1.5" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeWidth="1.5" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-charcoal px-4 pb-6 flex flex-col gap-3 border-t border-white/10">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="text-stone/90 text-sm tracking-widest2 uppercase py-3 border-b border-white/10"
            >
              {l.label}
            </NavLink>
          ))}
          <WhatsAppButton
            message={buildGeneralWhatsAppMessage()}
            label="WhatsApp Enquiry"
            fullWidth
            className="!mt-2"
          />
        </div>
      )}
    </header>
  );
}
