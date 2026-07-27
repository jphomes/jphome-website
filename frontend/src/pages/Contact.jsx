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

          <div className="contact-map-wrap">
            <iframe
              title={`${BRAND.fullName} location map`}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7777.728434516948!2d77.64961918431548!3d12.916447380562394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15827747a4e9%3A0x60bfc4476e6de3ec!2sBabai%20Tiffins%2C%20HSR%20Layout!5e0!3m2!1sen!2sin!4v1785129763256!5m2!1sen!2sin"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
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
