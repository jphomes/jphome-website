import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { BRAND } from "../config/brand.js";
import WhatsAppIcon from "./WhatsAppIcon.jsx";
import { openWhatsApp, buildGeneralWhatsAppMessage } from "../utils/whatsapp.js";

export default function HeroSection() {
  return (
    <section className="hero-jp relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
        alt="Residential plots in Raipur"
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
      />
      <div className="hero-jp-overlay absolute inset-0" />
      <div className="hero-jp-fade absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#fafcfb] to-transparent pointer-events-none md:hidden" />

      <div className="page-wrap relative z-10 py-14 md:py-24 flex flex-col justify-center min-h-[440px] md:min-h-[520px]">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-chip"
        >
          RERA Approved Developer
        </motion.span>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sage text-xs md:text-sm font-medium mb-2"
        >
          {BRAND.fullName} · Since {BRAND.since}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-display text-[1.75rem] sm:text-3xl md:text-5xl lg:text-6xl text-white font-semibold leading-[1.12] max-w-3xl"
        >
          Residential Plots & Land for Sale in {BRAND.city}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-white/82 text-sm md:text-base mt-4 max-w-xl leading-relaxed"
        >
          RERA approved residential plots across Greater Raipur & Naya Raipur — clear title, bank finance support, and free site visits.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="hero-cta-group"
        >
          <Link to="/contact" className="btn-primary btn-touch">
            Enquire Now
          </Link>
          <Link to="/properties" className="btn-outline-light btn-touch">
            View Projects
            <FiArrowRight className="ml-1.5" size={16} />
          </Link>
          <button
            type="button"
            onClick={() => openWhatsApp(buildGeneralWhatsAppMessage())}
            className="btn-wa-circle btn-touch"
            aria-label="Chat on WhatsApp"
          >
            <WhatsAppIcon className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
