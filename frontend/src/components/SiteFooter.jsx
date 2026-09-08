import React from "react";
import { Link } from "react-router-dom";
import WhatsAppIcon from "./WhatsAppIcon.jsx";
import BrandLogo from "./BrandLogo.jsx";
import { buildGeneralWhatsAppMessage, openWhatsApp } from "../utils/whatsapp.js";
import { BRAND } from "../config/brand.js";
import SocialLinks from "./SocialLinks.jsx";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-wrap site-footer-grid">
        <div>
          <Link to="/" className="site-footer-logo" aria-label={BRAND.fullName}>
            <BrandLogo variant="horizontal" className="site-footer-logo-img" />
          </Link>
          <p className="text-sm text-muted leading-relaxed max-w-xs mt-2">
            Rera Approved agent helping you find perfect property in raipur and naya raipur
          </p>
          <SocialLinks className="text-secondary mt-4" />
        </div>

        <div>
          <h4 className="site-footer-heading">Explore</h4>
          <ul className="site-footer-links">
            <li><Link to="/properties">Properties</Link></li>
            <li><Link to="/blogs">Blogs</Link></li>
            <li><Link to="/#about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="site-footer-heading">Contact</h4>
          <ul className="site-footer-links">
            <li>{BRAND.email}</li>
            <li>{BRAND.phone}</li>
            <li>{BRAND.address}</li>
            <li>
              <button type="button" onClick={() => openWhatsApp(buildGeneralWhatsAppMessage())} className="site-footer-wa">
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="site-footer-heading">Admin</h4>
          <Link to="/admin/login" className="text-sm text-muted hover:text-secondary transition-colors">
            Team login →
          </Link>
        </div>
      </div>

      <div className="page-wrap site-footer-bottom">
        <span>© {new Date().getFullYear()} JP Homes Raipur</span>
        <span>RERA APPROVED AGENT</span>
      </div>
    </footer>
  );
}
