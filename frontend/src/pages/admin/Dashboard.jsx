import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import api from "../../api/axios.js";
import AdminShell from "../../components/AdminShell.jsx";
import Pagination from "../../components/Pagination.jsx";

const TABS = [
  { key: "Properties", label: "Properties" },
  { key: "Blog Posts", label: "Journal" },
  { key: "Enquiries", label: "Enquiries" },
];

const ENQUIRY_FILTERS = [
  { key: "all", label: "All" },
  { key: "New", label: "New" },
  { key: "Pending", label: "Pending" },
  { key: "Resolved", label: "Resolved" },
];

const PAGE_SIZE = 10;

function statusBadgeClass(status) {
  if (status === "New") return "admin-status-badge admin-status-badge--new";
  if (status === "Pending") return "admin-status-badge admin-status-badge--pending";
  return "admin-status-badge admin-status-badge--resolved";
}

export default function Dashboard() {
  const [tab, setTab] = useState("Properties");
  const [properties, setProperties] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [enquiryCounts, setEnquiryCounts] = useState({ all: 0, New: 0, Pending: 0, Resolved: 0 });
  const [enquiryFilter, setEnquiryFilter] = useState("all");
  const [openEnquiryId, setOpenEnquiryId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [propertyPage, setPropertyPage] = useState(1);
  const [propertyTotalPages, setPropertyTotalPages] = useState(1);
  const [propertyTotal, setPropertyTotal] = useState(0);

  const [blogPage, setBlogPage] = useState(1);
  const [blogTotalPages, setBlogTotalPages] = useState(1);
  const [blogTotal, setBlogTotal] = useState(0);

  const [enquiryPage, setEnquiryPage] = useState(1);
  const [enquiryTotalPages, setEnquiryTotalPages] = useState(1);

  const loadProperties = useCallback((page = 1) => {
    return api
      .get("/properties", { params: { page, limit: PAGE_SIZE } })
      .then((r) => {
        setProperties(r.data.properties || []);
        setPropertyPage(r.data.page || page);
        setPropertyTotalPages(r.data.totalPages || 1);
        setPropertyTotal(r.data.total || 0);
      });
  }, []);

  const loadBlogs = useCallback((page = 1) => {
    return api
      .get("/blogs/admin/all", { params: { page, limit: PAGE_SIZE } })
      .then((r) => {
        const data = r.data;
        if (Array.isArray(data)) {
          setBlogs(data);
          setBlogPage(1);
          setBlogTotalPages(1);
          setBlogTotal(data.length);
          return;
        }
        setBlogs(data.blogs || []);
        setBlogPage(data.page || page);
        setBlogTotalPages(data.totalPages || 1);
        setBlogTotal(data.total || 0);
      });
  }, []);

  const loadEnquiries = useCallback((status = "all", page = 1) => {
    const params = { page, limit: PAGE_SIZE };
    if (status && status !== "all") params.status = status;
    return api.get("/enquiry", { params }).then((r) => {
      const data = r.data;
      if (Array.isArray(data)) {
        setEnquiries(data);
        setEnquiryCounts({
          all: data.length,
          New: data.filter((e) => e.status === "New").length,
          Pending: data.filter((e) => e.status === "Pending").length,
          Resolved: data.filter((e) => e.status === "Resolved").length,
        });
        setEnquiryPage(1);
        setEnquiryTotalPages(1);
        return;
      }
      setEnquiries(data.enquiries || []);
      setEnquiryCounts(data.counts || { all: 0, New: 0, Pending: 0, Resolved: 0 });
      setEnquiryPage(data.page || page);
      setEnquiryTotalPages(data.totalPages || 1);
    });
  }, []);

  useEffect(() => {
    loadProperties(1);
    loadBlogs(1);
    loadEnquiries("all", 1);
  }, [loadProperties, loadBlogs, loadEnquiries]);

  useEffect(() => {
    if (tab !== "Enquiries") return;
    setEnquiryPage(1);
    loadEnquiries(enquiryFilter, 1);
  }, [tab, enquiryFilter, loadEnquiries]);

  const deleteProperty = async (id) => {
    if (!confirm("Delete this property permanently? Images will also be removed from Cloudinary.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/properties/${id}`);
      const nextLen = properties.length - 1;
      const nextPage = nextLen === 0 && propertyPage > 1 ? propertyPage - 1 : propertyPage;
      await loadProperties(nextPage);
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete property.");
    } finally {
      setDeletingId(null);
    }
  };

  const deleteBlog = async (id) => {
    if (!confirm("Delete this blog post permanently?")) return;
    await api.delete(`/blogs/${id}`);
    const nextLen = blogs.length - 1;
    const nextPage = nextLen === 0 && blogPage > 1 ? blogPage - 1 : blogPage;
    await loadBlogs(nextPage);
  };

  const updateEnquiryStatus = async (id, status) => {
    const { data } = await api.put(`/enquiry/${id}`, { status });
    setEnquiries((list) => list.map((e) => (e._id === id ? data : e)));
    loadEnquiries(enquiryFilter, enquiryPage);
  };

  const openEnquiry = async (enquiry) => {
    const nextOpen = openEnquiryId === enquiry._id ? null : enquiry._id;
    setOpenEnquiryId(nextOpen);

    if (nextOpen && enquiry.status === "New") {
      try {
        const { data } = await api.post(`/enquiry/${enquiry._id}/read`);
        setEnquiries((list) => list.map((e) => (e._id === enquiry._id ? data : e)));
        loadEnquiries(enquiryFilter, enquiryPage);
      } catch {
        // ignore — still show the message
      }
    }
  };

  const counts = {
    Properties: propertyTotal,
    "Blog Posts": blogTotal,
    Enquiries: enquiryCounts.all,
  };

  return (
    <AdminShell
      title="Dashboard"
      subtitle="Admin studio"
      actions={
        tab === "Properties" ? (
          <Link to="/admin/properties/new" className="admin-btn-primary">+ Add property</Link>
        ) : tab === "Blog Posts" ? (
          <Link to="/admin/blogs/new" className="admin-btn-primary">+ Add journal post</Link>
        ) : null
      }
    >
      <div className="admin-stats">
        <div className="admin-stat">
          <p className="admin-stat-value">{propertyTotal}</p>
          <p className="admin-stat-label">Properties</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-value">{blogTotal}</p>
          <p className="admin-stat-label">Journal</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-value">{enquiryCounts.New || 0}</p>
          <p className="admin-stat-label">New leads</p>
        </div>
      </div>

      <div className="admin-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`admin-tab ${tab === t.key ? "admin-tab-active" : ""}`}
          >
            {t.label}
            <span className="admin-tab-count">{counts[t.key]}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28 }}
          className="admin-panel"
        >
          {tab === "Properties" && (
            <>
              <div className="admin-panel-head">
                <h2>Property inventory</h2>
                <Link to="/admin/properties/new" className="admin-link-btn admin-link-btn-strong">New</Link>
              </div>
              {properties.map((p) => (
                <div key={p._id} className="admin-row">
                  <div className="admin-row-main">
                    <img src={p.coverImage} alt="" className="admin-thumb" />
                    <div className="min-w-0">
                      <p className="admin-row-title truncate">{p.title}</p>
                      <p className="admin-row-meta">
                        {p.location?.area}, {p.location?.city} · {p.status}
                        {p.featured ? " · Featured" : ""}
                        {p.youtubeUrl ? " · Video" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="admin-row-actions">
                    <Link to={`/properties/${p.slug}`} target="_blank" className="admin-link-btn">View</Link>
                    <Link to={`/admin/properties/${p._id}/edit`} className="admin-link-btn admin-link-btn-strong">Edit</Link>
                    <button
                      type="button"
                      disabled={deletingId === p._id}
                      onClick={() => deleteProperty(p._id)}
                      className="admin-danger-btn"
                    >
                      {deletingId === p._id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
              {properties.length === 0 ? (
                <div className="admin-empty">
                  <strong>No properties yet</strong>
                  Publish your first project to populate the site.
                </div>
              ) : (
                <Pagination
                  page={propertyPage}
                  totalPages={propertyTotalPages}
                  onPageChange={loadProperties}
                  compact
                />
              )}
            </>
          )}

          {tab === "Blog Posts" && (
            <>
              <div className="admin-panel-head">
                <h2>Journal posts</h2>
                <Link to="/admin/blogs/new" className="admin-link-btn admin-link-btn-strong">New</Link>
              </div>
              {blogs.map((b) => (
                <div key={b._id} className="admin-row">
                  <div className="admin-row-main">
                    <img src={b.coverImage} alt="" className="admin-thumb" />
                    <div className="min-w-0">
                      <p className="admin-row-title truncate">{b.title}</p>
                      <p className="admin-row-meta">
                        {b.category} · {b.published ? "Published" : "Draft"}
                      </p>
                    </div>
                  </div>
                  <div className="admin-row-actions">
                    <Link to={`/blog/${b.slug}`} target="_blank" className="admin-link-btn">View</Link>
                    <button type="button" onClick={() => deleteBlog(b._id)} className="admin-danger-btn">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {blogs.length === 0 ? (
                <div className="admin-empty">
                  <strong>No journal posts</strong>
                  Share market insights and project stories.
                </div>
              ) : (
                <Pagination
                  page={blogPage}
                  totalPages={blogTotalPages}
                  onPageChange={loadBlogs}
                  compact
                />
              )}
            </>
          )}

          {tab === "Enquiries" && (
            <>
              <div className="admin-panel-head admin-panel-head--stack">
                <div>
                  <h2>Enquiries</h2>
                  <p className="admin-panel-sub">
                    Submit → <strong>New</strong> · Open/read → <strong>Pending</strong> · Done → <strong>Resolved</strong>
                  </p>
                </div>
                <div className="admin-filter-pills" role="group" aria-label="Filter enquiries">
                  {ENQUIRY_FILTERS.map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setEnquiryFilter(f.key)}
                      className={`admin-filter-pill ${enquiryFilter === f.key ? "is-active" : ""}`}
                    >
                      {f.label}
                      <span>{enquiryCounts[f.key] ?? 0}</span>
                    </button>
                  ))}
                </div>
              </div>

              {enquiries.map((e) => {
                const isOpen = openEnquiryId === e._id;
                return (
                  <div key={e._id} className={`admin-enquiry ${isOpen ? "is-open" : ""} ${e.status === "New" ? "is-unread" : ""}`}>
                    <button type="button" className="admin-enquiry-trigger" onClick={() => openEnquiry(e)}>
                      <div className="admin-enquiry-top">
                        <div className="min-w-0 text-left">
                          <p className="admin-row-title">
                            {e.name}{" "}
                            <span className="text-sm font-body font-normal text-[#6a7a72]">— {e.email}</span>
                          </p>
                          <p className="admin-row-meta">
                            {e.propertyTitle || e.source}
                            {e.phone ? ` · ${e.phone}` : ""}
                            {" · "}
                            {new Date(e.createdAt).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <span className={statusBadgeClass(e.status)}>{e.status}</span>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="admin-enquiry-body">
                        <p className="admin-enquiry-msg">{e.message}</p>
                        <div className="admin-enquiry-actions">
                          <label className="admin-enquiry-status-label">
                            Status
                            <select
                              value={e.status}
                              onChange={(ev) => updateEnquiryStatus(e._id, ev.target.value)}
                              className="admin-select"
                            >
                              <option value="New">New</option>
                              <option value="Pending">Pending</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </label>
                          {e.status !== "Resolved" && (
                            <button
                              type="button"
                              className="admin-link-btn admin-link-btn-strong"
                              onClick={() => updateEnquiryStatus(e._id, "Resolved")}
                            >
                              Mark resolved
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {enquiries.length === 0 ? (
                <div className="admin-empty">
                  <strong>No enquiries here</strong>
                  {enquiryFilter === "all"
                    ? "New form submissions will appear with status New."
                    : `Nothing in “${enquiryFilter}” right now.`}
                </div>
              ) : (
                <Pagination
                  page={enquiryPage}
                  totalPages={enquiryTotalPages}
                  onPageChange={(p) => loadEnquiries(enquiryFilter, p)}
                  compact
                />
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </AdminShell>
  );
}
