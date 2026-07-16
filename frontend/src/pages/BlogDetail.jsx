import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [recent, setRecent] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setBlog(null);
    setNotFound(false);
    api
      .get(`/blogs/${slug}`)
      .then((res) => {
        setBlog(res.data.blog);
        setRecent(res.data.recent);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="py-16 text-center px-4">
        <p className="font-semibold text-forest">Post not found.</p>
        <Link to="/blogs" className="text-secondary text-sm font-medium mt-3 inline-block">← Back</Link>
      </div>
    );
  }

  if (!blog) {
    return <div className="py-16 text-center text-sm text-ink/40">Loading…</div>;
  }

  const date = new Date(blog.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="pb-6">
      <img src={blog.coverImage} alt={blog.title} className="w-full h-48 md:h-72 object-cover" />

      <article className="page-wrap py-5 md:py-8 max-w-3xl">
        <p className="text-[10px] font-semibold uppercase text-leaf tracking-wide">{blog.category}</p>
        <h1 className="text-xl md:text-3xl font-semibold text-forest leading-snug mt-2">{blog.title}</h1>
        <p className="text-ink/45 text-xs mt-2">
          {blog.author} · {date} · {blog.readTimeMinutes} min read
        </p>

        <div className="text-sm md:text-base text-ink/75 leading-relaxed mt-5 md:mt-8 space-y-4">
          {blog.content.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {blog.tags.map((t) => (
              <span key={t} className="amenity-pill text-[10px]">#{t}</span>
            ))}
          </div>
        )}
      </article>

      {recent.length > 0 && (
        <section className="page-wrap pb-4 max-w-3xl">
          <h2 className="section-title">More Articles</h2>
          <ul className="space-y-3">
            {recent.map((r) => (
              <li key={r._id}>
                <Link to={`/blog/${r.slug}`} className="block bg-white rounded-xl p-3.5 border border-sage/30 text-sm font-medium text-forest hover:border-leaf transition-colors">
                  {r.title} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
