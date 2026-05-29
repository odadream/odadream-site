// Phase E — back-fill MediaAsset.subject from inline ![[media:id]] tokens
// and frontmatter `media: [id]` arrays.
//
// For each .md file in src/content/:
//   collect (assetId → nodeId) from inline tokens AND frontmatter media[]
// Then patch src/data/media.ts: for each existing MEDIA entry,
//   subject = union(existing subject, derived ids)
//
// Idempotent: re-running with no new content changes is a no-op.

import fs from "node:fs";
import path from "node:path";
import { ROOT, CONTENT_DIR, log, readMd } from "./lib.js";

const MEDIA_TS_PATH = path.join(ROOT, "src/data/media.ts");
const INLINE_TOKEN = /!\[\[media:([a-z0-9_-]+)/gi;

function buildInverse() {
  const map = new Map(); // assetId -> Set<nodeId>
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .filter((f) => !f.startsWith("_"));

  for (const f of files) {
    const md = readMd(path.join(CONTENT_DIR, f));
    if (!md?.fm?.id) continue;
    const nodeId = md.fm.id;

    // 1. Frontmatter media: [id1, id2]
    if (Array.isArray(md.fm.media)) {
      for (const aid of md.fm.media) {
        if (!map.has(aid)) map.set(aid, new Set());
        map.get(aid).add(nodeId);
      }
    }

    // 2. Inline ![[media:XXX]] tokens in body
    const body = String(md.body ?? "");
    INLINE_TOKEN.lastIndex = 0;
    let m;
    while ((m = INLINE_TOKEN.exec(body))) {
      const aid = m[1];
      if (!map.has(aid)) map.set(aid, new Set());
      map.get(aid).add(nodeId);
    }
  }
  return map;
}

// Each entry in MEDIA: `  "key": { ... },` at top level of the object.
// Closing of an entry is `\n  },` (exactly 2-space indent). Nested object
// closings are at 4-space indent.
const ENTRY_RE = /^  "([\w-]+)": \{([\s\S]*?)^  \},/gm;

function patchMediaFile({ dryRun }) {
  const inverse = buildInverse();
  let original = fs.readFileSync(MEDIA_TS_PATH, "utf8");
  let updated = 0,
    skipped = 0,
    noScan = 0,
    notFound = new Set([...inverse.keys()]);

  const patched = original.replace(ENTRY_RE, (whole, key, block) => {
    notFound.delete(key);
    const derived = inverse.get(key);
    if (!derived || derived.size === 0) {
      noScan++;
      return whole;
    }

    // Existing subject line (if any). Match line-bounded — do NOT use \s*$
    // because that eats the trailing \n when block ends with one.
    const existingMatch = block.match(/^    subject:[^\n]*$/m);
    const existing = new Set();
    if (existingMatch) {
      const inner = existingMatch[0].match(/\[([^\]]*)\]/);
      if (inner) {
        inner[1]
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean)
          .forEach((s) => existing.add(s));
      }
    }

    const union = new Set([...existing, ...derived]);
    const sameSize = existing.size === union.size;
    const sameContent = sameSize && [...existing].every((x) => union.has(x));
    if (sameContent) {
      skipped++;
      return whole;
    }

    const sortedSubject = [...union].sort();
    const newSubjectLine = `    subject: [${sortedSubject
      .map((s) => `"${s}"`)
      .join(", ")}],`;

    let newBlock;
    if (existingMatch) {
      newBlock = block.replace(/^    subject:[^\n]*$/m, newSubjectLine);
    } else {
      // Insert before final newline of block. `block` ends with "\n".
      newBlock = block + newSubjectLine + "\n";
    }

    updated++;
    log("ok", key, `subject: ${union.size} id${union.size > 1 ? "s" : ""}`);
    // Re-add the 2-space indent on the closing brace.
    return `  "${key}": {${newBlock}  },`;
  });

  for (const orphan of notFound) {
    log(
      "warn",
      orphan,
      `referenced ${inverse.get(orphan).size}x but no MediaAsset entry`,
    );
  }

  if (!dryRun && updated > 0) {
    fs.writeFileSync(MEDIA_TS_PATH, patched, "utf8");
  }
  return {
    name: "media-subject",
    updated,
    skipped,
    noScan,
    orphans: notFound.size,
  };
}

const args = process.argv.slice(2);
const dryRun = !args.includes("--write");

console.log(
  `\n${dryRun ? "🔍 [DRY RUN]" : "✏️  [WRITE]"} Phase E — media subject backfill\n`,
);
const result = patchMediaFile({ dryRun });
console.log("\n══ SUMMARY ══════════════════════════════════");
console.log("  " + JSON.stringify(result));
if (dryRun) console.log("\n→ Run with --write to apply.");
