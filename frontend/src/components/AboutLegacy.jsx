import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BRAND } from "../config/brand.js";
import SectionHeading from "./SectionHeading.jsx";

export default function AboutLegacy() {
  return (
    <div className="page-wrap">
      <div className="about-legacy-grid">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="about-legacy-visual"
        >
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop"
            alt="JP Group legacy"
            className="about-legacy-img"
            loading="lazy"
          />
          <div className="about-legacy-badge">
            <p className="text-3xl font-display font-bold text-primary">{BRAND.since}</p>
            <p className="text-xs text-muted uppercase tracking-wider">Est. Year</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SectionHeading
            eyebrow="About JP Group"
            title="A Legacy of Trust & Excellence"
            className="mb-4"
          />
          <p className="text-sm md:text-base text-muted leading-relaxed mb-4">
            For over 28 years, JP Group has been the name families trust when making the most important investment
            of their lives. Founded in 1995, we have delivered landmark residential projects across Greater Raipur.
          </p>
          <p className="text-sm md:text-base text-muted leading-relaxed mb-6">
            Our philosophy is simple: every plot we develop must stand as a testament to quality,
            transparent transactions, and enduring value.
          </p>
          <ul className="flex flex-wrap gap-2 mb-6">
            {["RERA Registered", "T&CP Approved", "Bank Loan Ready", "Vastu Compliant"].map((tag) => (
              <li key={tag} className="amenity-pill text-[10px]">{tag}</li>
            ))}
          </ul>
          <Link to="/about" className="inline-link">
            Our Story →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
