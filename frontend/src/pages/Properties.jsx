import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import PropertyCard from "../components/PropertyCard.jsx";
import Pagination from "../components/Pagination.jsx";
import { PROPERTY_TYPES } from "../config/propertyTypes.js";

const PAGE_SIZE = 10;

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: "",
    propertyType: "",
    status: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    rera: "",
  });

  const fetchProperties = (targetPage = 1, nextFilters = filters) => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const params = { page: targetPage, limit: PAGE_SIZE };
    Object.entries(nextFilters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    api
      .get("/properties", { params })
      .then((res) => {
        setProperties(res.data.properties);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
        setPage(res.data.page);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProperties(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputClass = "w-full bg-cream border border-sage rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-secondary";

  return (
    <div className="page-wrap py-6 md:py-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-4xl text-primary font-semibold">Projects & Listings</h1>
        <p className="text-muted text-sm mt-2">Filter by type — residential, commercial, land & more</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchProperties(1);
        }}
        className="filter-panel mb-6 space-y-3"
      >
        <input
          placeholder="Search by project name or location…"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          className={inputClass}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <select
            value={filters.propertyType}
            onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
            className={inputClass}
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={filters.rera}
            onChange={(e) => setFilters({ ...filters, rera: e.target.value })}
            className={inputClass}
          >
            <option value="">RERA Status</option>
            <option value="true">RERA Approved</option>
          </select>
          <input
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className={inputClass}
          />
          <input
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                const next = {
                  ...filters,
                  propertyType: filters.propertyType === t ? "" : t,
                };
                setFilters(next);
                fetchProperties(1, next);
              }}
              className={`type-chip ${filters.propertyType === t ? "type-chip-active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Min sq.ft"
            value={filters.minArea}
            onChange={(e) => setFilters({ ...filters, minArea: e.target.value })}
            className={inputClass}
          />
          <input
            placeholder="Max sq.ft"
            value={filters.maxArea}
            onChange={(e) => setFilters({ ...filters, maxArea: e.target.value })}
            className={inputClass}
          />
        </div>
        <button type="submit" className="btn-primary w-full md:w-auto">Search Listings</button>
      </form>

      {loading ? (
        <div className="properties-grid space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 bg-mint rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <p className="text-sm text-muted text-center py-12">No properties found.</p>
      ) : (
        <>
          <p className="text-xs text-muted mb-4">
            {total} projects · Newest first · Page {page}/{totalPages}
          </p>
          <div className="properties-grid space-y-3">
            {properties.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={fetchProperties} />
        </>
      )}
    </div>
  );
}
