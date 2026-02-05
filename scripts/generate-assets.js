
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public'); // Fixed: Look at root public, not just images
const CONTENT_SRC_DIR = path.join(PROJECT_ROOT, 'src', 'content');

// --- DESIGN SYSTEM TOKENS ---
const PALETTE = {
    bg: ['#050505', '#09090b', '#18181b'], // Zinc 950-900
    
    // Style A: Nodes (System/Structure)
    node: {
        accent: '#10b981',   // Emerald 500
        accentDim: '#064e3b', // Emerald 900
        grid: '#27272a',     // Zinc 800
        text: '#52525b'      // Zinc 600
    },

    // Style B: Content (Data/Artifacts)
    content: {
        accent: '#a855f7',   // Purple 500
        accentDim: '#4c1d95', // Purple 900
        secondary: '#06b6d4', // Cyan 500
        grid: '#3f3f46',     // Zinc 700
        text: '#71717a'      // Zinc 500
    }
};

// --- SEEDED RANDOM ---
class Random {
    constructor(seedStr) {
        this.seed = 0;
        for (let i = 0; i < seedStr.length; i++) {
            this.seed = (this.seed + seedStr.charCodeAt(i)) % 2147483647;
        }
    }

    // 0 to 1
    next() {
        this.seed = (this.seed * 16807) % 2147483647;
        return (this.seed - 1) / 2147483646;
    }

    // min to max
    range(min, max) {
        return min + this.next() * (max - min);
    }

    // true/false
    bool(chance = 0.5) {
        return this.next() < chance;
    }
}

