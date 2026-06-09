/**
 * Load engagement rows for hub-registry from src/content event cards.
 * Source: event-*.md with tag hub-registry (edited via events.base in Obsidian).
 * Writes data/registry/engagements.yaml as a derived snapshot.
 */
import fs from "fs";
import path from "path";
import { stringify as stringifyYaml } from "yaml";
import { readMd, writeMd, readYamlFile, CONTENT_DIR } from "../migrate/lib.js";
import { normalizeRegistryDate } from "./registry-date.js";

const LEGACY_NOTES_DIR = "engagements";

function unwrapId(value) {
  if (typeof value !== "string") return value;
  const m = value.match(/^\[\[([^\]|]+)(?:\|[^\]]+)?\]\]$/);
  return (m ? m[1] : value).trim();
}

function asIdList(value) {
  if (!value) return [];
  const list = Array.isArray(value) ? value : [value];
  return list.map(unwrapId).filter(Boolean);
}

function tagList(fm) {
  if (!fm.tags) return [];
  return Array.isArray(fm.tags) ? fm.tags : [fm.tags];
}

function isRegistryCard(fm) {
  return tagList(fm).includes("hub-registry");
}

function pickEngagement(fm, fallbackId) {
  const id = String(fm.id || fallbackId || "").trim();
  if (!id) return null;

  const row = {
    id,
    date: normalizeRegistryDate(fm.date_start),
    city_en: fm.city_en ?? "",
    city_ru: fm.city_ru ?? "",
    relationship: fm.relationship || "invited",
    subkind: fm.subkind || "",
    format: fm.format || undefined,
    orgs: asIdList(fm.orgs?.length ? fm.orgs : fm.organizer),
    venues: asIdList(fm.venues),
    title_ru: fm.title_ru || "",
    title_en: fm.title_en || "",
  };

  if (fm.card !== undefined) row.card = Boolean(fm.card);
  if (fm.showcase) row.showcase = true;
  if (fm.letter) row.letter = true;
  if (fm.site_media?.length) row.site_media = fm.site_media;

  return row;
}

export function engagementToFrontmatter(eng) {
  return {
    id: eng.id,
    date_start: normalizeRegistryDate(eng.date) || undefined,
    title_ru: eng.title_ru || undefined,
    title_en: eng.title_en || undefined,
    subkind: eng.subkind || undefined,
    orgs: eng.orgs?.length ? eng.orgs : undefined,
    venues: eng.venues?.length ? eng.venues : undefined,
    city_en: eng.city_en || undefined,
    city_ru: eng.city_ru || undefined,
    relationship: eng.relationship || undefined,
    format: eng.format || undefined,
    card: eng.card !== undefined ? eng.card : undefined,
    showcase: eng.showcase || undefined,
    letter: eng.letter || undefined,
    site_media: eng.site_media?.length ? eng.site_media : undefined,
  };
}

export function loadEngagementsFromContent(contentDir = CONTENT_DIR) {
  const rows = [];
  for (const name of fs.readdirSync(contentDir)) {
    if (!name.endsWith(".md")) continue;
    if (!name.startsWith("event-")) continue;

    const parsed = readMd(path.join(contentDir, name));
    if (!parsed) continue;
    if (!isRegistryCard(parsed.fm)) continue;

    const row = pickEngagement(parsed.fm, path.basename(name, ".md"));
    if (row) rows.push(row);
  }

  rows.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return rows;
}

/** @deprecated alias */
export function loadEngagementsFromNotes(dataDir) {
  return loadEngagementsFromContent();
}

export function writeEngagementsYaml(dataDir, rows) {
  const outPath = path.join(dataDir, "engagements.yaml");
  const header = [
    "# Generated from src/content/event-*.md (tag: hub-registry)",
    "# Edit in Obsidian → events.base → npm run registry:sync",
    "",
  ].join("\n");
  fs.writeFileSync(outPath, `${header}\n${stringifyYaml(rows, { lineWidth: 0 })}`, "utf8");
}

function mergeRegistryIntoEventFm(eventFm, row) {
  const tags = new Set(tagList(eventFm));
  tags.add("hub-registry");

  const merged = {
    ...eventFm,
    tags: [...tags],
    kind: eventFm.kind || "event",
    subkind: row.subkind || eventFm.subkind,
    date_start: row.date || eventFm.date_start,
  };

  if (row.orgs?.length) merged.orgs = row.orgs;
  if (row.venues?.length) merged.venues = row.venues;
  if (row.city_en) merged.city_en = row.city_en;
  if (row.city_ru) merged.city_ru = row.city_ru;
  if (row.relationship) merged.relationship = row.relationship;
  if (row.format) merged.format = row.format;
  if (row.showcase) merged.showcase = true;
  if (row.letter) merged.letter = true;

  return merged;
}

function defaultEngCard(row) {
  return {
    id: row.id,
    parent: "hub-world",
    title_en: row.title_en,
    title_ru: row.title_ru,
    type: "content",
    kind: "event",
    tags: ["hub-registry"],
    visible: false,
    date_start: row.date,
    subkind: row.subkind,
    orgs: row.orgs,
    venues: row.venues,
    city_en: row.city_en || undefined,
    city_ru: row.city_ru || undefined,
    relationship: row.relationship,
    format: row.format,
  };
}

/**
 * One-time migration: data/registry/engagements/*.md → src/content/*.md
 */
export function migrateLegacyEngagementNotes(dataDir, contentDir = CONTENT_DIR) {
  const notesDir = path.join(dataDir, LEGACY_NOTES_DIR);
  if (!fs.existsSync(notesDir)) return 0;

  const names = fs
    .readdirSync(notesDir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  if (!names.length) return 0;

  let moved = 0;
  for (const name of names) {
    const parsed = readMd(path.join(notesDir, name));
    if (!parsed) continue;
    const row = pickEngagement(parsed.fm, path.basename(name, ".md"));
    if (!row) continue;

    const target = path.join(contentDir, `${row.id}.md`);
    if (fs.existsSync(target)) {
      const existing = readMd(target);
      const fm = mergeRegistryIntoEventFm(existing.fm, row);
      writeMd(target, fm, existing.body, {});
    } else {
      writeMd(target, defaultEngCard(row), "", {});
    }
    moved++;
  }

  for (const name of names) {
    fs.unlinkSync(path.join(notesDir, name));
  }
  const template = path.join(notesDir, "_template.md");
  if (fs.existsSync(template)) fs.unlinkSync(template);
  if (!fs.readdirSync(notesDir).length) fs.rmdirSync(notesDir);

  return moved;
}

export function resolveEngagements(dataDir, contentDir = CONTENT_DIR) {
  const migrated = migrateLegacyEngagementNotes(dataDir, contentDir);
  if (migrated) {
    console.log(`  ↪ migrated ${migrated} legacy engagement notes → src/content`);
  }

  const rows = loadEngagementsFromContent(contentDir);
  if (rows.length) {
    writeEngagementsYaml(dataDir, rows);
    console.log(`  📋 ${rows.length} registry events from src/content (tag hub-registry)`);
    return rows;
  }

  const yamlPath = path.join(dataDir, "engagements.yaml");
  return fs.existsSync(yamlPath) ? readYamlFile(yamlPath) : [];
}
