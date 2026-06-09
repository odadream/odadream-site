// Update eng-*.md from data/registry/engagements.yaml.
// engagements.yaml is the source of truth: organizers, products, dates, venue.

import path from "node:path";
import {
  CONTENT_DIR, readMd, writeMd, readYaml,
  isoDate, wikilink, nonEmptyList, log, fileExists,
} from "./lib.js";

// engagements.yaml `relationship` → event subkind (when unambiguous)
const RELATIONSHIP_SUBKIND = {
  competition: "competition",
  // commercial / invited / award / internal: ambiguous, leave empty
};

export function runEngagements({ dryRun }) {
  const engs = readYaml("engagements.yaml") ?? [];
  let updated = 0, skipped = 0, missing = 0;

  for (const e of engs) {
    if (!e.card) continue;
    const filePath = path.join(CONTENT_DIR, `${e.id}.md`);
    if (!fileExists(filePath)) {
      missing++;
      log("warn", `${e.id}.md`, "missing on disk");
      continue;
    }
    const md = readMd(filePath);
    if (md.fm.kind) {
      skipped++;
      continue;
    }

    md.fm.kind = "event";
    const subkind = RELATIONSHIP_SUBKIND[e.relationship];
    if (subkind) md.fm.subkind = subkind;
    if (e.date) md.fm.date_start = isoDate(e.date);
    if (e.city) md.fm.venue = e.city;

    // Organizers: orgs[] + venues[] (union, dedup)
    const allOrgs = [...(e.orgs ?? []), ...(e.venues ?? [])];
    const uniqOrgs = [...new Set(allOrgs)];
    const orgLinks = nonEmptyList(uniqOrgs.map(wikilink));
    if (orgLinks) md.fm.organizer = orgLinks;

    if (e.client) md.fm.client = [wikilink(e.client)];

    if (e.products?.length) md.fm.products = e.products.map(wikilink);

    writeMd(filePath, md.fm, md.body, { dryRun });
    updated++;
    const parts = [`→ event`];
    if (subkind) parts.push(`/${subkind}`);
    if (e.products?.length) parts.push(`· products:${e.products.length}`);
    if (uniqOrgs.length) parts.push(`· orgs:${uniqOrgs.length}`);
    log("ok", `${e.id}.md`, parts.join(" "));
  }
  return { name: "engagements", updated, skipped, missing };
}
