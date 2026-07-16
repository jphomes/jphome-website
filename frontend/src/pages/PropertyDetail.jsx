import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import PropertyCard from "../components/PropertyCard.jsx";
import WhatsAppButton from "../components/WhatsAppButton.jsx";
import WhatsAppPreview from "../components/WhatsAppPreview.jsx";
import { formatPrice, formatLocation, formatSpecs } from "../utils/property.js";
import { buildPropertyWhatsAppMessage } from "../utils/whatsapp.js";

const DISTRICT = import.meta.env.VITE_DISTRICT_NAME || "Raipur";

export default function PropertyDetail() {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setProperty(null);
    setNotFound(false);
    setActiveImage(0);
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

  const { title, images, coverImage, location, specs, status, propertyType, description, amenities, reraApproved, reraNumber } = property;
  const gallery = images?.length ? images : [coverImage];
  const whatsappMessage = buildPropertyWhatsAppMessage(property);

  return (
    <div className="pb-24 md:pb-8">
      <div className="page-wrap pt-4 md:pt-8">
        <div className="relative detail-hero-img rounded-2xl md:rounded-xl overflow-hidden h-56 md:h-96 mb-4">
          <img src={gallery[activeImage]} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex gap-2 mb-2">
              <span className="badge-brass">{status}</span>
              <span className="badge-muted">{propertyType}</span>
              {reraApproved && <span className="rera-badge">RERA Approved</span>}
            </div>
            <h1 className="text-white text-xl md:text-3xl font-semibold leading-tight">{title}</h1>
          </div>
        </div>

        {gallery.length > 1 && (
          <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
            {gallery.map((img, i) => (
              <button
                key={img + i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`shrink-0 w-16 h-12 md:w-24 md:h-16 rounded-lg overflow-hidden border-2 ${
                  i === activeImage ? "border-leaf" : "border-transparent opacity-60"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="detail-layout">
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
          </div>

          <aside id="enquire" className="scroll-mt-28">
            <div className="sidebar-panel bg-mint/40 md:sticky md:top-24">
              <h2 className="section-title !mb-2">Enquire on WhatsApp</h2>
              <p className="text-xs text-ink/55 mb-3">
                Pre-filled with this property's details — {formatSpecs(specs)}
              </p>
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
          <h2 className="section-title">Similar Projects</h2>
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
