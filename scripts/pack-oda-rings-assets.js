/**
 * Pack ODA.dream Rings — Instagram story (1–9), technical PDF, Synergy banner PDF.
 * Usage: node scripts/pack-oda-rings-assets.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BASE = "D:/YandexDisk/_ODA2/Украшения и объекты/LV2 Wave Based/Gen 1 - Arabovs Ring";
const OUT = path.join(ROOT, "public/images/content/materia/oda-rings");
const DOCS = path.join(ROOT, "public/documents");

const MAX = 1920;
const Q = 82;
const THUMB = 480;

const IG = [
  { file: "Instagram/1.png", slug: "ig-01-hero" },
  { file: "Instagram/2.png", slug: "ig-02-wedding" },
  { file: "Instagram/3.png", slug: "ig-03-sketch" },
  { file: "Instagram/4.png", slug: "ig-04-workshop" },
  { file: "Instagram/5.png", slug: "ig-05-model-eeg" },
  { file: "Instagram/6.png", slug: "ig-06-hands" },
  { file: "Instagram/7.png", slug: "ig-07-flight" },
  { file: "Instagram/8.png", slug: "ig-08-dream-photo" },
  { file: "Instagram/9.png", slug: "ig-09-lempuyang" },
];

async function toWebp(src, dest) {
  await sharp(src)
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: Q, effort: 4 })
    .toFile(dest);
}

async function toThumb(src, dest) {
  await sharp(src)
    .resize({ width: THUMB, height: THUMB, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78, effort: 4 })
    .toFile(dest);
}

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(DOCS, { recursive: true });

for (const { file, slug } of IG) {
  const src = path.join(BASE, file);
  if (!fs.existsSync(src)) {
    console.warn("MISSING", src);
    continue;
  }
  const webp = path.join(OUT, `${slug}.webp`);
  await toWebp(src, webp);
  console.log("OK", slug);
}

const heroSrc = path.join(BASE, "Instagram/1.png");
await toWebp(heroSrc, path.join(OUT, "oda-rings-cover.webp"));
await toThumb(heroSrc, path.join(OUT, "oda-rings-cover-thumb.webp"));
console.log("OK cover from ig-01");

const bannerJpg = path.join(BASE, "Banner/IMG_20211121_172859.jpg");
if (fs.existsSync(bannerJpg)) {
  await toWebp(bannerJpg, path.join(OUT, "synergy-banner-preview.webp"));
  await toThumb(bannerJpg, path.join(OUT, "synergy-banner-preview-thumb.webp"));
  console.log("OK synergy-banner-preview");
}

const drawingsSrc = path.join(BASE, "5 ODA.Dream - Arabov rings - v220927.pdf");
const bannerPdfSrc = path.join(BASE, "Banner/ODA x-banner v3 EN.pdf");
const drawingsDest = path.join(DOCS, "oda-rings-drawings-v220927.pdf");
const bannerDest = path.join(DOCS, "oda-rings-synergy-banner-2022.pdf");

if (fs.existsSync(drawingsSrc)) {
  fs.copyFileSync(drawingsSrc, drawingsDest);
  console.log("OK PDF", drawingsDest);
}
if (fs.existsSync(bannerPdfSrc)) {
  fs.copyFileSync(bannerPdfSrc, bannerDest);
  console.log("OK PDF", bannerDest);
}

console.log("Done.");
