// Vercel serverless function wrapper
import app from "../src/server.js";

// Handler for Vercel serverless
export default async (req, res) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://attendifyqr.vercel.app",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Vercel routing likely strips the leading /api/ when passing to this function.
  // Ensure Express receives the expected /api/* path so prefixed routers match.
  if (!req.url.startsWith("/api/")) {
    // Normalize leading slashes then prefix /api/
    const cleaned = req.url.replace(/^\/+/, "");
    req.url = "/api/" + cleaned;
  }

  return app(req, res);
};
