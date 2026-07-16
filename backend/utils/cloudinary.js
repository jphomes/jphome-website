const { v2: cloudinary } = require("cloudinary");

function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return false;
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });

  return true;
}

/**
 * Extract Cloudinary public_id from a secure_url / url.
 * e.g. .../upload/v123/jpgroup/properties/abc.jpg → jpgroup/properties/abc
 */
function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  if (!url.includes("res.cloudinary.com") && !url.includes("cloudinary.com")) return null;

  try {
    const withoutQuery = url.split("?")[0];
    const uploadIdx = withoutQuery.indexOf("/upload/");
    if (uploadIdx === -1) return null;

    let path = withoutQuery.slice(uploadIdx + "/upload/".length);
    // Drop transformation segments and version (v123456)
    const parts = path.split("/").filter(Boolean);
    let start = 0;
    while (start < parts.length) {
      const part = parts[start];
      if (/^v\d+$/.test(part)) {
        start += 1;
        break;
      }
      // transformation-looking segment (contains _) or known flags
      if (part.includes(",") || /^[a-z]_/.test(part)) {
        start += 1;
        continue;
      }
      break;
    }
    const idParts = parts.slice(start);
    if (!idParts.length) return null;
    const last = idParts[idParts.length - 1].replace(/\.[a-zA-Z0-9]+$/, "");
    idParts[idParts.length - 1] = last;
    return idParts.join("/");
  } catch {
    return null;
  }
}

async function destroyByPublicId(publicId, resourceType = "image") {
  if (!publicId || !configureCloudinary()) return { result: "skipped" };
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error("Cloudinary destroy failed:", publicId, err.message);
    return { result: "error", error: err.message };
  }
}

/**
 * Delete Cloudinary assets for a property (images + brochure PDF).
 */
async function destroyPropertyImages(property) {
  if (!property) return;

  const ids = new Set();
  (property.imagePublicIds || []).forEach((id) => id && ids.add(id));

  const urls = [
    ...(property.images || []),
    property.coverImage,
  ].filter(Boolean);

  urls.forEach((url) => {
    const id = extractPublicIdFromUrl(url);
    if (id) ids.add(id);
  });

  const jobs = [...ids].map((id) => destroyByPublicId(id, "image"));

  const brochureId = property.brochurePublicId || extractPublicIdFromUrl(property.brochureUrl);
  if (brochureId) {
    jobs.push(
      destroyByPublicId(brochureId, "raw").then(async (res) => {
        if (res?.result === "not found" || res?.result === "error") {
          await destroyByPublicId(brochureId, "image");
        }
        return res;
      })
    );
  }

  if (!jobs.length) return;
  await Promise.all(jobs);
}

module.exports = {
  cloudinary,
  configureCloudinary,
  extractPublicIdFromUrl,
  destroyByPublicId,
  destroyPropertyImages,
};
