import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import WhatsAppIcon from "../components/WhatsAppIcon.jsx";
import api from "../api/axios.js";
import BlogMarkdown from "../utils/blogMarkdown.jsx";
import YoutubeEmbed from "../components/YoutubeEmbed.jsx";
import { getYoutubeEmbedUrl } from "../utils/youtube.js";
import { buildWhatsAppUrl } from "../utils/whatsapp.js";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [recent, setRecent] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setBlog(null);
    setNotFound(false);
    setRecent([]);
    window.scrollTo({ top: 0, behavior: "smooth" });

    api
      .get(`/blogs/${slug}`)
      .then((res) => {
        setBlog(res.data.blog);
        setRecent(res.data.recent || []);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  useEffect(() => {
    if (!blog) return undefined;

    const pageUrl = window.location.href;
    const imageUrl = blog.coverImage ? new URL(blog.coverImage, window.location.origin).href : "";
    const description = blog.excerpt || "Read the latest property insights from JP Homes Raipur.";
    const metadata = {
      description,
      "og:title": blog.title,
      "og:description": description,
      "og:type": "article",
      "og:url": pageUrl,
      "og:image": imageUrl,
      "twitter:card": "summary_large_image",
      "twitter:title": blog.title,
      "twitter:description": description,
      "twitter:image": imageUrl,
    };

    document.title = `${blog.title} | JP Homes Raipur`;
    Object.entries(metadata).forEach(([key, content]) => {
      if (!content) return;
      const selector = key.startsWith("og:") || key.startsWith("twitter:")
        ? `meta[property="${key}"]`
        : `meta[name="${key}"]`;
      let tag = document.head.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(key.startsWith("og:") || key.startsWith("twitter:") ? "property" : "name", key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    return () => {
      document.title = "JP Homes | Property in Raipur & Naya Raipur";
    };
  }, [blog]);

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
  const author = blog.author === "Tom Sondagar" ? "Gaurav Sondagar" : blog.author;
  const hasVideo = Boolean(getYoutubeEmbedUrl(blog.youtubeUrl));
  const shareText = [
    blog.title,
    "",
    blog.excerpt,
    "",
    `${blog.category} · ${date} · ${blog.readTimeMinutes} min read`,
    "",
    `Read the full article: ${window.location.href}`,
  ].join("\n");

  return (
    <div className="pb-6">
      <img src={blog.coverImage} alt={blog.title} className="w-full h-48 md:h-72 object-cover" />

      <article className="page-wrap py-5 md:py-8 max-w-3xl">
        <p className="text-[10px] font-semibold uppercase text-leaf tracking-wide">{blog.category}</p>
        <h1 className="text-xl md:text-3xl font-semibold text-forest leading-snug mt-2">{blog.title}</h1>
        <p className="text-ink/45 text-xs mt-2">
          {author} · {date} · {blog.readTimeMinutes} min read
        </p>
        <a
          href={buildWhatsAppUrl(shareText)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 mt-4 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5d]"
        >
          <WhatsAppIcon className="w-[18px] h-[18px]" />
          Share on WhatsApp
        </a>

        <BlogMarkdown content={blog.content} />

        {hasVideo && (
          <div className="mt-8">
            <YoutubeEmbed
              url={blog.youtubeUrl}
              title={`${blog.title} video`}
              heading="Watch video"
              description="Related video for this journal post."
            />
          </div>
        )}

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {blog.tags.map((t) => (
              <span key={t} className="amenity-pill text-[10px]">#{t}</span>
            ))}
          </div>
        )}
      </article>

      <section className="page-wrap pb-8 max-w-3xl">
        <div className="flex items-end justify-between gap-3 mb-4">
          <h2 className="section-title mb-0">More Articles</h2>
          <Link to="/blogs" className="text-sm font-medium text-leaf hover:text-forest shrink-0">
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="text-sm text-ink/50">No other published articles yet.</p>
        ) : (
          <ul className="space-y-3">
            {recent.map((r) => {
              const rDate = new Date(r.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              return (
                <li key={r._id}>
                  <Link to={`/blogs/${r.slug}`} className="more-article-card">
                    {r.coverImage ? (
                      <img src={r.coverImage} alt="" className="more-article-thumb" />
                    ) : (
                      <div className="more-article-thumb more-article-thumb--empty" />
                    )}
                    <div className="more-article-copy min-w-0">
                      <p className="more-article-date">{rDate}</p>
                      <p className="more-article-title">{r.title}</p>
                    </div>
                    <span className="more-article-arrow" aria-hidden>→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
