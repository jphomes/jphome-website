import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import api from "../api/axios.js";
import HeroSection from "../components/HeroSection.jsx";
import StatsBar from "../components/StatsBar.jsx";
import FeaturedPropertyRow from "../components/FeaturedPropertyRow.jsx";
import PropertyRowSkeleton from "../components/PropertyRowSkeleton.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import AboutLegacy from "../components/AboutLegacy.jsx";
import WhyChooseUs from "../components/WhyChooseUs.jsx";
import ReviewCarousel from "../components/ReviewCarousel.jsx";
import FAQAccordion from "../components/FAQAccordion.jsx";
import ConsultationBanner from "../components/ConsultationBanner.jsx";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/properties", { params: { featured: true, limit: 6 } })
      .then((res) => setFeatured(res.data.properties))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      <HeroSection />
      <StatsBar className="mx-4 md:mx-auto md:max-w-5xl -mt-5 relative z-20" />

      <section className="home-section page-wrap">
        <div className="section-header-row">
          <SectionHeading
            eyebrow="Our Portfolio"
            title="Featured Projects"
            subtitle="Curated townships across Greater Raipur"
          />
          <Link to="/properties" className="view-all-link">
            View All
            <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="featured-list space-y-3">
            {[1, 2, 3].map((i) => (
              <PropertyRowSkeleton key={i} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="empty-state">
            <p className="text-sm text-muted">No featured projects right now.</p>
            <Link to="/properties" className="view-all-link mt-3 inline-flex">Browse all projects</Link>
          </div>
        ) : (
          <div className="featured-list space-y-3">
            {featured.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <FeaturedPropertyRow property={p} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="home-section home-section-muted">
        <AboutLegacy />
      </section>

      <section className="home-section">
        <WhyChooseUs />
      </section>

      <section className="home-section home-section-muted">
        <ReviewCarousel />
      </section>

      <section className="home-section">
        <FAQAccordion />
      </section>

      <ConsultationBanner />
    </div>
  );
}
