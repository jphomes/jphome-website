import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api/axios.js";
import ImageUploader from "../../components/ImageUploader.jsx";
import BrochureUploader from "../../components/BrochureUploader.jsx";
import AdminShell from "../../components/AdminShell.jsx";
import { PROPERTY_TYPES } from "../../config/propertyTypes.js";
import { getYoutubeEmbedId } from "../../utils/youtube.js";
import { withRupee } from "../../utils/property.js";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  priceLabel: "",
  status: "For Sale",
  propertyType: "Land Parcel",
  city: "Raipur",
  area: "",
  address: "",
  sqft: "",
  bedrooms: "",
  bathrooms: "",
  parking: "",
  amenities: "",
  landmarksText: "",
  youtubeUrl: "",
  featured: false,
  reraApproved: false,
  reraNumber: "",
};

function landmarksToText(list = []) {
  return list
    .map((l) => (l.distance ? `${l.name} (${l.distance})` : l.name))
    .filter(Boolean)
    .join("\n");
}

function parseLandmarks(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(.*)\(([^)]+)\)\s*$/);
      if (match) {
        return { name: match[1].trim(), distance: match[2].trim() };
      }
      return { name: line, distance: "" };
    });
}

function propertyToForm(p) {
  return {
    title: p.title || "",
    description: p.description || "",
    price: p.price ?? "",
    priceLabel: p.priceLabel || "",
    status: p.status || "For Sale",
    propertyType: p.propertyType || "Land Parcel",
    city: p.location?.city || "Raipur",
    area: p.location?.area || "",
    address: p.location?.address || "",
    sqft: p.specs?.sqft ?? "",
    bedrooms: p.specs?.bedrooms ?? "",
    bathrooms: p.specs?.bathrooms ?? "",
    parking: p.specs?.parking ?? "",
    amenities: (p.amenities || []).join(", "),
    landmarksText: landmarksToText(p.nearbyLandmarks || []),
    youtubeUrl: p.youtubeUrl || "",
    featured: Boolean(p.featured),
    reraApproved: Boolean(p.reraApproved),
    reraNumber: p.reraNumber || "",
  };
}

