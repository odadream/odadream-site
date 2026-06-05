import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const contentDir = path.resolve(ROOT, "public/images/content");
const mediaDir = path.resolve(ROOT, "public/media");

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function toRel(abs) {
  const norm = path.resolve(abs);
  if (norm.startsWith(contentDir))
    return "/images/content" + norm.slice(contentDir.length).replace(/\\/g, "/");
  if (norm.startsWith(mediaDir))
    return "/media" + norm.slice(mediaDir.length).replace(/\\/g, "/");
  return norm;
}

const files = [...walk(contentDir), ...walk(mediaDir)];
const onDisk = new Map(files.map((f) => [toRel(f), f]));

const refs = new Set();
const refRes = [
  /["'](\/images\/content\/[^"']+|\/media\/[^"']+)/g,
  /!\[\[(\/images\/content\/[^\s|\]]+|\/media\/[^\s|\]]+)/g,
  /(?:^|\s)image:\s*(\/images\/content\/\S+)/gm,
  /(?:^|\s)asset:\s*(\/images\/content\/\S+)/gm,
  /(?:^|\s)media_url:\s*(\/images\/content\/\S+)/gm,
  /(?:^|\s)poster:\s*(\/images\/content\/\S+)/gm,
];

function scanDirSkipArchive(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === "_archive" || e.name === "CONTENT_TREE.md") continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) scanDirSkipArchive(p);
    else if (/\.(ts|tsx|md|json|js|css)$/.test(e.name)) {
      const t = fs.readFileSync(p, "utf8");
      for (const refRe of refRes) {
        let m;
        while ((m = refRe.exec(t))) refs.add(m[1]);
      }
    }
  }
}

["src", "scripts"].forEach((d) => scanDirSkipArchive(path.join(ROOT, d)));

const missing = [...refs].filter((r) => !onDisk.has(r)).sort();
const orphans = [...onDisk.keys()].filter((r) => !refs.has(r)).sort();

console.log("REFERENCED", refs.size, "ON_DISK", onDisk.size);
console.log("\n=== MISSING (" + missing.length + ") ===");
missing.forEach((x) => console.log(x));
console.log("\n=== ORPHANS (" + orphans.length + ") ===");
orphans.forEach((x) => {
  const s = fs.statSync(onDisk.get(x));
  console.log(Math.round(s.size / 1024) + "KB", x);
});
