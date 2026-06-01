/**
 * Pack Voronka (Funnel / Vortex) assets — Gen 2 Grishina archive.
 * Usage: node scripts/pack-voronka-assets.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BASE =
  "D:/YandexDisk/_ODA2/Украшения и объекты/LV2 Neuro-mandala/Gen 2 - Grishina";
const OUT = path.join(ROOT, "public/images/content/materia/voronka");

const MAX = 1920;
const Q = 82;
const THUMB = 480;

const FILES = [
  {
    src: "photo_2023-01-30_16-13-11.jpg",
    out: "photo-set",
    cover: true,
  },
  {
    src: "photo_2023-01-16_23-04-12.jpg",
    out: "photo-detail",
  },
  {
    src: "Export/2022-11-26_15-02-48.png",
    out: "render-hero",
  },
  {
    src: "Export/2022-11-26_15-02-08.png",
    out: "render-exploded",
  },
  {
    src: "Export/2022-11-26_13-12-53.png",
    out: "render-section",
  },
  {
    src: "Мечта/vlcsnap-2022-11-03-11h36m29s601.png",
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
  await toWebp(coverSrc, path.join(OUT, "voronka-cover.webp"));
  await toThumb(coverSrc, path.join(OUT, "voronka-cover-thumb.webp"));
  console.log("OK cover");
}

console.log("Done.");