// --- SVG GENERATOR ENGINE ---
const generateRichSVG = (id, type = 'node', width = 1200, height = 800) => {
    const rng = new Random(id);
    const theme = type === 'content' ? PALETTE.content : PALETTE.node;
    
    // Config based on ID hash
    const density = Math.floor(rng.range(10, type === 'content' ? 40 : 25));
    const hasGrid = rng.bool(0.7);
    const hasOrganic = type === 'node' ? rng.bool(0.6) : rng.bool(0.2);
    
    // --- DEFS ---
    const defs = `
    <defs>
        <filter id="noise-${id}" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="${rng.range(0.6, 0.9)}" numOctaves="3" result="noise"/>
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0" in="noise" result="coloredNoise"/>
            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite"/>
        </filter>
        <linearGradient id="grad-main-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${PALETTE.bg[0]}" />
            <stop offset="50%" stop-color="${PALETTE.bg[1]}" />
            <stop offset="100%" stop-color="${PALETTE.bg[2]}" />
        </linearGradient>
        <radialGradient id="glow-${id}" cx="${rng.range(20, 80)}%" cy="${rng.range(20, 80)}%" r="60%">
            <stop offset="0%" stop-color="${theme.accentDim}" stop-opacity="${type === 'content' ? 0.25 : 0.15}" />
            <stop offset="100%" stop-color="${PALETTE.bg[0]}" stop-opacity="0" />
        </radialGradient>
        <pattern id="grid-${id}" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${theme.grid}" stroke-width="0.5" stroke-opacity="0.3"/>
        </pattern>
    </defs>
    `;

    // --- LAYERS ---
    let layers = [];

    // 1. Background
    layers.push(`<rect width="100%" height="100%" fill="url(#grad-main-${id})" />`);
    layers.push(`<rect width="100%" height="100%" fill="url(#glow-${id})" />`);
    if (hasGrid) layers.push(`<rect width="100%" height="100%" fill="url(#grid-${id})" opacity="0.5" />`);

    // 2. Data Streams
    for (let i = 0; i < density; i++) {
        const isVertical = type === 'node' ? rng.bool() : false; 
        const thickness = type === 'content' ? rng.range(1, 4) : rng.range(0.5, 2);
        const opacity = rng.range(0.05, 0.2);
        const pos = rng.range(0, 100);
        
        if (isVertical) {
            layers.push(`<rect x="${pos}%" y="0" width="${thickness}" height="100%" fill="${theme.text}" opacity="${opacity}" />`);
        } else {
            layers.push(`<rect x="0" y="${pos}%" width="100%" height="${thickness}" fill="${type === 'content' ? theme.accent : theme.text}" opacity="${opacity}" />`);
            if (type === 'content' && rng.bool(0.2)) {
                 const x = rng.range(0, 80);
                 const w = rng.range(5, 20);
                 layers.push(`<rect x="${x}%" y="${pos}%" width="${w}%" height="${thickness * 3}" fill="${theme.secondary || theme.accent}" opacity="${opacity * 3}" />`);
            }
        }
    }

    // 3. Technical Label (The ID)
    layers.push(`
        <text x="30" y="${height - 30}" font-family="monospace" font-size="14" fill="${theme.accent}" opacity="0.6" letter-spacing="4">
            ${id.toUpperCase()} // ${type === 'content' ? 'MEDIA.ASSET' : 'SYS.NODE'}
        </text>
    `);
    
    // 4. Center Label for Content Placeholders
    if (type === 'content') {
        const shortName = id.length > 15 ? id.substring(0, 12) + '...' : id;
        layers.push(`
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="24" fill="${theme.text}" opacity="0.8" letter-spacing="2">
                [MISSING_ASSET]
            </text>
            <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="12" fill="${theme.grid}" opacity="0.8">
                ${shortName}
            </text>
        `);
    }

    // 5. Noise
    layers.push(`<rect width="100%" height="100%" filter="url(#noise-${id})" opacity="0.3" pointer-events="none" />`);

    return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    ${defs}
    ${layers.join('\n    ')}
</svg>`;
};


// --- UTILS ---
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const getNodesFromContent = () => {
    if (!fs.existsSync(CONTENT_SRC_DIR)) {
        console.warn(`Source content directory not found: ${CONTENT_SRC_DIR}`);
        return { ids: [], assets: new Set() };
    }
    
    const files = fs.readdirSync(CONTENT_SRC_DIR).filter(f => f.endsWith('.md'));
    const ids = [];
    const assets = new Set();

    files.forEach(file => {
        const content = fs.readFileSync(path.join(CONTENT_SRC_DIR, file), 'utf-8');
        
        // 1. Extract ID
        const idMatch = content.match(/^id:\s*([a-zA-Z0-9-_]+)/m);
        const id = idMatch ? idMatch[1].trim() : path.parse(file).name;
        ids.push(id);

        // 2. Extract Frontmatter Images (image: /path/to/img)
        const frontImageMatch = content.match(/^(?:image|media):\s*(.+)$/m);
        if (frontImageMatch) {
            const cleanPath = frontImageMatch[1].trim();
            if (cleanPath.startsWith('/') && !cleanPath.endsWith('.svg')) assets.add(cleanPath);
        }

        // 3. Extract Wiki Links ![[url|...|poster]]
        const wikiRegex = /!\[\[(.*?)\]\]/g;
        let match;
        while ((match = wikiRegex.exec(content)) !== null) {
            const parts = match[1].split('|').map(s => s.trim());
            // URL (index 0)
            if (parts[0] && parts[0].startsWith('/') && !parts[0].endsWith('.svg')) assets.add(parts[0]);
            // Poster (index 2)
            if (parts[2] && parts[2].startsWith('/') && !parts[2].endsWith('.svg')) assets.add(parts[2]);
        }
        
        // 4. Extract Standard Markdown Images ![...](url)
        const mdRegex = /!\[.*?\]\((.*?)\)/g;
        while ((match = mdRegex.exec(content)) !== null) {
            const url = match[1].trim().split(' ')[0]; // Handle optional title after space
            if (url.startsWith('/') && !url.endsWith('.svg')) assets.add(url);
        }
    });

    return { ids: [...new Set(ids)], assets: Array.from(assets) };
};

// --- MAIN ---
const run = async () => {
    console.log('--- GENERATING ASSETS (CYBER-ORGANIC ENGINE V3) ---');
    
    // 1. Structure
    const nodesDir = path.join(PUBLIC_DIR, 'images', 'nodes');
    ensureDir(nodesDir);

    const { ids: contentIds, assets: localAssets } = getNodesFromContent();
    const staticNodes = ['home', 'neuromandala', 'works', 'events', 'collab', 'world', 'contacts', 'changelog', 'navigator', 'debug', 'debug-video', 'debug-audio', 'debug-image', 'debug-hub', 'debug-article'];
    const allNodes = [...new Set([...staticNodes, ...contentIds])];

    // 2. Generate Node Backgrounds
    console.log(`\n> Checking Node Backgrounds (${allNodes.length})...`);
    allNodes.forEach(id => {
        const filePath = path.join(nodesDir, `${id}.svg`);
        if (!fs.existsSync(filePath)) {
            const svgContent = generateRichSVG(id, 'node');
            fs.writeFileSync(filePath, svgContent);
            console.log(`  + Generated node: ${id}.svg`);
        }
    });

    // 3. Generate Missing Local Assets (Content Placeholders)
    console.log(`\n> Checking Local Content Assets (${localAssets.length})...`);
    let missingCount = 0;

    localAssets.forEach(relPath => {
        // Remove leading slash for filesystem path
        const fsRelPath = relPath.startsWith('/') ? relPath.substring(1) : relPath;
        const absPath = path.join(PUBLIC_DIR, fsRelPath);
        
        if (!fs.existsSync(absPath)) {
            // Target file is missing. 
            // We do NOT write a .jpg (binary mismatch). We write a .svg alongside it.
            // The app must be smart enough to look for .svg if .jpg fails.
            
            const dir = path.dirname(absPath);
            ensureDir(dir);

            const pathObj = path.parse(absPath);
            const svgPath = path.join(dir, `${pathObj.name}.svg`);
            
            if (!fs.existsSync(svgPath)) {
                // Use the filename as seed
                const seed = pathObj.name;
                const svgContent = generateRichSVG(seed, 'content', 1200, 800);
                fs.writeFileSync(svgPath, svgContent);
                console.log(`  + Generated fallback for missing: ${relPath} -> ${pathObj.name}.svg`);
                missingCount++;
            }
        }
    });

    if (missingCount === 0) {
        console.log("  ✓ All local assets present (or have SVG fallbacks).");
    }

    console.log('\n--- ASSETS COMPLETE ---');
};

run();
