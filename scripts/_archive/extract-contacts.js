/**
 * One-off migration: replace markdown links to canonical ODA.dream contacts
 * with atomic tokens (`{{telegram}}`, `{{email}}`, …). Single source: src/data/contacts.ts.
 * Run: node scripts/extract-contacts.js
 *
 * Block-level outreach paragraphs (Telegram + email + "respond within 24h") can
 * additionally be replaced by `{{contacts-cta}}` by hand on the relevant pages.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(__dirname, "..", "src", "content");

// Order matters: t.me/odadream_info before t.me/odadream (non-greedy).
const RULES = [
  { token: "telegram",      re: /\[[^\]]+\]\(https:\/\/t\.me\/odadream_info\/?\)/g },
  { token: "telegram-news", re: /\[[^\]]+\]\(https:\/\/t\.me\/odadream\/?\)/g },
  { token: "email",         re: /\[[^\]]+\]\(mailto:hi@odadream\.art(?:\?[^)]*)?\)/g },
  { token: "behance",       re: /\[[^\]]+\]\(https:\/\/(?:www\.)?behance\.net\/chudodey\/?\)/g },
  { token: "youtube",       re: /\[[^\]]+\]\(https:\/\/(?:www\.)?youtube\.com\/@odadreamart\/?\)/g },
  { token: "dzen",          re: /\[[^\]]+\]\(https:\/\/dzen\.ru\/odadream\/?\)/g },
  { token: "site",          re: /\[[^\]]+\]\(https:\/\/odadream\.art\/?\)/g },
];

let touched = 0;
let replaced = 0;
for (const f of fs.readdirSync(CONTENT)) {
  if (!f.endsWith(".md")) continue;
  const full = path.join(CONTENT, f);
  let text = fs.readFileSync(full, "utf-8");
  let mutated = false;
  for (const { token, re } of RULES) {
    const before = text;
    text = text.replace(re, () => {
      replaced++;
      return `{{${token}}}`;
    });
    if (text !== before) mutated = true;
  }
  if (mutated) {
    fs.writeFileSync(full, text);
    touched++;
    console.log(`  ✓ ${f}`);
  }
}
console.log(`\n✨ ${replaced} contact links tokenized across ${touched} files`);
