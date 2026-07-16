import React, { useState } from "react";
import api from "../api/axios.js";

const isTenDigitPhone = (value) => /^\d{10}$/.test(value);

export default function EnquiryForm({ propertyId, propertyTitle }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: propertyTitle ? `I'm interested in "${propertyTitle}". Please share more details.` : "",
  });
  const [status, setStatus] = useState("idle");
  const [phoneError, setPhoneError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, phone: digits });
      if (digits && !isTenDigitPhone(digits)) {
        setPhoneError("Enter a valid 10-digit mobile number.");
      } else {
        setPhoneError("");
      }
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isTenDigitPhone(form.phone)) {
      setPhoneError("Enter a valid 10-digit mobile number.");
      return;
    }
    setStatus("sending");
    setPhoneError("");
    try {
      await api.post("/enquiry", { ...form, propertyId });
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      const msg = err?.response?.data?.message;
      if (msg && /phone|digit/i.test(msg)) {
        setPhoneError(msg);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    }
  };

  const inputClass = "mt-1 w-full bg-cream border border-sage rounded-xl px-3 py-2.5 text-sm outline-none focus:border-secondary";

  if (status === "sent") {
    return (
      <div className="bg-mint border border-secondary/20 rounded-xl p-6 text-center">
        <p className="font-display text-lg text-primary font-semibold">Enquiry sent!</p>
        <p className="text-sm text-muted mt-1">Our team will reach you within 1 hour.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="field-label">Name</label>
        <input required name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="Your full name" />
      </div>
      <div>
        <label className="field-label">Email</label>
        <input required type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="you@email.com" />
      </div>
      <div>
        <label className="field-label">Phone</label>
        <input
          required
          name="phone"
          type="tel"
          inputMode="numeric"
          pattern="\d{10}"
          maxLength={10}
          value={form.phone}
          onChange={handleChange}
          className={inputClass}
          placeholder="10-digit mobile number"
          aria-invalid={Boolean(phoneError)}
        />
        {phoneError && <p className="text-sm text-red-600 mt-1">{phoneError}</p>}
      </div>
      <div>
        <label className="field-label">Message</label>
        <textarea required rows={4} name="message" value={form.message} onChange={handleChange} className={`${inputClass} resize-none`} placeholder="Tell us about your requirements…" />
      </div>
      {status === "error" && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}
      <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:opacity-50">
        {status === "sending" ? "Sending…" : "Submit Enquiry"}
      </button>
    </form>
  );
}
