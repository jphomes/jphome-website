import React from "react";
import { Link } from "react-router-dom";
import { FiPhone } from "react-icons/fi";
import { BRAND } from "../config/brand.js";
import WhatsAppIcon from "./WhatsAppIcon.jsx";
import { openWhatsApp, buildGeneralWhatsAppMessage } from "../utils/whatsapp.js";
import { callPhone } from "../utils/contact.js";

export default function ConsultationBanner() {
  return (
    <section className="page-wrap pb-6">
      <div className="consultation-banner">
        <div className="consultation-banner-inner">
          <div>
            <p className="text-secondary text-xs font-semibold tracking-widest uppercase mb-2">Get Started</p>
            <h2 className="font-display text-xl md:text-2xl font-semibold text-primary mb-2">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-sm text-muted leading-relaxed max-w-lg">
              Let our experts guide you to the right investment in {BRAND.city}. Free consultation and site visits available.
            </p>
          </div>
          <div className="consultation-actions">
            <button type="button" onClick={callPhone} className="btn-primary btn-touch consultation-btn">
              <FiPhone size={16} />
              Book Consultation
            </button>
            <button
              type="button"
              onClick={() => openWhatsApp(buildGeneralWhatsAppMessage())}
              className="btn-wa btn-touch consultation-btn"
            >
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </button>
            <Link to="/contact" className="consultation-link">
              Or send an enquiry →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
