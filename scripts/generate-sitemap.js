#!/usr/bin/env node
/**
 * Generates public/sitemap.xml with:
 * - lastmod set to build date (ISO date)
 * - hreflang (en, ar) for i18n
 * - Minified structure for smaller file and faster parsing
 * Run before build: npm run generate-sitemap (or it runs as part of build)
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const out = join(root, "public", "sitemap.xml");

const BASE = "https://he779.com";
const LASTMOD = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const PAGES = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/programs", changefreq: "weekly", priority: "0.9" },
  { path: "/courses", changefreq: "weekly", priority: "0.9" },
  { path: "/courses/online-courses", changefreq: "weekly", priority: "0.8" },
  { path: "/courses/offline-courses", changefreq: "weekly", priority: "0.8" },
  { path: "/courses/private-courses", changefreq: "weekly", priority: "0.8" },
  { path: "/consultation", changefreq: "weekly", priority: "0.9" },
  { path: "/calculator", changefreq: "monthly", priority: "0.7" },
  { path: "/news", changefreq: "daily", priority: "0.8" },
  { path: "/broadcasts", changefreq: "weekly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/auth", changefreq: "monthly", priority: "0.5" },
];

function loc(path) {
  return path === "/" ? BASE + "/" : BASE + path;
}

function arHref(path) {
  const u = loc(path);
  return path === "/" ? u + "?lang=ar" : u + "?lang=ar";
}

const urlBlocks = PAGES.map((p) => {
  const l = loc(p.path);
  const ar = arHref(p.path);
  return `<url><loc>${l}</loc><lastmod>${LASTMOD}</lastmod><xhtml:link rel="alternate" hreflang="en" href="${l}"/><xhtml:link rel="alternate" hreflang="ar" href="${ar}"/><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`;
}).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks}
</urlset>
`;

writeFileSync(out, xml, "utf8");
console.log("Generated public/sitemap.xml with lastmod=" + LASTMOD);
