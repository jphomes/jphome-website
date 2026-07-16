import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { STATS } from "../config/brand.js";

function useCountUp(target, active, duration = 1200) {
  const [value, setValue] = useState("0");

  useEffect(() => {
    if (!active) return;
    const match = String(target).match(/^(\d+)(.*)$/);
    if (!match) {
      setValue(target);
      return;
    }

    const end = Number(match[1]);
    const suffix = match[2] || "";
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(`${Math.round(end * eased)}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, active, duration]);

  return value;
}

function StatItem({ stat, index, inView }) {
  const display = useCountUp(stat.value, inView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="stats-bar-item"
    >
      <p className="stats-bar-value">{display}</p>
      <p className="stats-bar-label">{stat.label}</p>
    </motion.div>
  );
}

export default function StatsBar({ className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`stats-bar ${className}`}
      aria-label="Company highlights"
    >
      {STATS.map((s, i) => (
        <StatItem key={s.label} stat={s} index={i} inView={inView} />
      ))}
    </motion.section>
  );
}
