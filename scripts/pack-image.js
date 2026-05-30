/**
 * Pack a large image for web: WebP master + optional JPEG fallback + thumb.
 *
 * Usage:
 *   npm run image:pack -- "D:/path/to/poster.png"
 *   npm run image:pack -- "poster.png" --out public/images/content/works/schrodinger-2025-poster
 *   npm run image:pack -- "photo.jpg" --max 1920 --thumb 640 --dry-run
 *
 * Defaults:
 *   --out   <basename without ext in same folder as input>
 *   --max   1920   (long edge, master WebP)
 *   --thumb 800    (long edge, -thumb.webp; 0 to skip)
 *   --quality 82   (WebP quality)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".tiff", ".tif"]);

function parseArgs(argv) {
  const out = {
    file: null,
    outBase: null,
    max: 1920,
    thumb: 800,
    quality: 82,
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") out.dryRun = true;
    else if (a === "--out" && argv[i + 1]) out.outBase = argv[++i];
    else if (a === "--max" && argv[i + 1]) out.max = Number(argv[++i]);
    else if (a === "--thumb" && argv[i + 1]) out.thumb = Number(argv[++i]);
    else if (a === "--quality" && argv[i + 1]) out.quality = Number(argv[++i]);
    else if (!a.startsWith("-") && !out.file) out.file = a;
  }
  return out;
}

function fmtKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function writeWebp(input, dest, maxEdge, quality) {
  const img = sharp(input);
  const meta = await img.metadata();
  const pipeline = img.resize({
    width: maxEdge,
    height: maxEdge,
    fit: "inside",
    withoutEnlargement: true,
  });
  await pipeline.webp({ quality, effort: 4 }).toFile(dest);
  const stat = fs.statSync(dest);
  return { meta, stat };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.file) {
    console.error(
      'Usage: npm run image:pack -- "<image>" [--out public/images/content/works/name] [--max 1920] [--thumb 800]',
    );
    process.exit(1);
  }

  const src = path.resolve(opts.file);
  if (!fs.existsSync(src)) {
    console.error(`File not found: ${src}`);
    process.exit(1);
  }
  const ext = path.extname(src).toLowerCase();
  if (!IMAGE_EXT.has(ext)) {
    console.error(`Unsupported extension: ${ext}`);
    process.exit(1);
  }

  const outBase = opts.outBase
    ? path.isAbsolute(opts.outBase)
      ? opts.outBase
      : path.join(ROOT, opts.outBase)
    : path.join(path.dirname(src), path.basename(src, ext));

  const masterPath = `${outBase}.webp`;
  const thumbPath = opts.thumb > 0 ? `${outBase}-thumb.webp` : null;

  const srcStat = fs.statSync(src);
  console.log(`Source: ${src} (${fmtKb(srcStat.size)})`);
  console.log(`Master: ${masterPath} (max ${opts.max}px, q${opts.quality})`);
  if (thumbPath) console.log(`Thumb:  ${thumbPath} (max ${opts.thumb}px)`);

  if (opts.dryRun) {
    console.log("[dry-run] No files written.");
    return;
  }

  fs.mkdirSync(path.dirname(masterPath), { recursive: true });

  const { meta: m0, stat: s0 } = await writeWebp(src, masterPath, opts.max, opts.quality);
  console.log(
    `[master] ${m0.width}×${m0.height} → ${masterPath} (${fmtKb(s0.size)}, −${((1 - s0.size / srcStat.size) * 100).toFixed(0)}%)`,
  );

  if (thumbPath) {
    const { stat: s1 } = await writeWebp(src, thumbPath, opts.thumb, Math.min(opts.quality, 78));
    console.log(`[thumb]  ${thumbPath} (${fmtKb(s1.size)})`);
  }

  const webMaster = masterPath.replace(/\\/g, "/").replace(/^.*\/public\//, "/");
  if (webMaster.startsWith("/images/")) {
    console.log(`\nWeb path: ${webMaster}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
