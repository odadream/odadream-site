/**
 * Pack Emomandala assets — pendant, charm, laser samples, abundance palette.
 * Usage: node scripts/pack-emomandala-assets.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BASE = "D:/YandexDisk/_ODA2/Украшения и объекты/LV2 Emo-mandala";
const OUT = path.join(ROOT, "public/images/content/materia/emomandala");

const MAX = 1920;
const Q = 82;
const THUMB = 480;

const FILES = [
  {
    src: path.join(BASE, "_Export/2022-11-10 14-11-16_1669184008.JPG"),
    out: "photo-pendant-front",
    cover: true,
  },
  {
    src: path.join(BASE, "_Export/2022-11-10 14-07-40.JPG"),
    out: "photo-pendant-back",
  },
  {
    src: path.join(BASE, "_Export/Mandala test set v3.png"),
    out: "mandala-ring-sizes",
  },
  {
    src: path.join(BASE, "_Export/Render4_cut.png"),
    out: "render-charm",
  },
  {
    src: path.join(BASE, "v2 Шарм/WhatsApp Image 2022-11-22 at 06.50.23.jpeg"),
    out: "photo-charm",
  },
  {
    src: path.join(BASE, "Mandala variations.png"),
    out: "laser-material-variations",
  },
  {
    src: path.join(BASE, "Кулон солнцестояние-2.png"),
    out: "abundance-color-palette",
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
  if (!fs.existsSync(src)) {
    console.warn("MISSING", src);
    continue;
  }
  await toWebp(src, path.join(OUT, `${out}.webp`));
  console.log("OK", out);
  if (cover) coverSrc = src;
}

if (coverSrc) {
  await toWebp(coverSrc, path.join(OUT, "emomandala-cover.webp"));
  await toThumb(coverSrc, path.join(OUT, "emomandala-cover-thumb.webp"));
  console.log("OK cover");
}

console.log("Done.");
