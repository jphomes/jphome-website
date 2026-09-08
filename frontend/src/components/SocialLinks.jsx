import React from "react";
import { FaFacebookF, FaGoogle, FaInstagram, FaYoutube } from "react-icons/fa";
import { BRAND } from "../config/brand.js";

const links = [
  { key: "facebook", label: "Facebook", icon: FaFacebookF },
  { key: "instagram", label: "Instagram", icon: FaInstagram },
  { key: "youtube", label: "YouTube", icon: FaYoutube },
  { key: "google", label: "Google Business", icon: FaGoogle },
];

export default function SocialLinks({ className = "" }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {links.map(({ key, label, icon: Icon }) => (
        <a
          key={key}
          href={BRAND.socials[key]}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          title={label}
          className="inline-flex items-center gap-1.5 rounded-full border border-current/20 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-current/10"
        >
          <Icon size={13} />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
}
