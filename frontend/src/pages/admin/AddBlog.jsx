import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios.js";
import ImageUploader from "../../components/ImageUploader.jsx";
import AdminShell from "../../components/AdminShell.jsx";
import MarkdownCheatSheet from "../../components/MarkdownCheatSheet.jsx";

const initial = {
  title: "",
  excerpt: "",
  content: "",
  category: "Market Insights",
  tags: "",
  readTimeMinutes: 4,
  published: true,
};

export default function AddBlog() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [coverImage, setCoverImage] = useState("");
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

    if (!coverImage) {
      setError("Upload a cover image.");
      setSubmitting(false);
      return;
    }

    const payload = {
      ...form,
      coverImage,
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
    <AdminShell
      title="Add journal post"
      subtitle="Admin studio"
      actions={<Link to="/admin/dashboard" className="admin-back-link">← Dashboard</Link>}
    >
      <div className="admin-blog-layout">
        <form onSubmit={handleSubmit} className="admin-form">
          <Field label="Title" name="title" value={form.title} onChange={handleChange} required />
          <Field
            label="Excerpt (short summary for cards)"
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            textarea
            required
          />
          <div className="admin-field">
            <label htmlFor="blog-content">Content (use the formatting cheat sheet)</label>
            <textarea
              id="blog-content"
              name="content"
              rows={16}
              value={form.content}
              onChange={handleChange}
              required
              placeholder={"## Why prices have stayed strong\n\nBengaluru stays resilient because of **IT demand**.\n\n### Areas to watch\n\n- North corridor\n- Marathahalli\n- Sarjapur Road"}
            />
            <p className="admin-md-hint">
              Quick: <code>## Heading</code> · <code>### Subheading</code> · <code>**bold**</code> ·{" "}
              <code>*italic*</code> · <code>- bullet</code> · <code>1. numbered</code>
            </p>
          </div>

          <ImageUploader
            label="Cover image"
            value={coverImage ? [coverImage] : []}
            onChange={(url) => setCoverImage(typeof url === "string" ? url : url[0] || "")}
            folder="jpgroup/blogs"
          />

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Category" name="category" value={form.category} onChange={handleChange} />
            <Field label="Tags" name="tags" value={form.tags} onChange={handleChange} placeholder="plots, raipur" />
            <Field label="Read time (min)" name="readTimeMinutes" value={form.readTimeMinutes} onChange={handleChange} type="number" />
          </div>

          <label className="admin-check">
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
            Publish immediately
          </label>

          {error && <p className="admin-error">{error}</p>}

          <button type="submit" disabled={submitting} className="admin-btn-primary self-start">
            {submitting ? "Saving…" : "Publish post"}
          </button>
        </form>

        <div className="admin-blog-aside">
          <MarkdownCheatSheet />
        </div>
      </div>
    </AdminShell>
  );
}

function Field({ label, textarea, rows = 3, ...props }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {textarea ? <textarea rows={rows} {...props} /> : <input {...props} />}
    </div>
  );
}
