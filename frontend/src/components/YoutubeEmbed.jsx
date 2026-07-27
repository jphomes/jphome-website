import React from "react";
import { getYoutubeEmbedUrl } from "../utils/youtube.js";

export default function YoutubeEmbed({
  url,
  title = "Video",
  heading = "Video Tour",
  description = "Watch a quick walkthrough of this project.",
}) {
  const embedUrl = getYoutubeEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <section className="youtube-section">
      {heading ? <h2 className="section-title">{heading}</h2> : null}
      {description ? <p className="text-sm text-muted mb-3">{description}</p> : null}
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
