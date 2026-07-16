import React, { useEffect, useState, useCallback } from "react";

/**
 * Multi-image gallery: slow auto-slide + clickable thumbs/dots.
 */
export default function PropertyGallery({ images = [], title = "", badges = null, overlayTitle = null }) {
  const gallery = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index) => {
    if (!gallery.length) return;
    setActive(((index % gallery.length) + gallery.length) % gallery.length);
  }, [gallery.length]);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    setActive(0);
  }, [gallery.join("|")]);

  useEffect(() => {
    if (gallery.length < 2 || paused) return undefined;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % gallery.length);
    }, 4500);
    return () => clearInterval(id);
  }, [gallery.length, paused]);

  if (!gallery.length) return null;

  return (
    <div
      className="property-gallery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="property-gallery-stage">
        {gallery.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={`${title} ${i + 1}`}
            className={`property-gallery-slide ${i === active ? "is-active" : ""}`}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}

        <div className="property-gallery-shade" />

        {(badges || overlayTitle) && (
          <div className="property-gallery-caption">
            {badges}
            {overlayTitle}
          </div>
        )}

        {gallery.length > 1 && (
          <>
            <button type="button" className="property-gallery-nav property-gallery-nav--prev" onClick={prev} aria-label="Previous photo">
              ‹
            </button>
            <button type="button" className="property-gallery-nav property-gallery-nav--next" onClick={next} aria-label="Next photo">
              ›
            </button>
            <div className="property-gallery-count">
              {active + 1} / {gallery.length}
            </div>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <>
          <div className="property-gallery-thumbs">
            {gallery.map((src, i) => (
              <button
                key={`thumb-${src}-${i}`}
                type="button"
                onClick={() => goTo(i)}
                className={`property-gallery-thumb ${i === active ? "is-active" : ""}`}
                aria-label={`Photo ${i + 1}`}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
          <div className="property-gallery-dots" role="tablist" aria-label="Gallery photos">
            {gallery.map((_, i) => (
              <button
                key={`dot-${i}`}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => goTo(i)}
                className={`property-gallery-dot ${i === active ? "is-active" : ""}`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
