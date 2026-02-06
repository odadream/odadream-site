
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const CONTENT_SRC_DIR = path.join(PROJECT_ROOT, 'src', 'content');

// --- VIBRANT DESIGN SYSTEM TOKENS ---
const PALETTES = [
    // Cyberpunk Neon
    ['#FF0055', '#0038A8', '#00FF99', '#FFFF00', '#121212'],
    // Sunset Synth
    ['#F72585', '#7209B7', '#3A0CA3', '#4361EE', '#4CC9F0'],
    // Toxic Jungle
    ['#D9ED92', '#B5E48C', '#99D98C', '#168AAD', '#184E77'],
    // Magma
    ['#FF4800', '#FF0000', '#FFD300', '#1A1A1A', '#4A0404'],
    // Matrix Glitch
    ['#00FF41', '#008F11', '#003B00', '#0D0208', '#FFFFFF']
];

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

    pick(arr) {
        return arr[Math.floor(this.next() * arr.length)];
    }
}

// --- HIGH-FIDELITY SVG ENGINE ---
const generateRichSVG = (id, type = 'node', width = 1200, height = 800) => {
    const rng = new Random(id);
    const palette = rng.pick(PALETTES);
    
    // Background color (usually dark from palette)
    const bg = palette[palette.length - 1]; 
    const accent1 = palette[0];
    const accent2 = palette[1];
    const accent3 = palette[2];

    const density = Math.floor(rng.range(30, 80)); // Much higher density
    
    // --- DEFS (Noise & Gradients) ---
    const defs = `
    <defs>
        <filter id="noise-${id}" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="${rng.range(0.5, 1.5)}" numOctaves="4" result="noise"/>
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.1 0" in="noise" result="coloredNoise"/>
            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite"/>
        </filter>
        <linearGradient id="grad-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${accent2}" stop-opacity="0.2" />
            <stop offset="50%" stop-color="${bg}" stop-opacity="0" />
            <stop offset="100%" stop-color="${accent1}" stop-opacity="0.3" />
        </linearGradient>
        <pattern id="grid-${id}" width="50" height="50" patternUnits="userSpaceOnUse">
             <path d="M 50 0 L 0 0 0 50" fill="none" stroke="${accent3}" stroke-width="0.5" stroke-opacity="0.2"/>
             ${rng.bool(0.3) ? `<circle cx="25" cy="25" r="1" fill="${accent1}" fill-opacity="0.4"/>` : ''}
        </pattern>
    </defs>
    `;

    // --- LAYERS ---
    let layers = [];

    // 1. Base Fill
    layers.push(`<rect width="100%" height="100%" fill="${bg}" />`);
    
    // 2. Large Abstract Gradients
    layers.push(`<rect width="100%" height="100%" fill="url(#grad-${id})" />`);
    
    // 3. Grid Pattern
    if (rng.bool(0.8)) {
        layers.push(`<rect width="100%" height="100%" fill="url(#grid-${id})" />`);
    }

    // 4. Geometric Chaos
    for (let i = 0; i < density; i++) {
        const shapeType = rng.range(0, 10);
        const color = rng.pick([accent1, accent2, accent3, '#FFFFFF']);
        const opacity = rng.range(0.1, 0.7);
        const x = rng.range(0, 100);
        const y = rng.range(0, 100);
        const size = rng.range(1, 20);
        
        // Rectangles
        if (shapeType < 4) {
            const w = rng.range(2, 40);
            const h = rng.range(2, 40);
            if (rng.bool(0.2)) {
                // Outlined
                layers.push(`<rect x="${x}%" y="${y}%" width="${w}%" height="${h}%" fill="none" stroke="${color}" stroke-width="${rng.range(1, 3)}" opacity="${opacity}" />`);
            } else {
                // Filled
                layers.push(`<rect x="${x}%" y="${y}%" width="${w}%" height="${h}%" fill="${color}" opacity="${opacity * 0.5}" />`);
            }
        } 
        // Circles
        else if (shapeType < 7) {
            const r = rng.range(1, 25);
            if (rng.bool(0.5)) {
                 // Ring
                 layers.push(`<circle cx="${x}%" cy="${y}%" r="${r}%" fill="none" stroke="${color}" stroke-width="${rng.range(1, 4)}" opacity="${opacity}" />`);
            } else {
                 // Dot
                 layers.push(`<circle cx="${x}%" cy="${y}%" r="${r}%" fill="${color}" opacity="${opacity * 0.3}" />`);
            }
        }
        // Crosses / Plus signs
        else if (shapeType < 9) {
            const crossSize = rng.range(10, 50);
            const cx = (x / 100) * width;
            const cy = (y / 100) * height;
            layers.push(`
                <g stroke="${color}" stroke-width="2" opacity="${opacity}">
                    <line x1="${cx - crossSize}" y1="${cy}" x2="${cx + crossSize}" y2="${cy}" />
                    <line x1="${cx}" y1="${cy - crossSize}" x2="${cx}" y2="${cy + crossSize}" />
                </g>
            `);
        }
        // Diagonal Lines
        else {
             const x2 = x + rng.range(-20, 20);
             const y2 = y + rng.range(-20, 20);
             layers.push(`<line x1="${x}%" y1="${y}%" x2="${x2}%" y2="${y2}%" stroke="${color}" stroke-width="${rng.range(1,5)}" opacity="${opacity}" />`);
        }
    }

    // 5. Tech Overlays (Scanlines)
    if (rng.bool(0.5)) {
        for(let j=0; j<height; j+=4) {
             layers.push(`<rect x="0" y="${j}" width="100%" height="1" fill="#000" opacity="0.1" />`);
        }
    }

    // 6. Labeling
    const labelColor = '#FFFFFF';
    layers.push(`
        <rect x="0" y="${height - 60}" width="100%" height="60" fill="#000" opacity="0.7" />
        <text x="30" y="${height - 25}" font-family="monospace" font-weight="bold" font-size="24" fill="${labelColor}" letter-spacing="4">
            ${id.toUpperCase()}
        </text>
        <text x="${width - 30}" y="${height - 25}" text-anchor="end" font-family="monospace" font-size="14" fill="${labelColor}" opacity="0.7">
            GEN.ASSET.V2 // ${type.toUpperCase()}
        </text>
    `);
    
    if (type === 'content') {
        layers.push(`
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="72" fill="#FFF" opacity="0.9" letter-spacing="10" stroke="#000" stroke-width="2">
                ASSET
            </text>
            <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="20" fill="#FFF" opacity="0.8">
                [${id}]
            </text>
        `);
    }

    // 7. Global Noise Texture
    layers.push(`<rect width="100%" height="100%" filter="url(#noise-${id})" opacity="0.15" pointer-events="none" />`);

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

// --- MODES ---

const generate = () => {
    console.log('--- GENERATING ASSETS (VIBRANT ART ENGINE) ---');
    
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
        // Always overwrite to apply new style
        const svgContent = generateRichSVG(id, 'node');
        fs.writeFileSync(filePath, svgContent);
        console.log(`  + Generated vibrant node: ${id}.svg`);
    });

    // 3. Generate Missing Local Assets (Content Placeholders)
    console.log(`\n> Checking Local Content Assets (${localAssets.length})...`);
    
    localAssets.forEach(relPath => {
        const fsRelPath = relPath.startsWith('/') ? relPath.substring(1) : relPath;
        const absPath = path.join(PUBLIC_DIR, fsRelPath);
        
        if (!fs.existsSync(absPath)) {
            const dir = path.dirname(absPath);
            ensureDir(dir);

            const pathObj = path.parse(absPath);
            const svgPath = path.join(dir, `${pathObj.name}.svg`);
            
            // Generate even if svg exists to update style
            const seed = pathObj.name;
            const svgContent = generateRichSVG(seed, 'content', 1200, 800);
            fs.writeFileSync(svgPath, svgContent);
            console.log(`  + Generated vibrant fallback: ${pathObj.name}.svg`);
        }
    });

    console.log('\n--- VIBRANT ASSETS COMPLETE ---');
};

