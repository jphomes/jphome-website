import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const initial = {
  title: "",
  description: "",
  price: "",
  priceLabel: "",
  status: "For Sale",
  propertyType: "Apartment",
  city: "",
  area: "",
  address: "",
  sqft: "",
  bedrooms: "",
  bathrooms: "",
  parking: "",
  amenities: "",
  images: "",
  featured: false,
};

export default function AddProperty() {
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

    const images = form.images.split(",").map((s) => s.trim()).filter(Boolean);
    if (images.length === 0) {
      setError("Add at least one image URL.");
      setSubmitting(false);
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price) || 0,
      priceLabel: form.priceLabel || undefined,
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
      images,
      coverImage: images[0],
      featured: form.featured,
    };

    try {
      await api.post("/properties", payload);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save property.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone/30 pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-0">
        <p className="text-brass text-xs tracking-widest2 uppercase mb-2">Admin Panel</p>
        <h1 className="font-display text-3xl text-ink mb-8">Add Property</h1>

        <form onSubmit={handleSubmit} className="bg-white/70 border border-ink/10 p-8 space-y-6">
          <Field label="Title" name="title" value={form.title} onChange={handleChange} required />
          <Field label="Description" name="description" value={form.description} onChange={handleChange} textarea required />

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Price (numeric, INR)" name="price" value={form.price} onChange={handleChange} type="number" />
            <Field label="Price Label (optional override)" name="priceLabel" value={form.priceLabel} onChange={handleChange} />
            <Select label="Status" name="status" value={form.status} onChange={handleChange} options={["For Sale", "For Rent", "Sold", "Rented"]} />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Select label="Type" name="propertyType" value={form.propertyType} onChange={handleChange} options={["Apartment", "Villa", "Bungalow", "Plot", "Commercial", "Penthouse"]} />
            <Field label="City" name="city" value={form.city} onChange={handleChange} required />
            <Field label="Area / Locality" name="area" value={form.area} onChange={handleChange} required />
          </div>

          <Field label="Full Address (optional)" name="address" value={form.address} onChange={handleChange} />

          <div className="grid sm:grid-cols-4 gap-4">
            <Field label="Sq.Ft" name="sqft" value={form.sqft} onChange={handleChange} type="number" required />
            <Field label="Bedrooms" name="bedrooms" value={form.bedrooms} onChange={handleChange} type="number" />
            <Field label="Bathrooms" name="bathrooms" value={form.bathrooms} onChange={handleChange} type="number" />
            <Field label="Parking" name="parking" value={form.parking} onChange={handleChange} type="number" />
          </div>

          <Field label="Amenities (comma-separated)" name="amenities" value={form.amenities} onChange={handleChange} placeholder="Pool, Gym, 24x7 Security" />
          <Field
            label="Image URLs (comma-separated, first = cover image)"
            name="images"
            value={form.images}
            onChange={handleChange}
            textarea
            required
            placeholder="https://images.unsplash.com/..., https://images.unsplash.com/..."
          />

          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
            Feature this property on the homepage
          </label>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-charcoal text-stone text-sm tracking-widest2 uppercase px-8 py-3 hover:bg-brassdark disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Publish Property"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, textarea, ...props }) {
  return (
    <div>
      <label className="text-xs tracking-widest2 uppercase text-ink/50">{label}</label>
      {textarea ? (
        <textarea rows={3} {...props} className="mt-1 w-full bg-transparent border-b border-ink/20 focus:border-brass py-2 outline-none resize-none" />
      ) : (
        <input {...props} className="mt-1 w-full bg-transparent border-b border-ink/20 focus:border-brass py-2 outline-none" />
      )}
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="text-xs tracking-widest2 uppercase text-ink/50">{label}</label>
      <select {...props} className="mt-1 w-full bg-transparent border-b border-ink/20 focus:border-brass py-2 outline-none">
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
