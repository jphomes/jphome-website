import React from "react";
import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  const date = new Date(blog.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link to={`/blogs/${blog.slug}`} className="group card-elevated block bg-white overflow-hidden">
      <img
        src={blog.coverImage}
        alt={blog.title}
        className="w-full h-40 object-cover"
        loading="lazy"
      />
      <div className="p-3.5">
        <p className="text-[10px] font-semibold uppercase text-leaf tracking-wide">
          {blog.category} · {date}
        </p>
        <h3 className="font-semibold text-forest text-[15px] mt-1.5 leading-snug line-clamp-2">{blog.title}</h3>
        <p className="text-xs text-ink/55 mt-1.5 line-clamp-2">{blog.excerpt}</p>
        <p className="text-[11px] font-semibold text-gold mt-2">Read Article →</p>
      </div>
    </Link>
  );
}
