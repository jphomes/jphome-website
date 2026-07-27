import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import PropertyCard from "../components/PropertyCard.jsx";
import Pagination from "../components/Pagination.jsx";
import { PROPERTY_TYPES } from "../config/propertyTypes.js";

const PAGE_SIZE = 10;

const emptyFilters = {
  q: "",
  propertyType: "",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
};

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(emptyFilters);

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

  const setField = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    fetchProperties(1, emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="page-wrap py-6 md:py-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-4xl text-primary font-semibold">
          Projects & Listings
        </h1>
        <p className="text-muted text-sm mt-2">
          Find plots, flats, commercial spaces & land across Raipur
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchProperties(1);
        }}
        className="filter-panel filter-panel--listings mb-6"
      >
        <div className="filter-search">
          <label htmlFor="filter-q" className="filter-label">
            Search
          </label>
          <input
            id="filter-q"
            placeholder="Project name or location…"
            value={filters.q}
            onChange={(e) => setField("q", e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-grid">
          <div className="filter-field">
            <label htmlFor="filter-type" className="filter-label">
              Property type
            </label>
            <div className="filter-select-wrap">
              <select
                id="filter-type"
                value={filters.propertyType}
                onChange={(e) => setField("propertyType", e.target.value)}
                className="filter-select"
              >
                <option value="">All property types</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-field">
            <label htmlFor="filter-min-price" className="filter-label">
              Min price (₹)
            </label>
            <input
              id="filter-min-price"
              type="number"
              min="0"
              placeholder="e.g. 1000000"
              value={filters.minPrice}
              onChange={(e) => setField("minPrice", e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-field">
            <label htmlFor="filter-max-price" className="filter-label">
              Max price (₹)
            </label>
            <input
              id="filter-max-price"
              type="number"
              min="0"
              placeholder="e.g. 5000000"
              value={filters.maxPrice}
              onChange={(e) => setField("maxPrice", e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-field">
            <label htmlFor="filter-min-area" className="filter-label">
              Min area (sq ft)
            </label>
            <input
              id="filter-min-area"
              type="number"
              min="0"
              placeholder="e.g. 1000"
              value={filters.minArea}
              onChange={(e) => setField("minArea", e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-field">
            <label htmlFor="filter-max-area" className="filter-label">
              Max area (sq ft)
            </label>
            <input
              id="filter-max-area"
              type="number"
              min="0"
              placeholder="e.g. 5000"
              value={filters.maxArea}
              onChange={(e) => setField("maxArea", e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-actions">
          <button type="submit" className="btn-primary filter-submit">
            Search listings
          </button>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="filter-clear">
              Clear filters
            </button>
          )}
        </div>
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
