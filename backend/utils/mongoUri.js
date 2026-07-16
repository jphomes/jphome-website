/**
 * Resolve which Mongo URI to use.
 * Priority:
 *   1. MONGO_URI_STAGE / MONGO_URI_PROD based on APP_ENV (or NODE_ENV)
 *   2. Legacy MONGO_URI fallback
 */
function resolveMongoUri() {
  const appEnv = (process.env.APP_ENV || process.env.NODE_ENV || "development").toLowerCase();
  const isProd = appEnv === "production" || appEnv === "prod";

  const stage = (process.env.MONGO_URI_STAGE || "").trim();
  const prod = (process.env.MONGO_URI_PROD || "").trim();
  const legacy = (process.env.MONGO_URI || "").trim();

  if (isProd) {
    if (prod) return { uri: prod, label: "prod" };
    if (legacy) return { uri: legacy, label: "legacy(MONGO_URI)" };
    throw new Error("MONGO_URI_PROD is empty. Set it for production, or set APP_ENV=stage.");
  }

  // development / stage / anything else → prefer stage
  if (stage) return { uri: stage, label: "stage" };
  if (legacy) return { uri: legacy, label: "legacy(MONGO_URI)" };
  throw new Error("MONGO_URI_STAGE is empty. Paste your Atlas connection string into backend/.env");
}

module.exports = { resolveMongoUri };
