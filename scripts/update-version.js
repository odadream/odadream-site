import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, "..");

// PATHS
const VERSIONS_PATH = path.join(PROJECT_ROOT, "versions.json");
const PACKAGE_PATH = path.join(PROJECT_ROOT, "package.json");
const CONSTANTS_PATH = path.join(PROJECT_ROOT, "src", "constants.ts");
const METADATA_PATH = path.join(PROJECT_ROOT, "metadata.json");
const README_PATH = path.join(PROJECT_ROOT, "README.md");
const VERSIONS_MD_PATH = path.join(PROJECT_ROOT, "versions.md");
const CHANGELOG_PATH = path.join(
  PROJECT_ROOT,
  "src",
  "content",
  "changelog.md",
);

// LOAD DATA
const versionsData = JSON.parse(fs.readFileSync(VERSIONS_PATH, "utf-8"));
const currentVersion = versionsData.current;
const history = versionsData.history;

const REQUIRED_FIELDS = ["version", "title_en", "title_ru", "desc_en", "desc_ru"];

const fail = (message) => {
  console.error(`\n❌ VERSION SYNC FAILED: ${message}\n`);
  process.exit(1);
};

if (!currentVersion || typeof currentVersion !== "string") {
  fail("`versions.json.current` must be a non-empty string");
}

if (!Array.isArray(history) || history.length === 0) {
  fail("`versions.json.history` must be a non-empty array");
}

if (history[0].version !== currentVersion) {
  fail("`versions.json.current` must match `versions.json.history[0].version`");
}

const seenVersions = new Set();
for (const [index, entry] of history.entries()) {
  for (const field of REQUIRED_FIELDS) {
    if (!entry[field] || typeof entry[field] !== "string") {
      fail(`history[${index}] is missing required string field: ${field}`);
    }
  }
  if (seenVersions.has(entry.version)) {
    fail(`Duplicate version in history: ${entry.version}`);
  }
  seenVersions.add(entry.version);
}

console.log(`\n🔄 SYNCHRONIZING VERSION: ${currentVersion}...\n`);

// 1. UPDATE PACKAGE.JSON
const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf-8"));
if (pkg.version !== currentVersion) {
  pkg.version = currentVersion;
  console.log(`✅ Updated package.json to ${currentVersion}`);
} else {
  console.log(`- package.json already up to date.`);
}
fs.writeFileSync(PACKAGE_PATH, `${JSON.stringify(pkg, null, 2)}\n`);

// 2. UPDATE CONSTANTS.TS
let constantsContent = fs.readFileSync(CONSTANTS_PATH, "utf-8");
const versionRegex = /export const SITE_VERSION = ".*";/;
const newVersionLine = `export const SITE_VERSION = "v${currentVersion}";`;

if (constantsContent.match(versionRegex)) {
  constantsContent = constantsContent.replace(versionRegex, newVersionLine);
  fs.writeFileSync(CONSTANTS_PATH, constantsContent);
  console.log(`✅ Updated src/constants.ts to v${currentVersion}`);
} else {
  console.warn(`⚠️ Could not find SITE_VERSION in constants.ts`);
}

// 3. UPDATE METADATA.JSON
// Use static project description instead of auto-generated from versions
const metadata = {
  name: `odadream-site-v${currentVersion}`,
  description:
    "ODA.dream — художественный дуэт на пересечении искусства, науки и технологий: партисипаторные перформансы, медиаискусство, нейротехнологии, ЭЭГ и компьютерное зрение.",
  requestFramePermissions: [],
};
fs.writeFileSync(METADATA_PATH, `${JSON.stringify(metadata, null, 2)}\n`);
console.log(`✅ Updated metadata.json`);

// 4. UPDATE README.MD
let readme = fs.readFileSync(README_PATH, "utf-8");
const badgeRegex =
  /!\[Version\]\(https:\/\/img\.shields\.io\/badge\/version-.*-emerald\)/;
const newBadge = `![Version](https://img.shields.io/badge/version-${currentVersion}-emerald)`;

if (readme.match(badgeRegex)) {
  readme = readme.replace(badgeRegex, newBadge);
  fs.writeFileSync(README_PATH, readme);
  console.log(`✅ Updated README.md badge`);
}

// 5. GENERATE VERSIONS.MD (derived from versions.json)
const versionsHeader = `# Version History | История Версий

> This file is auto-generated from \`versions.json\`.
> Do not edit manually. Use \`npm run version:sync\` after updating \`versions.json\`.
`;

const versionsBody = history
  .map((h) => {
    const dateStr = h.date ? `**Date:** ${h.date}\n\n` : "";
    const dateRuStr = h.date ? `**Дата:** ${h.date}\n\n` : "";
    return `## v${h.version} - ${h.title_en} | ${h.title_ru}
${dateStr}${h.desc_en}

---

${dateRuStr}${h.desc_ru}

---`;
  })
  .join("\n\n");

fs.writeFileSync(VERSIONS_MD_PATH, `${versionsHeader}\n\n${versionsBody}\n`);
console.log(`✅ Regenerated versions.md`);

// 6. GENERATE CHANGELOG.MD
const changelogHeader = `---
id: hub-changelog
parent: hub-home
title_en: Changelog
title_ru: Лог изменений
type: content
tags: [system, version]
order: 8
---

## SYSTEM CHANGELOG
**Interface Evolution Log**

Tracking the architectural metamorphosis of the ODA.dream.
`;

const changelogEn = history
  .map((h) => {
    const dateStr = h.date ? `\n**Date:** ${h.date}\n` : "";
    return `
### v${h.version}${h.version === currentVersion ? " (Current)" : ""}
**${h.title_en}**${dateStr}
${h.desc_en}`;
  })
  .join("\n");

const divider = `\n\n---RU---\n
## ИСТОРИЯ ИЗМЕНЕНИЙ
**Лог Эволюции Интерфейса**

Отслеживание архитектурных метаморфоз ODA.dream.
`;

const changelogRu = history
  .map((h) => {
    const dateStr = h.date ? `\n**Дата:** ${h.date}\n` : "";
    return `
### v${h.version}${h.version === currentVersion ? " (Текущая)" : ""}
**${h.title_ru}**${dateStr}
${h.desc_ru}`;
  })
  .join("\n");

const fullChangelog = changelogHeader + changelogEn + divider + changelogRu;
fs.writeFileSync(CHANGELOG_PATH, fullChangelog);
console.log(`✅ Regenerated src/content/changelog.md`);

console.log(`\n✨ VERSION SYNC COMPLETE. SYSTEM READY.`);
