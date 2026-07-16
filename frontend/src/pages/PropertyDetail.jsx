import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiDownload, FiMapPin } from "react-icons/fi";
import api from "../api/axios.js";
import PropertyCard from "../components/PropertyCard.jsx";
import WhatsAppButton from "../components/WhatsAppButton.jsx";
import WhatsAppPreview from "../components/WhatsAppPreview.jsx";
import YoutubeEmbed from "../components/YoutubeEmbed.jsx";
import PropertyGallery from "../components/PropertyGallery.jsx";
import { formatPrice, formatLocation } from "../utils/property.js";
import { buildPropertyWhatsAppMessage } from "../utils/whatsapp.js";
import { getYoutubeEmbedUrl } from "../utils/youtube.js";
import { downloadBrochure, getBrochureDownloadApiUrl, getBrochureUrl } from "../utils/brochure.js";

const DISTRICT = import.meta.env.VITE_DISTRICT_NAME || "Raipur";

export default function PropertyDetail() {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [related, setRelated] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setProperty(null);
    setNotFound(false);
    api
      .get(`/properties/${slug}`)
      .then((res) => {
        setProperty(res.data.property);
        setRelated(res.data.related);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="py-16 text-center px-4">
        <p className="font-semibold text-forest">Property not found.</p>
        <Link to="/properties" className="text-leaf text-sm font-medium mt-3 inline-block">← Back</Link>
      </div>
    );
  }

  if (!property) {
    return <div className="py-16 text-center text-sm text-ink/40">Loading…</div>;
  }

  const {
    title,
    images,
    coverImage,
    location,
    specs,
    status,
    propertyType,
    description,
    amenities,
    nearbyLandmarks,
    brochureUrl,
    reraApproved,
    reraNumber,
    youtubeUrl,
  } = property;
  const gallery = images?.length ? images : [coverImage];
  const whatsappMessage = buildPropertyWhatsAppMessage(property);
  const landmarks = (nearbyLandmarks || []).filter((l) => l?.name);
  const brochureHref = getBrochureUrl(brochureUrl);
  const brochureApiUrl = getBrochureDownloadApiUrl(slug);

  const handleBrochureDownload = (e) => {
    e.preventDefault();
    const safeName = `${(title || "brochure").replace(/[^\w\-]+/g, "_").slice(0, 40)}.pdf`;
    // Prefer backend proxy — Cloudinary image/upload + fl_attachment returns HTTP 400
    downloadBrochure(brochureApiUrl || brochureHref, safeName);
  };

  return (
    <div className="pb-24 md:pb-8">
      <div className="page-wrap pt-4 md:pt-8">
        <PropertyGallery
          images={gallery}
          title={title}
          badges={
            <div className="flex gap-2 mb-2 flex-wrap">
              <span className="badge-brass">{status}</span>
              <span className="badge-muted">{propertyType}</span>
              {reraApproved && <span className="rera-badge">RERA Approved</span>}
            </div>
          }
          overlayTitle={<h1 className="text-white text-xl md:text-3xl font-semibold leading-tight">{title}</h1>}
        />

        {brochureHref && (
          <button
            type="button"
            onClick={handleBrochureDownload}
            className="brochure-download-btn"
          >
            <span className="brochure-download-icon">
              <FiDownload size={20} />
            </span>
            <span className="brochure-download-copy">
              <strong>Download brochure</strong>
              <em>PDF · project details & layout</em>
            </span>
            <span className="brochure-download-cta">Get PDF</span>
          </button>
        )}

        <div className="detail-layout mt-6">
          <div className="space-y-6">
            {reraNumber && (
              <p className="text-xs text-muted">RERA: <span className="font-mono text-primary">{reraNumber}</span></p>
            )}
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-muted flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" />
                </svg>
                {formatLocation(location)}, {DISTRICT}
              </p>
              <p className="text-lg md:text-2xl font-bold text-secondary shrink-0">{formatPrice(property)}</p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                ["Sq.Ft", specs.sqft?.toLocaleString("en-IN")],
                ["Beds", specs.bedrooms],
                ["Baths", specs.bathrooms],
                ["Park", specs.parking],
              ].map(([label, val]) => (
                <div key={label} className="spec-tile text-center py-2.5">
                  <p className="text-sm font-semibold text-forest">{val ?? "—"}</p>
                  <p className="text-[9px] uppercase text-ink/40 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <div>
              <h2 className="section-title">Overview</h2>
              <p className="text-sm text-ink/70 leading-relaxed">{description}</p>
            </div>

            {amenities?.length > 0 && (
              <div>
                <h2 className="section-title">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a) => <span key={a} className="amenity-pill">{a}</span>)}
                </div>
              </div>
            )}

            {landmarks.length > 0 && (
              <div>
                <h2 className="section-title">Nearby landmarks</h2>
                <ul className="landmark-list">
                  {landmarks.map((l) => (
                    <li key={`${l.name}-${l.distance || ""}`} className="landmark-item">
                      <FiMapPin className="landmark-icon" size={16} />
                      <span className="landmark-name">{l.name}</span>
                      {l.distance ? <span className="landmark-distance">{l.distance}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {getYoutubeEmbedUrl(youtubeUrl) && (
              <YoutubeEmbed url={youtubeUrl} title={`${title} video tour`} />
            )}
          </div>

          <aside id="enquire" className="scroll-mt-28">
            <div className="sidebar-panel bg-mint/40 md:sticky md:top-24">
              <h2 className="section-title !mb-2">Enquire on WhatsApp</h2>
              <WhatsAppPreview message={whatsappMessage} />
              <div className="mt-4">
                <WhatsAppButton message={whatsappMessage} label="Enquire on WhatsApp" fullWidth />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <div className="page-wrap mt-8 md:mt-12 pb-4">
          <h2 className="section-title">Similar {propertyType} projects</h2>
          <p className="text-sm text-muted mb-4 -mt-2">Matching type: {propertyType}</p>
          <div className="properties-grid space-y-3">
            {related.slice(0, 3).map((p) => <PropertyCard key={p._id} property={p} />)}
          </div>
        </div>
      )}

      <div className="mobile-sticky-wa fixed bottom-[4.5rem] left-0 right-0 px-4 z-30 safe-bottom">
        <WhatsAppButton message={whatsappMessage} label="Enquire on WhatsApp" fullWidth />
      </div>
    </div>
  );
}