export default function PropertyFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [brochureUrl, setBrochureUrl] = useState("");
  const [brochurePublicId, setBrochurePublicId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    api
      .get(`/properties/admin/${id}`)
      .then((res) => {
        setForm(propertyToForm(res.data));
        setImages(res.data.images || []);
        setBrochureUrl(res.data.brochureUrl || "");
        setBrochurePublicId(res.data.brochurePublicId || "");
      })
      .catch(() => setError("Could not load property."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (images.length === 0) {
      setError("Upload at least one image.");
      setSubmitting(false);
      return;
    }

    if (form.youtubeUrl && !getYoutubeEmbedId(form.youtubeUrl)) {
      setError("Enter a valid YouTube link (watch, youtu.be, shorts, or embed).");
      setSubmitting(false);
      return;
    }

    const typeOptions = PROPERTY_TYPES.includes(form.propertyType)
      ? PROPERTY_TYPES
      : [...PROPERTY_TYPES, form.propertyType];

    if (!typeOptions.includes(form.propertyType)) {
      setError("Choose a valid property type.");
      setSubmitting(false);
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price) || 0,
      priceLabel: form.priceLabel ? withRupee(form.priceLabel) : undefined,
      status: form.status,
      propertyType: form.propertyType,
      location: { city: form.city, area: form.area, address: form.address },
      specs: {
        sqft: Number(form.sqft) || 0,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        parking: Number(form.parking) || 0,
      },
      amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
      nearbyLandmarks: parseLandmarks(form.landmarksText),
      images,
      coverImage: images[0],
      brochureUrl: brochureUrl || "",
      brochurePublicId: brochurePublicId || "",
      youtubeUrl: form.youtubeUrl.trim(),
      featured: form.featured,
      reraApproved: form.reraApproved,
      reraNumber: form.reraNumber || undefined,
    };

    try {
      if (isEdit) await api.put(`/properties/${id}`, payload);
      else await api.post("/properties", payload);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save property.");
    } finally {
      setSubmitting(false);
    }
  };

  const typeSelectOptions = PROPERTY_TYPES.includes(form.propertyType)
    ? PROPERTY_TYPES
    : [...PROPERTY_TYPES, form.propertyType];

  if (loading) {
    return (
      <AdminShell title="Loading…" subtitle="Admin studio" narrow>
        <p className="admin-empty">Fetching property details…</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title={isEdit ? "Edit property" : "Add property"}
      subtitle="Admin studio"
      narrow
      actions={<Link to="/admin/dashboard" className="admin-back-link">← Dashboard</Link>}
    >
      <form onSubmit={handleSubmit} className="admin-form">
        <Field label="Title" name="title" value={form.title} onChange={handleChange} required />
        <Field label="Description" name="description" value={form.description} onChange={handleChange} textarea required />

        <div className="grid sm:grid-cols-3 gap-4">
          <Field
            label="Price (₹ INR)"
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            placeholder="e.g. 2500000"
          />
          <Field
            label="Price label (shown on site)"
            name="priceLabel"
            value={form.priceLabel}
            onChange={handleChange}
            placeholder="e.g. ₹25 L onwards"
          />
          <Select label="Status" name="status" value={form.status} onChange={handleChange} options={["For Sale", "For Rent", "Sold", "Rented"]} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Select label="Type" name="propertyType" value={form.propertyType} onChange={handleChange} options={typeSelectOptions} />
          <Field label="City" name="city" value={form.city} onChange={handleChange} required />
          <Field label="Area / locality" name="area" value={form.area} onChange={handleChange} required />
        </div>

        <Field label="Full address" name="address" value={form.address} onChange={handleChange} />

        <div className="grid sm:grid-cols-4 gap-4">
          <Field label="Sq.Ft" name="sqft" value={form.sqft} onChange={handleChange} type="number" required />
          <Field label="Bedrooms" name="bedrooms" value={form.bedrooms} onChange={handleChange} type="number" />
          <Field label="Bathrooms" name="bathrooms" value={form.bathrooms} onChange={handleChange} type="number" />
          <Field label="Parking" name="parking" value={form.parking} onChange={handleChange} type="number" />
        </div>

        <Field label="Amenities (comma-separated)" name="amenities" value={form.amenities} onChange={handleChange} placeholder="Pool, Gym, 24x7 Security" />

        <div className="admin-field">
          <label>Nearby landmarks (one per line)</label>
          <textarea
            name="landmarksText"
            rows={4}
            value={form.landmarksText}
            onChange={handleChange}
            placeholder={"Airport (12 km)\nCity Mall (3 km)\nAIIMS Raipur (8 km)"}
          />
          <p className="text-xs text-muted mt-1">Tip: add distance in brackets, e.g. School (2 km)</p>
        </div>

        <Field label="YouTube URL" name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=…" />

        <ImageUploader
          label="Property images (first = cover)"
          value={images}
          onChange={setImages}
          multiple
          folder="jpgroup/properties"
        />

        <BrochureUploader
          value={brochureUrl}
          publicId={brochurePublicId}
          onChange={({ url, publicId }) => {
            setBrochureUrl(url);
            setBrochurePublicId(publicId);
          }}
        />

        <div className="flex flex-wrap gap-5">
          <label className="admin-check">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
            Feature on homepage
          </label>
          <label className="admin-check">
            <input type="checkbox" name="reraApproved" checked={form.reraApproved} onChange={handleChange} />
            RERA approved
          </label>
        </div>

        {form.reraApproved && (
          <Field label="RERA number" name="reraNumber" value={form.reraNumber} onChange={handleChange} />
        )}

        {error && <p className="admin-error">{error}</p>}

        <button type="submit" disabled={submitting} className="admin-btn-primary self-start">
          {submitting ? "Saving…" : isEdit ? "Save changes" : "Publish property"}
        </button>
      </form>
    </AdminShell>
  );
}

function Field({ label, textarea, ...props }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {textarea ? <textarea rows={3} {...props} /> : <input {...props} />}
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      <select {...props}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
