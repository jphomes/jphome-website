import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BrandLogo from "./BrandLogo.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { BRAND } from "../config/brand.js";

export default function AdminShell({
  children,
  title,
  subtitle = "Command centre",
  actions = null,
  narrow = false,
}) {
  const { admin, logout } = useAuth();

  return (
    <div className="admin-shell">
      <div className="admin-shell-bg" aria-hidden="true" />
      <div className="admin-shell-grid" aria-hidden="true" />

      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <Link to="/admin/dashboard" className="admin-brand" aria-label={`${BRAND.fullName} admin`}>
            <BrandLogo variant="mark" className="admin-brand-mark" />
            <div className="admin-brand-text">
              <span className="admin-brand-name">{BRAND.name}</span>
              <span className="admin-brand-sub">Studio</span>
            </div>
          </Link>

          <div className="admin-topbar-right">
            <div className="admin-user-chip">
              <span className="admin-user-avatar">{(admin?.name || admin?.username || "A").slice(0, 1).toUpperCase()}</span>
              <div className="admin-user-meta">
                <span className="admin-user-name">{admin?.name || "Admin"}</span>
                <span className="admin-user-email">{admin?.username || admin?.email}</span>
              </div>
            </div>
            <Link to="/" className="admin-ghost-btn" target="_blank" rel="noreferrer">
              View site
            </Link>
            <button type="button" onClick={logout} className="admin-logout-btn">
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className={`admin-main ${narrow ? "admin-main--narrow" : ""}`}>
        <motion.div
          className="admin-page-head"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="admin-eyebrow">{subtitle}</p>
            <h1 className="admin-title">{title}</h1>
          </div>
          {actions && <div className="admin-page-actions">{actions}</div>}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
