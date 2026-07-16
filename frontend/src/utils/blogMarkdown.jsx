import React from "react";

/**
 * Lightweight Markdown → React for journal posts.
 * Supports: #–### headings, **bold**, *italic*, ul/ol lists, paragraphs.
 * Raw HTML is not interpreted (React text nodes escape automatically).
 */

function renderInline(text, keyPrefix = "i") {
  if (text == null || text === "") return null;

  const parts = [];
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let last = 0;
  let match;
  let idx = 0;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[2] != null) {
      parts.push(
        <strong key={`${keyPrefix}-b-${idx++}`}>{renderInline(match[2], `${keyPrefix}-nb${idx}`)}</strong>
      );
    } else if (match[3] != null) {
      parts.push(
        <em key={`${keyPrefix}-e-${idx++}`}>{renderInline(match[3], `${keyPrefix}-ne${idx}`)}</em>
      );
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : parts;
}

function parseBlocks(source) {
  const lines = String(source || "").replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(trimmed);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2].trim() });
      i += 1;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        const m = /^[-*]\s+(.+)$/.exec(t);
        if (!m) break;
        items.push(m[1]);
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        const m = /^\d+\.\s+(.+)$/.exec(t);
        if (!m) break;
        items.push(m[1]);
        i += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    const paraLines = [];
    while (i < lines.length) {
      const t = lines[i].trim();
      if (!t) break;
      if (/^#{1,3}\s+/.test(t)) break;
      if (/^[-*]\s+/.test(t)) break;
      if (/^\d+\.\s+/.test(t)) break;
      paraLines.push(t);
      i += 1;
    }
    if (paraLines.length) {
      blocks.push({ type: "p", text: paraLines.join(" ") });
    }
  }

  return blocks;
}

export function BlogMarkdown({ content, className = "blog-prose" }) {
  const blocks = parseBlocks(content);
  if (!blocks.length) return null;

  return (
    <div className={className}>
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          const Tag = `h${block.level}`;
          return (
            <Tag key={i} className={`blog-prose-h${block.level}`}>
              {renderInline(block.text, `h-${i}`)}
            </Tag>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={i} className="blog-prose-ul">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item, `ul-${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={i} className="blog-prose-ol">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item, `ol-${i}-${j}`)}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className="blog-prose-p">
            {renderInline(block.text, `p-${i}`)}
          </p>
        );
      })}
    </div>
  );
}

export default BlogMarkdown;
