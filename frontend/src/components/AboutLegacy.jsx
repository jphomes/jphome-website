import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BRAND } from "../config/brand.js";
import SectionHeading from "./SectionHeading.jsx";
import gauravSondagarImage from "../assets/imagesUsed/gaurav_sondagar.PNG";

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
            src={gauravSondagarImage}
            alt="Gaurav Sondagar"
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
            eyebrow="About JP Homes"
            title="Your Property Journey, Guided with Confidence"
            className="mb-4"
          />
          <p className="text-sm md:text-base text-muted leading-relaxed mb-4">
            JP Homes is a Real estate consultancy based in Raipur and Naya Raipur, Founded by Gaurav Sondagar.
            We help homebuyers, investors, and property owners make informed real estate decisions through expert
            consultation and local market guidance.
            <br /><br />
            Our services include residential and commercial properties, plots, builder projects, farmhouses,
            investment advisory, property marketing, and resale assistance.
            <br /><br />
            Specialising in Naya Raipur investment opportunities, premium residential properties, and builder
            projects, we provides verified options, transparent advice, and end-to-end support for every property journey.
          </p>
          <ul className="flex flex-wrap gap-2 mb-6">
            {["RERA Approved Projects", "Open market deals", "After Sales Service", "Easy bank finance"].map((tag) => (
              <li key={tag} className="amenity-pill text-[10px]">{tag}</li>
            ))}
          </ul>
          <Link to="/contact" className="inline-link">
            Book Consultation →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
