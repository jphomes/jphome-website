import React, { useState } from "react";
import api from "../api/axios.js";

/**
 * Uploads one or more images via /api/upload (Cloudinary).
 * Calls onChange with an array of HTTPS URLs.
 */
export default function ImageUploader({
  value = [],
  onChange,
  multiple = false,
  folder = "jpgroup",
  label = "Images",
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const urls = Array.isArray(value) ? value : value ? [value] : [];

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    setError("");
    setUploading(true);

    try {
      let next = [...urls];

      if (multiple) {
        const formData = new FormData();
        files.forEach((f) => formData.append("images", f));
        formData.append("folder", folder);
        const { data } = await api.post("/upload/many", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        next = [...next, ...(data.urls || [])];
      } else {
        const formData = new FormData();
        formData.append("image", files[0]);
        formData.append("folder", folder);
        const { data } = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        next = [data.url];
      }

      onChange(multiple ? next : next[0] || "");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Check Cloudinary env vars.");
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (index) => {
    const next = urls.filter((_, i) => i !== index);
    onChange(multiple ? next : next[0] || "");
  };

  return (
    <div className="space-y-3">
      <label className="text-xs tracking-widest2 uppercase text-ink/50">{label}</label>

      <div className="flex flex-wrap gap-3">
        {urls.map((url, i) => (
          <div key={`${url}-${i}`} className="relative w-24 h-24 rounded-xl overflow-hidden border border-ink/10">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 bg-black/60 text-white text-xs w-6 h-6 rounded-full"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <label className="inline-flex items-center gap-2 cursor-pointer bg-mint/80 text-primary text-sm font-semibold px-4 py-2.5 rounded-xl border border-secondary/20 hover:bg-mint">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFiles}
          className="hidden"
          disabled={uploading}
        />
        {uploading ? "Uploading…" : multiple ? "Upload images" : "Upload image"}
      </label>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      <p className="text-xs text-muted">JPG/PNG/WebP up to 8 MB. Stored on Cloudinary.</p>
    </div>
  );
}
