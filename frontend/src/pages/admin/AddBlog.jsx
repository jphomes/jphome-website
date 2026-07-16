import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const initial = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "Market Insights",
  tags: "",
  readTimeMinutes: 4,
  published: true,
};

export default function AddBlog() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      ...form,
      readTimeMinutes: Number(form.readTimeMinutes) || 4,
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      await api.post("/blogs", payload);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save blog post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone/30 pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-0">
        <p className="text-brass text-xs tracking-widest2 uppercase mb-2">Admin Panel</p>
        <h1 className="font-display text-3xl text-ink mb-8">Add Blog Post</h1>

        <form onSubmit={handleSubmit} className="bg-white/70 border border-ink/10 p-8 space-y-6">
          <Field label="Title" name="title" value={form.title} onChange={handleChange} required />
          <Field label="Excerpt (short summary shown on cards)" name="excerpt" value={form.excerpt} onChange={handleChange} textarea required />
          <Field
            label="Content (HTML or plain paragraphs)"
            name="content"
            value={form.content}
            onChange={handleChange}
            textarea
            rows={10}
            required
          />
          <Field label="Cover Image URL" name="coverImage" value={form.coverImage} onChange={handleChange} required />

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Category" name="category" value={form.category} onChange={handleChange} />
            <Field label="Tags (comma-separated)" name="tags" value={form.tags} onChange={handleChange} />
            <Field label="Read Time (minutes)" name="readTimeMinutes" value={form.readTimeMinutes} onChange={handleChange} type="number" />
          </div>

          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
            Publish immediately
          </label>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-charcoal text-stone text-sm tracking-widest2 uppercase px-8 py-3 hover:bg-brassdark disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, textarea, rows = 3, ...props }) {
  return (
    <div>
      <label className="text-xs tracking-widest2 uppercase text-ink/50">{label}</label>
      {textarea ? (
        <textarea rows={rows} {...props} className="mt-1 w-full bg-transparent border-b border-ink/20 focus:border-brass py-2 outline-none resize-none" />
      ) : (
        <input {...props} className="mt-1 w-full bg-transparent border-b border-ink/20 focus:border-brass py-2 outline-none" />
      )}
    </div>
  );
}
