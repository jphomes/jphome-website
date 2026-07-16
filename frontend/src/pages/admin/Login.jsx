import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth.js";
import BrandLogo from "../../components/BrandLogo.jsx";
import { BRAND } from "../../config/brand.js";

export default function Login() {
  const { login, admin, loading, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && admin) return <Navigate to="/admin/dashboard" replace />;
  if (loading || (token && !admin)) {
    return <div className="admin-loading">Preparing studio…</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.username, form.password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-bg" aria-hidden="true" />
      <div className="admin-login-pattern" aria-hidden="true" />

      <Link to="/" className="admin-login-site-link">
        ← Back to website
      </Link>

      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/" className="admin-login-logo-wrap" aria-label={`${BRAND.fullName} — go to homepage`}>
          <BrandLogo variant="square" className="admin-login-logo" />
        </Link>
        <p className="admin-login-eyebrow">{BRAND.fullName}</p>
        <h1 className="admin-login-title">Team Login</h1>
        <p className="admin-login-sub">Sign in to manage projects, journal & enquiries.</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              required
              autoComplete="username"
              placeholder="you@company.com"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div className="admin-login-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              required
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && <p className="admin-error">{error}</p>}

          <button type="submit" disabled={submitting} className="admin-login-submit">
            {submitting ? "Signing in…" : "Enter studio"}
          </button>
        </form>

        <p className="admin-login-foot">
          Restricted to the {BRAND.name} team ·{" "}
          <Link to="/" className="admin-login-foot-link">Visit site</Link>
        </p>
      </motion.div>
    </div>
  );
}
