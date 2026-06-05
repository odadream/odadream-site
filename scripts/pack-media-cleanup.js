/**
 * Compress oversized heroes/covers to WebP.
 *
 * Layout (public/images/content/):
 *   materia/<id>/   — jewellery & objects (hub-materia)
 *   works/<id>/     — installations & performances
 *   events/<slug>/  — event photo galleries
 *   proofs/         — scanned letters & diplomas (collab_*.webp)
 *   *.webp          — lecture/mindshow posters (root)
 *
 * Video: public/media/works/<id>/*.m4v
 *
 * Usage: npm run media:cleanup
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const IMG = path.join(ROOT, "public/images/content");

const MAX = 1920;
const Q = 82;
const THUMB = 640;

async function toWebp(src, dest, max = MAX) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp(src)
    .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
    .webp({ quality: Q, effort: 4 })
    .toFile(dest);
  const kb = Math.round(fs.statSync(dest).size / 1024);
  console.log(`OK ${path.basename(dest)} (${kb} KB)`);
}

const jobs = [
  {
    src: path.join(IMG, "events/byob-2020/projection-pentagon.jpg"),
    dest: path.join(IMG, "events/byob-2020/projection-pentagon.webp"),
  },
  {
    src: path.join(IMG, "events/byob-2026/neuromandala-installation.jpg"),
    dest: path.join(IMG, "events/byob-2026/neuromandala-installation.webp"),
  },
  {
    src: path.join(IMG, "works/byob-2019-mindgrid.png"),
    dest: path.join(IMG, "works/byob-2019-mindgrid.webp"),
  },
  {
    src: path.join(IMG, "neuromandala-cover.svg"),
    dest: path.join(IMG, "neuromandala-cover.webp"),
    max: 1200,
  },
  {
    src: path.join(IMG, "art-brain.svg"),
    dest: path.join(IMG, "art-brain.webp"),
    max: 1200,
  },
  {
    src: path.join(IMG, "jewellery.svg"),
    dest: path.join(IMG, "jewellery.webp"),
    max: 1200,
  },
];

for (const { src, dest, max } of jobs) {
  if (!fs.existsSync(src)) {
    console.warn("SKIP missing", src);
    continue;
  }
  await toWebp(src, dest, max ?? MAX);
}
