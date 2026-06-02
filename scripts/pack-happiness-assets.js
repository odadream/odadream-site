/**
 * Pack Happiness snowflake assets (Emoto source + product photos).
 * Usage: node scripts/pack-happiness-assets.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BASE = "D:/YandexDisk/_ODA2/Украшения и объекты/OTH Снежинки";
const OUT = path.join(ROOT, "public/images/content/materia/happiness");

const MAX = 1920;
const Q = 82;
const THUMB = 480;

const FILES = [
  {
    src: "Postcard/Снежинка Счастье.png",
    out: "source-emoto-outline",
  },
  {
    src: "Фото/2022-12-11 19-16-19.JPG",
    out: "photo-gift-box",
    cover: true,
  },
  {
    src: "Фото/2022-12-11 15-54-29.JPG",
    out: "photo-front",
  },
  {
    src: "Фото/2022-12-11 16-03-08.JPG",
    out: "photo-back",
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
  await toWebp(coverSrc, path.join(OUT, "happiness-cover.webp"));
  await toThumb(coverSrc, path.join(OUT, "happiness-cover-thumb.webp"));
  console.log("OK cover");
}

console.log("Done.");
