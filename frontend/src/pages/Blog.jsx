import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import BlogCard from "../components/BlogCard.jsx";
import Pagination from "../components/Pagination.jsx";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = (targetPage = 1) => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    api
      .get("/blogs", { params: { page: targetPage, limit: 6 } })
      .then((res) => {
        setBlogs(res.data.blogs);
        setTotalPages(res.data.totalPages);
        setPage(res.data.page);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlogs(1);
  }, []);

  return (
    <div className="page-wrap py-4 md:py-8">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-forest">Market Journal</h2>
        <p className="text-sm text-ink/55 mt-1">Notes on neighbourhoods, pricing & buying tips · newest first</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-52 bg-mint/50 rounded-2xl animate-pulse" />)}
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-sm text-ink/50 text-center py-10">No posts yet.</p>
      ) : (
        <>
          <div className="blog-grid space-y-3">
            {blogs.map((b) => <BlogCard key={b._id} blog={b} />)}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={fetchBlogs} />
        </>
      )}
    </div>
  );
}
