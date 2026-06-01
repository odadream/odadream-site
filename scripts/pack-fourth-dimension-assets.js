/**
 * Pack Fourth Dimension pendant assets (formerly Two Waves archive folder).
 * Usage: node scripts/pack-fourth-dimension-assets.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BASE =
  "D:/YandexDisk/_ODA2/Украшения и объекты/LV2 Neuro-mandala/Gen 4 - Blinovskaya/Gen 3 - Enamel Updated";
const OUT = path.join(ROOT, "public/images/content/materia/fourth-dimension");
const DOCS = path.join(ROOT, "public/documents");

const MAX = 1920;
const Q = 82;
const THUMB = 480;

const FILES = [
  {
    src: "Фото и видео/2023-02-02 13-53-09_1675348840.JPG",
    out: "photo-product",
    cover: true,
  },
  {
    src: "Render/ViewCapture20230122_022343.jpg",
    out: "render-front",
  },
  {
    src: "Render/ViewCapture20230122_022721.jpg",
    out: "render-back",
  },
  {
    src: "TZ/Версия 2.00_01_25_20.Still001.png",
    out: "neuromandala-source",
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
  const abs = path.join(BASE, src);
  if (!fs.existsSync(abs)) {
    console.warn("MISSING", abs);
    continue;
  }
  await toWebp(abs, path.join(OUT, `${out}.webp`));
  console.log("OK", out);
  if (cover) coverSrc = abs;
}

if (coverSrc) {
  await toWebp(coverSrc, path.join(OUT, "fourth-dimension-cover.webp"));
  await toThumb(coverSrc, path.join(OUT, "fourth-dimension-cover-thumb.webp"));
  console.log("OK cover");
}

const pdfSrc = path.join(BASE, "TZ/ТЗ v2 - кулон и мешочек.pdf");
const pdfDest = path.join(DOCS, "fourth-dimension-tz-v2.pdf");
if (fs.existsSync(pdfSrc)) {
  fs.copyFileSync(pdfSrc, pdfDest);
  console.log("OK PDF", pdfDest);
}

console.log("Done.");
