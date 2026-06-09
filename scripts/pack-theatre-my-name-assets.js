/**
 * Pack Theatre of My Name field photos.
 * Usage: node scripts/pack-theatre-my-name-assets.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DL = "C:/Users/daler/Downloads";
const OUT = path.join(ROOT, "public/images/content/works/theatre-my-name");

const MAX = 1920;
const Q = 82;
const THUMB = 480;

const FILES = [
  {
    src: path.join(DL, "DSC_6817.jpg"),
    out: "tim-kod-provincii-hero",
    cover: true,
  },
  {
    src: path.join(DL, "DSC_6821.jpg"),
    out: "tim-kod-provincii-02",
  },
  {
    src: path.join(DL, "2024-06-21 21-07-34.JPG"),
    out: "tim-ashram-2024-06",
  },
  {
    src: path.join(DL, "2024-07-12 20-54-31.JPG"),
    out: "tim-ashram-2024-07",
  },
  {
    src: path.join(DL, "2025-07-13 11-49-29.JPG"),
    out: "tim-ashram-2025-07",
  },
  {
    src: path.join(DL, "WhatsApp Image 2020-03-15 at 18.09.30.jpeg"),
    out: "tim-korablik-2020-archive",
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

for (const { src, out, cover } of FILES) {
  if (!fs.existsSync(src)) {
    console.error("MISSING", src);
    continue;
  }
  const webp = path.join(OUT, `${out}.webp`);
  await toWebp(src, webp);
  console.log("OK", out);
  if (cover) {
    await toThumb(src, path.join(OUT, `${out}-thumb.webp`));
    console.log("OK thumb", out);
  }
}
