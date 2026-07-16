import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { FAQ_ITEMS } from "../data/faq.js";
import SectionHeading from "./SectionHeading.jsx";

export default function FAQAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <div className="page-wrap">
      <SectionHeading
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        subtitle="Quick answers before you invest"
        align="center"
        className="mb-8"
      />

      <div className="faq-list max-w-3xl mx-auto">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className={`faq-item ${isOpen ? "faq-item-open" : ""}`}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="faq-trigger"
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <FiChevronDown className={`faq-chevron ${isOpen ? "faq-chevron-open" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="faq-answer">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
