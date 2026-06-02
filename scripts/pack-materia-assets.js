/**
 * One-off ingest: copy hero + gallery WebP for hub-materia products.
 * Usage: node scripts/pack-materia-assets.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ARCHIVE = "D:/YandexDisk/_ODA2/Украшения и объекты";
const OUT = path.join(ROOT, "public", "images", "content", "materia");

const PACKS = [
  {
    id: "oda-rings",
    hero: "LV2 Wave Based/Gen 1 - Arabovs Ring/Photos/IMG_0223.JPG",
    gallery: [
      "LV2 Wave Based/Gen 1 - Arabovs Ring/Export/Ring_solo.png",
      "LV2 Wave Based/Gen 1 - Arabovs Ring/Pictures/TDMovieOut.0.png",
    ],
  },
  // lighthouse — use npm run pack:lighthouse
  // emomandala — use npm run pack:emomandala
];

const MAX = 1920;
const Q = 82;
const THUMB = 480;

function findInSnowflakes(filename) {
  const root = path.join(ARCHIVE, "OTH Снежинки");
  for (const name of fs.readdirSync(root)) {
    const p = path.join(root, name);
    if (!fs.statSync(p).isDirectory()) continue;
    const hit = path.join(p, filename);
    if (fs.existsSync(hit)) return hit;
  }
  throw new Error(`Not found under OTH Снежинки: ${filename}`);
}

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

for (const pack of PACKS) {
  const dir = path.join(OUT, pack.id);
  fs.mkdirSync(dir, { recursive: true });
  const heroSrc = path.join(ARCHIVE, pack.hero);
  if (!fs.existsSync(heroSrc)) {
    console.error("MISSING hero", pack.id, heroSrc);
    continue;
  }
  const cover = path.join(dir, `${pack.id}-cover.webp`);
  const coverThumb = path.join(dir, `${pack.id}-cover-thumb.webp`);
  await toWebp(heroSrc, cover);
  await toThumb(heroSrc, coverThumb);
  console.log("OK hero", pack.id);

  let n = 1;
  for (const rel of pack.gallery) {
    const src =
      typeof rel === "string"
        ? path.join(ARCHIVE, rel)
        : rel.find
          ? findInSnowflakes(rel.find)
          : null;
    if (!src || !fs.existsSync(src)) {
      console.warn("skip gallery", rel);
      continue;
    }
    const out = path.join(dir, `${pack.id}-${n}.webp`);
    await toWebp(src, out);
    console.log("  gallery", out);
    n++;
  }
}

console.log("Done.");
