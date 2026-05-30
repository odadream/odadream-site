/**
 * One-off: festival series hubs → event-* ; edition ids shortened.
 * Run from repo root: node scripts/migrate-event-series-ids.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/** Longer ids first to avoid partial replacements */
const ID_REPLACEMENTS = [
  ["event-interference-tsiolkovsky-2026", "event-tsiolkovsky-2026"],
  ["tsiolkovsky-2025", "event-tsiolkovsky-2025"],
  ["hub-tsiolkovsky", "event-tsiolkovsky"],
  ["gong-fest-2024", "event-gong-fest-2024"],
  ["gong-fest-2025", "event-gong-fest-2025"],
  ["hub-gong-fest", "event-gong-fest"],
  ["portal-2024", "event-portal-2024"],
  ["portal-2025", "event-portal-2025"],
  ["hub-portal", "event-portal"],
  ["hub-byob", "event-byob"],
];

const FILE_RENAMES = [
  ["src/content/hub-byob.md", "src/content/event-byob.md"],
  ["src/content/hub-tsiolkovsky.md", "src/content/event-tsiolkovsky.md"],
  ["src/content/hub-portal.md", "src/content/event-portal.md"],
  ["src/content/hub-gong-fest.md", "src/content/event-gong-fest.md"],
  ["src/content/tsiolkovsky-2025.md", "src/content/event-tsiolkovsky-2025.md"],
  [
    "src/content/event-interference-tsiolkovsky-2026.md",
    "src/content/event-tsiolkovsky-2026.md",
  ],
  ["src/content/portal-2024.md", "src/content/event-portal-2024.md"],
  ["src/content/portal-2025.md", "src/content/event-portal-2025.md"],
  ["src/content/gong-fest-2024.md", "src/content/event-gong-fest-2024.md"],
  ["src/content/gong-fest-2025.md", "src/content/event-gong-fest-2025.md"],
];

const DELETE_FILES = ["src/content/tsiolkovsky-2026.md"];

const SCAN_DIRS = ["src", "data", "content-keeper", "scripts"];
const SCAN_EXT = new Set([".md", ".ts", ".yaml", ".yml", ".js", ".json"]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === "dist" || name === "_archive")
        continue;
      walk(full, out);
    } else if (SCAN_EXT.has(path.extname(name))) {
      out.push(full);
    }
  }
  return out;
}

function replaceIds(text) {
  let out = text;
  for (const [from, to] of ID_REPLACEMENTS) {
    out = out.split(from).join(to);
  }
  return out;
}

function main() {
  const files = SCAN_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
  let changed = 0;
  for (const file of files) {
    if (file.endsWith("migrate-event-series-ids.js")) continue;
    const raw = fs.readFileSync(file, "utf8");
    const next = replaceIds(raw);
    if (next !== raw) {
      fs.writeFileSync(file, next, "utf8");
      changed++;
    }
  }

  for (const [from, to] of FILE_RENAMES) {
    const src = path.join(ROOT, from);
    const dest = path.join(ROOT, to);
    if (!fs.existsSync(src)) {
      console.warn("skip rename (missing):", from);
      continue;
    }
    if (fs.existsSync(dest)) fs.unlinkSync(dest);
    fs.renameSync(src, dest);
    console.log("renamed:", from, "→", to);
  }

  for (const rel of DELETE_FILES) {
    const full = path.join(ROOT, rel);
    if (fs.existsSync(full)) {
      fs.unlinkSync(full);
      console.log("deleted:", rel);
    }
  }

  console.log(`Updated ${changed} files with id replacements.`);
}

main();
