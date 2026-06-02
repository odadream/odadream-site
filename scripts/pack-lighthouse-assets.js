/**
 * Pack Lighthouse installation assets (LV3 Маяк / Export).
 * Usage: node scripts/pack-lighthouse-assets.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BASE = "D:/YandexDisk/_ODA2/Украшения и объекты/LV3 Маяк/Export";
const OUT_IMG = path.join(ROOT, "public/images/content/works/lighthouse");
const OUT_VID = path.join(ROOT, "public/media/works/lighthouse");

const MAX = 1920;
const Q = 82;
const THUMB = 480;

const IMAGES = [
  { src: "01_Alpha.png", out: "state-alpha" },
  { src: "01_Theta.png", out: "state-theta" },
  { src: "02_Blended3.png", out: "blend-multi-1" },
  { src: "02_Blended4.png", out: "blend-multi-2" },
  { src: "03_Shaped2.png", out: "sections-shaped", cover: true },
];

const VIDEOS = [
  { src: "04_Blended_Spin.m4v", out: "blended-spin" },
  { src: "04_Spin2.m4v", out: "spin-twist" },
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

fs.mkdirSync(OUT_IMG, { recursive: true });
fs.mkdirSync(OUT_VID, { recursive: true });

let coverSrc = null;
for (const { src, out, cover } of IMAGES) {
  const abs = path.join(BASE, src);
  if (!fs.existsSync(abs)) {
    console.warn("MISSING", abs);
    continue;
  }
  await toWebp(abs, path.join(OUT_IMG, `${out}.webp`));
  console.log("OK", out);
  if (cover) coverSrc = abs;
}

if (coverSrc) {
  await toWebp(coverSrc, path.join(OUT_IMG, "lighthouse-cover.webp"));
  await toThumb(coverSrc, path.join(OUT_IMG, "lighthouse-cover-thumb.webp"));
  console.log("OK cover");
}

for (const { src, out } of VIDEOS) {
  const abs = path.join(BASE, src);
  if (!fs.existsSync(abs)) {
    console.warn("MISSING", abs);
    continue;
  }
  fs.copyFileSync(abs, path.join(OUT_VID, `${out}.m4v`));
  console.log("OK video", out);
}

console.log("Done.");
