// Shared utilities for Phase C migration scripts.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, "../..");
export const CONTENT_DIR = path.join(ROOT, "src/content");
export const REGISTRY_DIR = path.join(ROOT, "data/registry");

const FM_RE = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/;

export function readMd(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8").replace(/^﻿/, "");
  const m = raw.match(FM_RE);
  if (!m) return { fm: {}, body: raw, raw };
  return { fm: YAML.parse(m[1]) ?? {}, body: m[2], raw };
}

export function writeMd(filePath, fm, body, { dryRun }) {
  // Stringify with no line-folding so wikilink strings stay on one line.
  const fmText = YAML.stringify(fm, { lineWidth: 0 });
  const out = `---\n${fmText}---\n\n${body.trim()}\n`;
  if (!dryRun) fs.writeFileSync(filePath, out, "utf8");
  return out;
}

export function readYaml(name) {
  const p = path.join(REGISTRY_DIR, name);
  return YAML.parse(fs.readFileSync(p, "utf8"));
}

export function isoDate(s) {
  if (!s) return undefined;
  return String(s).replace(/\./g, "-");
}

export function wikilink(id) {
  return id ? `[[${id}]]` : null;
}

export function nonEmptyList(arr) {
  const out = (arr ?? []).filter(Boolean);
  return out.length ? out : undefined;
}

export function listContentFiles() {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ file: f, path: path.join(CONTENT_DIR, f) }));
}

export function log(level, msg, extra) {
  const sym = { ok: "✓", skip: "·", warn: "!", info: "→" }[level] ?? "?";
  console.log(`  ${sym} ${msg}${extra ? "  " + extra : ""}`);
}

export const fileExists = (p) => fs.existsSync(p);
