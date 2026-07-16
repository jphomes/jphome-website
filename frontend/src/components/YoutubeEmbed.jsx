import React from "react";
import { getYoutubeEmbedUrl } from "../utils/youtube.js";

export default function YoutubeEmbed({ url, title = "Property video" }) {
  const embedUrl = getYoutubeEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <section className="youtube-section">
      <h2 className="section-title">Video Tour</h2>
      <p className="text-sm text-muted mb-3">Watch a quick walkthrough of this project.</p>
      <div className="youtube-frame-wrap">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="youtube-frame"
        />
      </div>
    </section>
  );
}
