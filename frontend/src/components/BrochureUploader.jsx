import React, { useState } from "react";
import api from "../api/axios.js";

/** Upload a single PDF brochure to Cloudinary via /api/upload/brochure */
export default function BrochureUploader({ value = "", publicId = "", onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("brochure", file);
      formData.append("folder", "jpgroup/brochures");
      const { data } = await api.post("/upload/brochure", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange({ url: data.url, publicId: data.publicId });
    } catch (err) {
      setError(err.response?.data?.message || "Brochure upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const clear = () => onChange({ url: "", publicId: "" });

  return (
    <div className="space-y-3">
      <label className="text-xs tracking-widest2 uppercase text-ink/50">Brochure PDF (optional)</label>

      {value ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-secondary/20 bg-mint/50 px-4 py-3">
          <span className="text-sm font-semibold text-primary truncate max-w-[14rem]">PDF attached</span>
          <a href={value} target="_blank" rel="noreferrer" className="admin-link-btn text-xs">
            Preview
          </a>
          <button type="button" onClick={clear} className="admin-danger-btn text-xs">
            Remove
          </button>
        </div>
      ) : (
        <label className="inline-flex items-center gap-2 cursor-pointer bg-mint/80 text-primary text-sm font-semibold px-4 py-2.5 rounded-xl border border-secondary/20 hover:bg-mint">
          <input type="file" accept="application/pdf,.pdf" onChange={handleFile} className="hidden" disabled={uploading} />
          {uploading ? "Uploading PDF…" : "Upload brochure PDF"}
        </label>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
      <p className="text-xs text-muted">PDF up to 15 MB. Stored on Cloudinary and deleted with the property.</p>
      {publicId ? <p className="text-[10px] text-muted font-mono truncate">id: {publicId}</p> : null}
    </div>
  );
}
