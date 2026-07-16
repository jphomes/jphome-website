import React from "react";
import { Link } from "react-router-dom";
import WhatsAppIcon from "./WhatsAppIcon.jsx";
import { buildGeneralWhatsAppMessage, openWhatsApp } from "../utils/whatsapp.js";

export default function Footer() {
  const whatsappMessage = buildGeneralWhatsAppMessage();

  return (
    <footer className="bg-charcoal text-stone/80 pt-16 pb-8 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-4 gap-12">
        <div>
          <h3 className="font-display text-2xl text-stone mb-3">
            Sondagar <span className="text-brass italic">Estates</span>
          </h3>
          <p className="text-sm text-stone/60 leading-relaxed max-w-xs">
            Considered properties, carefully presented — a curated portfolio of homes across the
            city, guided by Tom Sondagar.
          </p>
        </div>

        <div>
          <h4 className="text-brass text-xs tracking-widest2 uppercase mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/properties" className="hover:text-brass">Properties</Link></li>
            <li><Link to="/blog" className="hover:text-brass">Journal</Link></li>
            <li><Link to="/about" className="hover:text-brass">About</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-brass text-xs tracking-widest2 uppercase mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-stone/70">
            <li>tom@sondagarestates.com</li>
            <li>+91 98939 11656</li>
            <li>MG Road, Bengaluru, IN</li>
            <li className="pt-2">
              <button
                type="button"
                onClick={() => openWhatsApp(whatsappMessage)}
                className="inline-flex items-center gap-2 text-[#7ddea0] hover:text-[#a8f0c0] transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Chat on WhatsApp
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-brass text-xs tracking-widest2 uppercase mb-4">Admin</h4>
          <Link
            to="/admin/login"
            className="text-sm text-stone/50 hover:text-brass transition-colors"
          >
            Team login →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-16 pt-6 border-t border-white/10 text-xs text-stone/40 flex flex-col md:flex-row justify-between gap-2">
        <span>© {new Date().getFullYear()} Sondagar Estates. All rights reserved.</span>
        <span className="font-mono">Built with care, brick by brick.</span>
      </div>
    </footer>
  );
}
