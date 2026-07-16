/**
 * Force a PDF download in the browser.
 * Prefer the backend proxy URL so Cloudinary transforms / CORS never break it.
 * Falls back to opening the URL if fetch fails.
 */
export async function downloadBrochure(url, filename = "brochure.pdf") {
  if (!url) return;

  try {
    const res = await fetch(url, { mode: "cors", credentials: "omit" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const blob = await res.blob();
    const pdfBlob =
      blob.type === "application/pdf" || blob.type === "application/octet-stream"
        ? blob.type === "application/pdf"
          ? blob
          : new Blob([blob], { type: "application/pdf" })
        : new Blob([blob], { type: "application/pdf" });

    const objectUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

/** API proxy path for a property brochure (avoids broken Cloudinary fl_attachment URLs). */
export function getBrochureDownloadApiUrl(slug) {
  if (!slug) return "";
  const base = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
  return `${base}/properties/${encodeURIComponent(slug)}/brochure`;
}

/** Prefer a clean Cloudinary URL without broken fl_attachment transforms. */
export function getBrochureUrl(url) {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  let cleaned = trimmed.replace(/\/upload\/fl_attachment(?::[^/]+)?\//, "/upload/");
  // Old uploads used image/upload; raw delivery works without the PDF add-on
  if (/\.pdf($|\?)/i.test(cleaned) && cleaned.includes("/image/upload/")) {
    cleaned = cleaned.replace("/image/upload/", "/raw/upload/");
  }
  return cleaned;
}