const clean = () => {
    console.log('--- CLEANING GENERATED ASSETS ---');
    
    const nodesDir = path.join(PUBLIC_DIR, 'images', 'nodes');
    const { ids: contentIds, assets: localAssets } = getNodesFromContent();
    const staticNodes = ['home', 'neuromandala', 'works', 'events', 'collab', 'world', 'contacts', 'changelog', 'navigator', 'debug', 'debug-video', 'debug-audio', 'debug-image', 'debug-hub', 'debug-article'];
    const allNodes = [...new Set([...staticNodes, ...contentIds])];

    let removedCount = 0;

    // 1. Remove Node Backgrounds
    allNodes.forEach(id => {
        const filePath = path.join(nodesDir, `${id}.svg`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`  - Removed node: ${id}.svg`);
            removedCount++;
        }
    });

    // 2. Remove Content Fallbacks
    localAssets.forEach(relPath => {
        const fsRelPath = relPath.startsWith('/') ? relPath.substring(1) : relPath;
        const absPath = path.join(PUBLIC_DIR, fsRelPath);
        
        // We need to look for the SVG version of the requested asset
        const dir = path.dirname(absPath);
        const pathObj = path.parse(absPath);
        const svgPath = path.join(dir, `${pathObj.name}.svg`);

        if (fs.existsSync(svgPath)) {
            fs.unlinkSync(svgPath);
            console.log(`  - Removed fallback: ${pathObj.name}.svg`);
            removedCount++;
        }
    });

    console.log(`\n--- CLEAN COMPLETE (${removedCount} files removed) ---`);
};

// --- RUNNER ---
const args = process.argv.slice(2);
if (args.includes('--clean') || args.includes('clean')) {
    clean();
} else {
    generate();
}
