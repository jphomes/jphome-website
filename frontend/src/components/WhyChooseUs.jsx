import React from "react";
import { motion } from "framer-motion";
import { WHY_CHOOSE_US } from "../data/whyChooseUs.js";
import SectionHeading from "./SectionHeading.jsx";

export default function WhyChooseUs() {
  return (
    <div className="page-wrap">
      <SectionHeading
        eyebrow="Why Choose JP Group"
        title="6 Reasons to Invest with Confidence"
        align="center"
        className="mb-8 md:mb-10"
      />

      <div className="why-grid">
        {WHY_CHOOSE_US.map((item, i) => (
          <motion.div
            key={item.num}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="why-card"
          >
            <div className="why-card-icon">
              <span className="text-xl">{item.icon}</span>
              <span className="why-card-num">{item.num}</span>
            </div>
            <h3 className="font-semibold text-primary text-[15px] mb-2">{item.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{item.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
