import React from "react";
import { FiMapPin, FiClock, FiPhone, FiMail } from "react-icons/fi";
import { BRAND } from "../config/brand.js";
import EnquiryForm from "../components/EnquiryForm.jsx";
import WhatsAppButton from "../components/WhatsAppButton.jsx";
import { buildGeneralWhatsAppMessage } from "../utils/whatsapp.js";
import { callPhone } from "../utils/contact.js";

export default function Contact() {
  return (
    <div className="page-wrap py-6 md:py-12">
      <div className="mb-8">
        <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-2">Get in Touch</p>
        <h1 className="font-display text-2xl md:text-4xl text-primary font-semibold">Contact JP Group</h1>
        <p className="text-muted text-sm mt-2 max-w-xl">
          Free consultation — our expert will reach you within 1 hour. Site visits arranged Mon–Sun.
        </p>
      </div>

      <div className="contact-grid">
        <div className="space-y-4">
          <div className="contact-info-card">
            <FiMapPin className="text-secondary text-lg" />
            <div>
              <p className="font-semibold text-primary text-sm">Office Address</p>
              <p className="text-muted text-sm mt-1">{BRAND.address}</p>
            </div>
          </div>
          <div className="contact-info-card">
            <FiClock className="text-secondary text-lg" />
            <div>
              <p className="font-semibold text-primary text-sm">Working Hours</p>
              <p className="text-muted text-sm mt-1">{BRAND.hours}</p>
            </div>
          </div>
          <div className="contact-info-card">
            <FiPhone className="text-secondary text-lg" />
            <div>
              <p className="font-semibold text-primary text-sm">Phone</p>
              <button type="button" onClick={callPhone} className="text-secondary text-sm mt-1 hover:underline">
                {BRAND.phone}
              </button>
            </div>
          </div>
          <div className="contact-info-card">
            <FiMail className="text-secondary text-lg" />
            <div>
              <p className="font-semibold text-primary text-sm">Email</p>
              <p className="text-muted text-sm mt-1">{BRAND.email}</p>
            </div>
          </div>

          <WhatsAppButton message={buildGeneralWhatsAppMessage()} label="WhatsApp Us" fullWidth />

          <div className="rounded-2xl overflow-hidden border border-sage h-48 md:h-56 bg-mint flex items-center justify-center">
            <p className="text-muted text-sm text-center px-4">
              📍 {BRAND.city}, {BRAND.state}<br />
              <span className="text-xs">Map embed can be added here</span>
            </p>
          </div>
        </div>

        <div className="sidebar-panel">
          <h2 className="section-title">Send an Enquiry</h2>
          <p className="text-xs text-muted mb-5">It's free — we'll call you back shortly.</p>
          <EnquiryForm />
        </div>
      </div>
    </div>
  );
}
