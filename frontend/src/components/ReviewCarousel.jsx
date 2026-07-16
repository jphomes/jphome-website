import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REVIEWS } from "../data/reviews.js";
import { FiStar } from "react-icons/fi";
import SectionHeading from "./SectionHeading.jsx";

const INTERVAL_MS = 5000;

export default function ReviewCarousel() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % REVIEWS.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, next]);

  useEffect(() => {
    if (paused) return;
    setProgress(0);
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(100, (elapsed / INTERVAL_MS) * 100));
    }, 40);
    return () => clearInterval(tick);
  }, [active, paused]);

  const review = REVIEWS[active];

  return (
    <div className="page-wrap">
      <SectionHeading
        eyebrow="Client Stories"
        title="What Our Residents Are Saying"
        subtitle="Trusted by families across our townships"
        align="center"
      />

      <div
        className="max-w-2xl mx-auto mt-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setTimeout(() => setPaused(false), 3000)}
      >
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          Review by {review.name}
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={review.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="review-card"
          >
            <div className="flex gap-1 mb-3 text-secondary">
              {Array.from({ length: review.rating }).map((_, i) => (
                <FiStar key={i} className="fill-secondary w-4 h-4" />
              ))}
            </div>
            <p className="text-sm md:text-base text-muted leading-relaxed italic">"{review.text}"</p>
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-sage/40">
              <img src={review.avatar} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-mint" />
              <div>
                <p className="font-semibold text-primary text-sm">{review.name}</p>
                <p className="text-xs text-muted">{review.role}</p>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>

        <div className="flex justify-center gap-1.5 mt-6">
          {REVIEWS.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => { setActive(i); setProgress(0); }}
              aria-label={`Show review by ${r.name}`}
              aria-current={i === active ? "true" : undefined}
              className="review-dot-wrap"
            >
              <span
                className={`review-dot ${i === active ? "review-dot-active" : ""}`}
                style={i === active ? { "--progress": `${progress}%` } : undefined}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
