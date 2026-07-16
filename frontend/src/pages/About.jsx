import React from "react";
import { Link } from "react-router-dom";
import { BRAND } from "../config/brand.js";
import AboutLegacy from "../components/AboutLegacy.jsx";
import WhyChooseUs from "../components/WhyChooseUs.jsx";
import ReviewCarousel from "../components/ReviewCarousel.jsx";
import ConsultationBanner from "../components/ConsultationBanner.jsx";
import StatsBar from "../components/StatsBar.jsx";

export default function About() {
  return (
    <div className="pb-4">
      <div className="page-wrap pt-6 md:pt-10">
        <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-2">About Us</p>
        <h1 className="font-display text-2xl md:text-4xl text-primary font-semibold mb-4">
          JP Group — Since {BRAND.since}
        </h1>
        <p className="text-muted text-sm md:text-base leading-relaxed max-w-3xl">
          For over 28 years, JP Group has been the name families trust when making the most important investment
          of their lives across Greater Raipur and Chhattisgarh.
        </p>
      </div>
      <StatsBar className="mx-4 md:mx-auto md:max-w-4xl mt-6" />
      <AboutLegacy />
      <WhyChooseUs />
      <ReviewCarousel />
      <ConsultationBanner />
      <div className="page-wrap pb-6 text-center">
        <Link to="/contact" className="btn-primary inline-flex">Contact Us →</Link>
      </div>
    </div>
  );
}
