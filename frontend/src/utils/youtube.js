export function getYoutubeEmbedId(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Already an embed URL
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);
  if (embedMatch) return embedMatch[1];

  // youtu.be/ID
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (shortMatch) return shortMatch[1];

  // youtube.com/watch?v=ID or shorts
  try {
    const u = new URL(trimmed);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const shorts = u.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{6,})/);
      if (shorts) return shorts[1];
      const live = u.pathname.match(/\/live\/([a-zA-Z0-9_-]{6,})/);
      if (live) return live[1];
    }
  } catch {
    // ignore
  }

  return null;
}

export function getYoutubeEmbedUrl(url) {
  const id = getYoutubeEmbedId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
