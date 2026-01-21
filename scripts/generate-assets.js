import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public", "images");

// --- COLORS ---
const COLORS = {
  bg: "#09090b", // Zinc 950
  accent: "#10b981", // Emerald 500
  dim: "#27272a", // Zinc 800
  highlight: "#3f3f46", // Zinc 700
};

// --- SVG GENERATOR ---
const generateSVG = (id, type = "abstract") => {
  // Deterministic pseudo-random based on string ID
  let seed = 0;
  for (let i = 0; i < id.length; i++) seed = (seed + id.charCodeAt(i)) % 1000;

  const rand = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const width = 800;
  const height = 800;

  // Base Styles
  let elements = "";

  // 1. Gradient Background
  const gradientId = `grad-${id}`;
  const darkFactor = rand() > 0.5 ? 20 : 0; // Randomly darker
  elements += `
    <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${COLORS.bg};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#050505;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#${gradientId})" />
    `;

  // 2. Abstract Shapes (Neural/Tech Vibe)
  const shapeCount = 5 + Math.floor(rand() * 10);

  for (let i = 0; i < shapeCount; i++) {
    const type = rand();
    const opacity = 0.05 + rand() * 0.1; // Low opacity for subtle background
    const x = Math.floor(rand() * width);
    const y = Math.floor(rand() * height);
    const size = 50 + Math.floor(rand() * 300);

    if (type < 0.33) {
      // Circle
      elements += `<circle cx="${x}" cy="${y}" r="${size / 2}" fill="${
        COLORS.accent
      }" fill-opacity="${opacity}" />`;
    } else if (type < 0.66) {
      // Rect (Grid lines)
      const w = rand() > 0.5 ? width : 2;
      const h = w === width ? 2 : height;
      elements += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${
        COLORS.highlight
      }" fill-opacity="${opacity * 2}" />`;
    } else {
      // Stroked Circle (Ring)
      elements += `<circle cx="${x}" cy="${y}" r="${size / 3}" stroke="${
        COLORS.dim
      }" stroke-width="2" fill="none" opacity="${opacity * 3}" />`;
    }
  }

  // 3. Add ID text for debugging/aesthetic (very subtle)
  elements += `<text x="40" y="${
    height - 40
  }" font-family="monospace" font-size="24" fill="${
    COLORS.dim
  }" opacity="0.5">${id.toUpperCase()}</text>`;

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    ${elements}
</svg>`;
};

// --- UTILS ---
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

const downloadImage = (url, dest) => {
  return new Promise((resolve, reject) => {
    // Fallback for content images if download fails
    const fallback = () => {
      console.warn(
        `⚠️  Failed to download ${path.basename(
          dest
        )}. Generating fallback SVG.`
      );
      // Create a fallback content image (jpg extension but svg content? No, better to rename or force SVG)
      // Ideally we'd replace the file. For now, let's try to fetch.
      reject("Network error");
    };

    const file = fs.createWriteStream(dest);
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log(`Downloaded: ${path.basename(dest)}`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, dest)
          .then(resolve)
          .catch(reject);
      } else {
        file.close();
        fs.unlink(dest, () => {});
        reject(`Status ${response.statusCode}`);
      }
    });

    request.on("error", (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err.message);
    });
  });
};

// --- DATA ---
const nodes = [
  "home",
  "neuromandala",
  "works",
  "events",
  "collab",
  "world",
  "contacts",
  "games",
  "neurobattle",
  "brain-hack",
  "journey",
  "lectures",
  "art-brain",
  "sound-brain",
  "taste-brain",
  "color-brain",
  "empathy",
  "neuroaesthetics-lec",
  "workshops",
  "neuro-dance",
  "neurosync",
  "gong",
  "coaching",
  "mindshow",
  "research",
  "heritage",
  "schrodinger",
  "sync-circle",
  "dashran",
  "posustoronniy",
  "objects",
  "mom-baby",
  "jewellery",
  "emomandala",
  "chastoti",
  "terraforming",
  "portal",
  "byob",
  "pleinair",
  "for-events",
  "for-business",
  "for-galleries",
  "for-artists",
  "manifesto",
  "team",
  "press",
  "testimonials",
  "acknowledgments",
];

const contentImages = [
  {
    name: "neuromandala-cover.jpg",
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200",
  },
  {
    name: "art-brain.jpg",
    url: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?q=80&w=800",
  },
  {
    name: "jewellery.jpg",
    url: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800",
  },
];

// --- MAIN ---
const run = async () => {
  console.log("--- GENERATING ASSETS ---");

  // 1. Setup Directories
  const nodesDir = path.join(PUBLIC_DIR, "nodes");
  const contentDir = path.join(PUBLIC_DIR, "content");
  ensureDir(nodesDir);
  ensureDir(contentDir);

  // 2. Generate Abstract Node Backgrounds (SVG)
  console.log("\nGenerating Abstract Node SVGs...");
  nodes.forEach((id) => {
    const svgContent = generateSVG(id);
    const filePath = path.join(nodesDir, `${id}.svg`);
    fs.writeFileSync(filePath, svgContent);
  });
  console.log(`✓ Generated ${nodes.length} SVG backgrounds.`);

  // 3. Download Content Images (Try real, fallback if fails is complicated, so just try)
  console.log("\nDownloading Content Images...");
  for (const img of contentImages) {
    const dest = path.join(contentDir, img.name);
    if (fs.existsSync(dest)) {
      console.log(`Skipping (exists): ${img.name}`);
      continue;
    }

    try {
      await downloadImage(img.url, dest);
    } catch (e) {
      console.error(`x Failed to download ${img.name}: ${e}`);
      // Generate a fallback JPG (empty or simple svg renamed? Browsers might hate that).
      // For now, we will log error. The browser will show broken image icon if missing.
    }
  }

  console.log("\n--- COMPLETE ---");
  console.log(`Assets ready in ${PUBLIC_DIR}`);
};

run();
