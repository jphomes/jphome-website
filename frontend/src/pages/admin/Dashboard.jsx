import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";

const TABS = ["Properties", "Blog Posts", "Enquiries"];

export default function Dashboard() {
  const { admin, logout } = useAuth();
  const [tab, setTab] = useState("Properties");
  const [properties, setProperties] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  const loadAll = () => {
    api.get("/properties", { params: { limit: 100 } }).then((r) => setProperties(r.data.properties));
    api.get("/blogs/admin/all").then((r) => setBlogs(r.data));
    api.get("/enquiry").then((r) => setEnquiries(r.data));
  };

  useEffect(loadAll, []);

  const deleteProperty = async (id) => {
    if (!confirm("Delete this property permanently?")) return;
    await api.delete(`/properties/${id}`);
    setProperties((p) => p.filter((x) => x._id !== id));
  };

  const deleteBlog = async (id) => {
    if (!confirm("Delete this blog post permanently?")) return;
    await api.delete(`/blogs/${id}`);
    setBlogs((b) => b.filter((x) => x._id !== id));
  };

  const updateEnquiryStatus = async (id, status) => {
    await api.put(`/enquiry/${id}`, { status });
    setEnquiries((list) => list.map((e) => (e._id === id ? { ...e, status } : e)));
  };

  return (
    <div className="min-h-screen bg-stone/30 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-brass text-xs tracking-widest2 uppercase mb-1">Admin Panel</p>
            <h1 className="font-display text-3xl text-ink">Welcome, {admin?.name || "Tom"}</h1>
          </div>
          <button
            onClick={logout}
            className="text-sm tracking-widest2 uppercase text-ink/50 hover:text-brass"
          >
            Log Out
          </button>
        </div>

        <div className="flex gap-8 border-b border-ink/10 mb-10">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-sm tracking-widest2 uppercase border-b-2 -mb-px ${
                tab === t ? "border-brass text-brassdark" : "border-transparent text-ink/40"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Properties" && (
          <div>
            <div className="flex justify-end mb-6">
              <Link
                to="/admin/properties/new"
                className="bg-charcoal text-stone text-sm tracking-widest2 uppercase px-6 py-2.5 hover:bg-brassdark"
              >
                + Add Property
              </Link>
            </div>
            <div className="bg-white/70 border border-ink/10 divide-y divide-ink/10">
              {properties.map((p) => (
                <div key={p._id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <img src={p.coverImage} alt="" className="w-16 h-12 object-cover" />
                    <div>
                      <p className="font-display text-ink">{p.title}</p>
                      <p className="text-xs text-ink/50 font-mono">
                        {p.location.area}, {p.location.city} · {p.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm tracking-wide uppercase">
                    <Link to={`/properties/${p.slug}`} target="_blank" className="text-ink/50 hover:text-brass">
                      View
                    </Link>
                    <button onClick={() => deleteProperty(p._id)} className="text-red-600/70 hover:text-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {properties.length === 0 && (
                <p className="p-6 text-sm text-ink/40 font-mono">No properties yet.</p>
              )}
            </div>
          </div>
        )}

        {tab === "Blog Posts" && (
          <div>
            <div className="flex justify-end mb-6">
              <Link
                to="/admin/blogs/new"
                className="bg-charcoal text-stone text-sm tracking-widest2 uppercase px-6 py-2.5 hover:bg-brassdark"
              >
                + Add Blog Post
              </Link>
            </div>
            <div className="bg-white/70 border border-ink/10 divide-y divide-ink/10">
              {blogs.map((b) => (
                <div key={b._id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <img src={b.coverImage} alt="" className="w-16 h-12 object-cover" />
                    <div>
                      <p className="font-display text-ink">{b.title}</p>
                      <p className="text-xs text-ink/50 font-mono">
                        {b.category} · {b.published ? "Published" : "Draft"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm tracking-wide uppercase">
                    <Link to={`/blog/${b.slug}`} target="_blank" className="text-ink/50 hover:text-brass">
                      View
                    </Link>
                    <button onClick={() => deleteBlog(b._id)} className="text-red-600/70 hover:text-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && (
                <p className="p-6 text-sm text-ink/40 font-mono">No blog posts yet.</p>
              )}
            </div>
          </div>
        )}

        {tab === "Enquiries" && (
          <div className="bg-white/70 border border-ink/10 divide-y divide-ink/10">
            {enquiries.map((e) => (
              <div key={e._id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-ink">
                      {e.name} <span className="text-ink/40 text-sm">— {e.email}</span>
                    </p>
                    <p className="text-xs text-ink/50 font-mono mt-1">
                      {e.propertyTitle || e.source} · {new Date(e.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <select
                    value={e.status}
                    onChange={(ev) => updateEnquiryStatus(e._id, ev.target.value)}
                    className="text-xs border border-ink/20 px-2 py-1 uppercase tracking-wide"
                  >
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Closed</option>
                  </select>
                </div>
                <p className="text-sm text-ink/70 mt-3">{e.message}</p>
              </div>
            ))}
            {enquiries.length === 0 && (
              <p className="p-6 text-sm text-ink/40 font-mono">No enquiries yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
