import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const { login, admin, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && admin) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.username, form.password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-brass text-xs tracking-widest2 uppercase mb-3 text-center">
          Sondagar Estates
        </p>
        <h1 className="font-display text-3xl text-stone text-center mb-8">Team Login</h1>

        <form onSubmit={handleSubmit} className="space-y-5 bg-ink/40 border border-white/10 p-8">
          <div>
            <label className="text-xs tracking-widest2 uppercase text-stone/50">Username</label>
            <input
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="mt-1 w-full bg-transparent border-b border-white/20 focus:border-brass text-stone py-2 outline-none"
            />
          </div>
          <div>
            <label className="text-xs tracking-widest2 uppercase text-stone/50">Password</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full bg-transparent border-b border-white/20 focus:border-brass text-stone py-2 outline-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brass text-charcoal text-sm tracking-widest2 uppercase py-3 hover:bg-stone transition-colors disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-stone/30 text-xs text-center mt-6">
          Restricted to the Sondagar Estates team.
        </p>
      </div>
    </div>
  );
}
