/**
 * Ingest an event photo into the site CMS (copy asset + append album markdown).
 *
 * Usage:
 *   npm run photos:add -- "D:/path/to/photo.jpg"
 *   npm run photos:add -- "D:/path/to/photo.jpg" --event byob-2026
 *   npm run photos:add -- "D:/path/to/photo.jpg" --slug wall-setup --caption-en "..." --caption-ru "..."
 *   npm run photos:add -- "D:/path/to/photo.jpg" --dry-run
 *
 * Routes: data/photo-pipeline.yaml (auto-match by folder name in source path).
 * After ingest, run: npm run assets:generate  (new album nodes only)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml } from "yaml";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ROUTES_PATH = path.join(ROOT, "data", "photo-pipeline.yaml");
const CONTENT_DIR = path.join(ROOT, "src", "content");
const PUBLIC_EVENTS = path.join(ROOT, "public", "images", "content", "events");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function parseArgs(argv) {
  const out = {
    file: null,
    event: null,
    slug: null,
    captionEn: null,
    captionRu: null,
    dryRun: false,
    skipAssets: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") out.dryRun = true;
    else if (a === "--skip-assets") out.skipAssets = true;
    else if (a === "--event" && argv[i + 1]) out.event = argv[++i];
    else if (a === "--slug" && argv[i + 1]) out.slug = argv[++i];
    else if (a === "--caption-en" && argv[i + 1]) out.captionEn = argv[++i];
    else if (a === "--caption-ru" && argv[i + 1]) out.captionRu = argv[++i];
    else if (!a.startsWith("-") && !out.file) out.file = a;
  }
  return out;
}

function loadRoutes() {
  const raw = fs.readFileSync(ROUTES_PATH, "utf8");
  return parseYaml(raw);
}

function detectRoute(routes, filePath, forcedEvent) {
  if (forcedEvent) {
    const r = routes[forcedEvent];
    if (!r) throw new Error(`Unknown --event "${forcedEvent}" (not in photo-pipeline.yaml)`);
    return { key: forcedEvent, ...r };
  }
  const norm = filePath.replace(/\\/g, "/").toLowerCase();
  for (const [key, route] of Object.entries(routes)) {
    for (const hint of route.pathHints || []) {
      if (norm.includes(String(hint).toLowerCase())) {
        return { key, ...route };
      }
    }
  }
  throw new Error(
    `Could not detect event from path. Use --event <key>. Keys: ${Object.keys(routes).join(", ")}`,
  );
}

function slugify(name) {
  const base = path.basename(name, path.extname(name));
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "photo";
}

function defaultCaptions(route, slug) {
  const year = route.eventId.match(/\d{4}/)?.[0] || "";
  return {
    en: `${route.title_en?.replace(/ — photo report/i, "") || route.eventId} · ${slug}${year ? ` (${year})` : ""}`,
    ru: `${route.title_ru?.replace(/ — фоторепортаж/i, "") || route.eventId} · ${slug}${year ? ` (${year})` : ""}`,
  };
}

function embedLine(webPath, captionEn, captionRu) {
  return `![[${webPath} | ${captionEn}]]`;
}

function albumPath(albumId) {
  return path.join(CONTENT_DIR, `${albumId}.md`);
}

function createAlbumMd(route) {
  const products = (route.products || [])
    .map((id) => `  - "[[${id}]]"`)
    .join("\n");
  const productNames = (route.products || []).join(", ");
  const dateFromEvent = route.eventId.match(/(\d{4})$/)?.[1];
  const dateFm = dateFromEvent ? `${dateFromEvent}.01.01` : "2026.01.01";

  return `---
id: ${route.albumId}
parent: ${route.eventId}
title_en: ${route.title_en}
title_ru: ${route.title_ru}
short_en: Photos
short_ru: Фото
type: content
tags: [kind/media, media/photo, ${route.destDir}]
order: 1
date: ${dateFm}
visible: true
kind: media
subkind: photo
about:
  - "[[${route.eventId}]]"
${products ? products + "\n" : ""}---

## ${route.title_en}

Field photos — ${productNames || route.eventId}. Images added via \`npm run photos:add\`.

---RU---

## ${route.title_ru}

Кадры с площадки — ${productNames || route.eventId}. Добавление: \`npm run photos:add\`.

`;
}

function splitRu(body) {
  const idx = body.indexOf("---RU---");
  if (idx === -1) return { en: body, ru: "" };
  return {
    en: body.slice(0, idx).trimEnd(),
    ru: body.slice(idx + "---RU---".length).trim(),
  };
}

function appendEmbed(albumFile, webPath, captionEn, captionRu) {
  const raw = fs.readFileSync(albumFile, "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error(`Invalid album frontmatter: ${albumFile}`);
  const fm = `---\n${m[1]}\n---\n`;
  const body = m[2];

  if (body.includes(webPath)) {
    console.log(`[skip] Already in album: ${webPath}`);
    return false;
  }

  const lineEn = embedLine(webPath, captionEn, captionRu);
  const lineRu = embedLine(webPath, captionRu, captionRu);

  const { en, ru } = splitRu(body);
  const newEn = en ? `${en.trimEnd()}\n\n${lineEn}\n` : `${lineEn}\n`;
  const newRu = ru ? `${ru.trimEnd()}\n\n${lineRu}\n` : `${lineRu}\n`;
  const updated = `${fm}${newEn}\n---RU---\n\n${newRu}`;
  fs.writeFileSync(albumFile, updated, "utf8");
  return true;
}

function ensureProductEmbed(productId, albumId, dryRun) {
  const mdPath = path.join(CONTENT_DIR, `${productId}.md`);
  if (!fs.existsSync(mdPath)) return;
  const raw = fs.readFileSync(mdPath, "utf8");
  const token = `![[${albumId}]]`;
  if (raw.includes(token)) return;

  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return;
  const fm = `---\n${m[1]}\n---\n`;
  const parts = splitRu(m[2]);
  const patch = (section) => `${section.trimEnd()}\n\n${token}\n`;
  const updated = `${fm}${patch(parts.en)}\n---RU---\n\n${patch(parts.ru)}`;
  if (dryRun) {
    console.log(`[dry-run] Would add ${token} to ${productId}.md`);
    return;
  }
  fs.writeFileSync(mdPath, updated, "utf8");
  console.log(`[product] Linked ${token} in ${productId}.md`);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.file) {
    console.error(`Usage: npm run photos:add -- "<image-path>" [--event byob-2026] [--slug name]`);
    process.exit(1);
  }

  const src = path.resolve(opts.file);
  if (!fs.existsSync(src)) {
    console.error(`File not found: ${src}`);
    process.exit(1);
  }
  const ext = path.extname(src).toLowerCase();
  if (!IMAGE_EXT.has(ext)) {
    console.error(`Unsupported extension: ${ext}`);
    process.exit(1);
  }

  const routes = loadRoutes();
  const route = detectRoute(routes, src, opts.event);
  const slug = opts.slug || slugify(src);
  const destDir = path.join(PUBLIC_EVENTS, route.destDir);
  const destName = `${slug}${ext}`;
  const destAbs = path.join(destDir, destName);
  const webPath = `/images/content/events/${route.destDir}/${destName}`;

  const caps = defaultCaptions(route, slug);
  const captionEn = opts.captionEn || caps.en;
  const captionRu = opts.captionRu || caps.ru;

  console.log(`Event:  ${route.eventId} (${route.key})`);
  console.log(`Album:  ${route.albumId}`);
  console.log(`Asset:  ${webPath}`);
  console.log(`Caption EN: ${captionEn}`);
  console.log(`Caption RU: ${captionRu}`);

  if (opts.dryRun) {
    console.log("[dry-run] No files written.");
    return;
  }

  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, destAbs);
  console.log(`[copy] ${src} → ${destAbs}`);

  const albumFile = albumPath(route.albumId);
  if (!fs.existsSync(albumFile)) {
    fs.writeFileSync(albumFile, createAlbumMd(route), "utf8");
    console.log(`[create] ${albumFile}`);
  }

  if (appendEmbed(albumFile, webPath, captionEn, captionRu)) {
    console.log(`[album] Appended embed to ${route.albumId}.md`);
  }

  for (const productId of route.products || []) {
    ensureProductEmbed(productId, route.albumId, false);
  }

  if (!opts.skipAssets) {
    const r = spawnSync("npm", ["run", "assets:generate"], {
      cwd: ROOT,
      stdio: "inherit",
      shell: true,
    });
    if (r.status !== 0) process.exit(r.status ?? 1);
  }

  console.log("\nDone. Verify: npm run dev → ?id=" + route.eventId);
}

main();
