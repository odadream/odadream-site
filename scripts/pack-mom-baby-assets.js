/**
 * Pack Mom & Baby assets from curated archive picks.
 * Usage: node scripts/pack-mom-baby-assets.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ARCHIVE = "D:/YandexDisk/_ODA2/Украшения и объекты/LV2 Mom and Baby";
const BORZIH = path.join(ARCHIVE, "Gen 2 - Borzih");
const OUT = path.join(ROOT, "public/images/content/materia/mom-baby");
const DOCS = path.join(ROOT, "public/documents");

const MAX = 1920;
const Q = 82;
const THUMB = 480;

const FILES = [
  { src: path.join(BORZIH, "Photos/Cover3.jpg"), out: "photo-borzikh-main", cover: true },
  { src: path.join(BORZIH, "Photos/unnamed_11_cut.jpg"), out: "photo-parts-two-pendants" },
  { src: path.join(BORZIH, "Photos/unnamed_10.jpg"), out: "photo-on-leaves" },
  { src: path.join(BORZIH, "Photos/unnamed_7.jpg"), out: "photo-gift-set" },
  { src: path.join(BORZIH, "_Export/2022-09-08_16-31-41.png"), out: "rhino-drawing" },
  { src: path.join(ARCHIVE, "Instagram/V1/IMG_20221209_125543_914.jpg"), out: "photo-baby-leg" },
  {
    src: path.join(ARCHIVE, "Мать и Дитя/Source/2023-02-04 13-43-04.JPG"),
    out: "photo-with-statuette",
  },
  { src: path.join(ARCHIVE, "_Photo Various/2023-04-04 17-52-29.JPG"), out: "photo-iowa-gift" },
];

const PDFS = [
  {
    src: path.join(BORZIH, "ODA.Dream - Sasha pendant - v220920.pdf"),
    dest: "mom-baby-drawings-v220920.pdf",
  },
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

let coverSrc = null;
for (const { src, out, cover } of FILES) {
  if (!fs.existsSync(src)) {
    console.warn("MISSING", src);
    continue;
  }
  await toWebp(src, path.join(OUT, `${out}.webp`));
  console.log("OK", out);
  if (cover) coverSrc = src;
}

if (coverSrc) {
  await toWebp(coverSrc, path.join(OUT, "mom-baby-cover.webp"));
  await toThumb(coverSrc, path.join(OUT, "mom-baby-cover-thumb.webp"));
  console.log("OK cover");
}

for (const { src, dest } of PDFS) {
  if (!fs.existsSync(src)) {
    console.warn("MISSING", src);
    continue;
  }
  fs.copyFileSync(src, path.join(DOCS, dest));
  console.log("OK PDF", dest);
}

console.log("Done.");
