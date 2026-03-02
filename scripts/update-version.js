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

console.log(`\n🔄 SYNCHRONIZING VERSION: ${currentVersion}...\n`);

// 1. UPDATE PACKAGE.JSON
const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf-8"));
if (pkg.version !== currentVersion) {
  pkg.version = currentVersion;
  fs.writeFileSync(PACKAGE_PATH, JSON.stringify(pkg, null, 2));
  console.log(`✅ Updated package.json to ${currentVersion}`);
} else {
  console.log(`- package.json already up to date.`);
}

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
// Generate description from the last 3 versions
const metaDesc =
  history
    .slice(0, 3)
    .map((h) => {
      // Extract short tag from title (e.g. "Tech Noir") or use version logic
      // We will stick to the format: "Feature (vX.X)."
      const shortDesc = h.desc_ru.split(".")[0]; // Take first sentence
      return `${shortDesc} (v${h.version.split(".").slice(0, 2).join(".")})`;
    })
    .join(". ") + ".";

const metadata = {
  name: `odadream-site-v${currentVersion}`,
  description: metaDesc,
  requestFramePermissions: [],
};
fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2));
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

// 5. GENERATE CHANGELOG.MD
const changelogHeader = `---
id: changelog
parent: home
title_en: Changelog
title_ru: Лог изменений
type: content
tags: [system, version]
order: 7
---

## SYSTEM CHANGELOG
**Interface Evolution Log**

Tracking the architectural metamorphosis of the ODA.dream.
`;

const changelogEn = history
  .map((h) => {
    return `
### v${h.version}${h.version === currentVersion ? " (Current)" : ""}
**${h.title_en}**
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
    return `
### v${h.version}${h.version === currentVersion ? " (Текущая)" : ""}
**${h.title_ru}**
${h.desc_ru}`;
  })
  .join("\n");

const fullChangelog = changelogHeader + changelogEn + divider + changelogRu;
fs.writeFileSync(CHANGELOG_PATH, fullChangelog);
console.log(`✅ Regenerated src/content/changelog.md`);

console.log(`\n✨ VERSION SYNC COMPLETE. SYSTEM READY.`);
