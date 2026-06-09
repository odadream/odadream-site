import YAML from "yaml";
import { LotusNode, LocalizedString } from "../types";

interface FrontmatterData {
  attributes: Record<string, any>;
  body: string;
}

const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Strip prototype-pollution keys from any parsed object before we use it.
 */
const sanitize = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (obj && typeof obj === "object") {
    const out: Record<string, any> = Object.create(null);
    for (const k of Object.keys(obj)) {
      if (DANGEROUS_KEYS.has(k)) {
        console.warn(`[Security] Blocked unsafe frontmatter key: ${k}`);
        continue;
      }
      out[k] = sanitize(obj[k]);
    }
    return out;
  }
  return obj;
};

/**
 * YAML Frontmatter parser. Supports full YAML — multi-line lists, nested objects,
 * dates, numbers, booleans. Body separation on the surrounding `---` block.
 */
export const parseFrontmatter = (text: string): FrontmatterData => {
  const cleanText = text.trimStart();
  const match = cleanText.match(
    /^---\s*\r?\n((?:.|\r?\n)*?)\r?\n---\s*\r?\n((?:.|\r?\n)*)$/,
  );
  if (!match) return { attributes: {}, body: text };

  const block = match[1];
  const body = match[2].trim();

  let parsed: any;
  try {
    parsed = YAML.parse(block);
  } catch (e) {
    console.warn(`[frontmatter] YAML parse failed:`, e);
    return { attributes: {}, body };
  }

  const attributes = parsed && typeof parsed === "object" ? sanitize(parsed) : {};
  return { attributes, body };
};

/**
 * Obsidian-style links in YAML strings look like `"[[id]]"` or `"[[id|alias]]"`.
 * This util strips the brackets so downstream code sees a plain id.
 * Pass-through for plain strings.
 */
export const unwrapWikilink = (s: unknown): string | undefined => {
  if (typeof s !== "string") return undefined;
  const trimmed = s.trim();
  if (!trimmed) return undefined;
  const m = trimmed.match(/^\[\[([^\]|]+)(?:\|[^\]]*)?\]\]$/);
  if (m) return m[1].trim();
  return trimmed;
};

const unwrapList = (v: unknown): string[] | undefined => {
  if (!v) return undefined;
  const arr = Array.isArray(v) ? v : [v];
  const out = arr.map(unwrapWikilink).filter((s): s is string => !!s);
  return out.length ? out : undefined;
};

const optionalLocalized = (
  en: unknown,
  ru: unknown,
): LocalizedString | undefined => {
  if (typeof en !== "string" && typeof ru !== "string") return undefined;
  return {
    en: typeof en === "string" ? en : "",
    ru: typeof ru === "string" ? ru : "",
  };
};

const toNumber = (v: unknown): number | undefined => {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))) {
    return Number(v);
  }
  return undefined;
};

const toString = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v : undefined;

/**
 * Converts parsed file data into a partial LotusNode structure.
 */
export const fileToNode = (
  rawContent: string,
  filename: string,
): Partial<LotusNode> | null => {
  const { attributes, body } = parseFrontmatter(rawContent);

  if (!attributes.id) {
    console.warn(
      `File ${filename} is missing 'id' in frontmatter or failed to parse.`,
    );
    return null;
  }

  const node: Partial<LotusNode> = {
    id: attributes.id,
    parentId: attributes.parent,
    title: {
      en: attributes.title_en || attributes.id,
      ru: attributes.title_ru || attributes.id,
    },
    shortTitle: {
      en: attributes.short_en || attributes.title_en,
      ru: attributes.short_ru || attributes.title_ru,
    },
    description: {
      en: body.split("---RU---")[0]?.trim() || body,
      ru: body.split("---RU---")[1]?.trim() || "",
    },
    type: attributes.type || "content",
    tags: Array.isArray(attributes.tags) ? attributes.tags : [],
    imageUrl: attributes.image,
    mediaUrl: attributes.media_url || attributes.image,
    externalLink: attributes.external_link,
    visible: attributes.visible !== false,
    status: attributes.status,
    lastModified: toString(attributes.updated) || toString(attributes.date),
    order: attributes.order,
  };

  // --- Provenance-model fields ---
  if (attributes.kind) node.kind = attributes.kind;
  if (attributes.subkind) node.subkind = String(attributes.subkind);

  node.presented_at = unwrapList(attributes.presented_at);
  node.products = unwrapList(attributes.products);
  node.orgs = unwrapList(attributes.orgs);
  node.venues = unwrapList(attributes.venues);
  node.partners = unwrapList(attributes.partners);
  node.organizer = unwrapList(attributes.organizer);
  node.client = unwrapList(attributes.client);
  node.collaborators = unwrapList(attributes.collaborators);
  node.related_org = unwrapList(attributes.related_org);
  node.collab_events = unwrapList(attributes.collab_events);
  node.proofs = unwrapList(attributes.proofs);
  node.proof_of = unwrapList(attributes.proof_of);
  node.about = unwrapList(attributes.about);
  node.issued_by = unwrapList(attributes.issued_by);
  // media here points to ids in src/data/media.ts (NOT wiki-links)
  if (Array.isArray(attributes.media)) {
    node.media = attributes.media.map(String).filter(Boolean);
  }

  if (attributes.attendance && typeof attributes.attendance === "object") {
    const a = attributes.attendance as Record<string, unknown>;
    const visitors = toNumber(a.visitors);
    const contacts = toNumber(a.contacts);
    if (visitors !== undefined || contacts !== undefined) {
      node.attendance = { visitors, contacts };
    }
  }

  const date_start = toString(attributes.date_start);
  if (date_start) node.date_start = date_start;
  const date_end = toString(attributes.date_end);
  if (date_end) node.date_end = date_end;
  const city_en = toString(attributes.city_en);
  const city_ru = toString(attributes.city_ru);
  if (city_en || city_ru) {
    node.city = {
      en: city_en || city_ru || "",
      ru: city_ru || city_en || "",
    };
  }
  const publication = toString(attributes.publication);
  if (publication) node.publication = publication;
  const publication_date = toString(attributes.publication_date);
  if (publication_date) node.publication_date = publication_date;
  const asset = toString(attributes.asset);
  if (asset) node.asset = asset;
  const website = toString(attributes.website);
  if (website) node.website = website;

  const quote = optionalLocalized(attributes.quote_en, attributes.quote_ru);
  if (quote) node.quote = quote;

  // --- Phase D: external subsite + work access/sale ---
  const external_site = toString(attributes.external_site);
  if (external_site) node.external_site = external_site;
  const ext_label = optionalLocalized(
    attributes.external_site_label_en,
    attributes.external_site_label_ru,
  );
  if (ext_label) node.external_site_label = ext_label;

  if (
    attributes.access === "public" ||
    attributes.access === "restricted" ||
    attributes.access === "private"
  ) {
    node.access = attributes.access;
  }
  if (attributes.for_sale === true) node.for_sale = true;
  const purchase_url = toString(attributes.purchase_url);
  if (purchase_url) node.purchase_url = purchase_url;
  const preview_media = toString(attributes.preview_media);
  if (preview_media) node.preview_media = preview_media;

  return node;
};
