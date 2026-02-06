
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');
const CONTENT_SRC_DIR = path.join(PROJECT_ROOT, 'src', 'content');
const OUTPUT_FILE = path.join(__dirname, 'CONTENT_TREE.md');

// --- HELPERS ---

// Simple Frontmatter Parser
const parseNode = (fileName, content) => {
    const node = {
        id: null,
        parent: null,
        title_en: '',
        title_ru: '',
        media: new Set(),
        children: []
    };

    // 1. Parse Frontmatter
    const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
    if (match) {
        const fm = match[1];
        const lines = fm.split('\n');
        lines.forEach(line => {
            const parts = line.split(':');
            if (parts.length < 2) return;
            const key = parts[0].trim();
            const val = parts.slice(1).join(':').trim();

            if (key === 'id') node.id = val;
            if (key === 'parent') node.parent = val;
            if (key === 'title_en') node.title_en = val;
            if (key === 'title_ru') node.title_ru = val;
            
            // Extract Frontmatter Media
            if ((key === 'image' || key === 'media') && val) {
                node.media.add(val);
            }
        });
    }

    // Fallback ID if missing
    if (!node.id) node.id = path.parse(fileName).name;

    // 2. Parse Body for Media
    // Wiki links: ![[url|...]]
    const wikiRegex = /!\[\[\s*(.*?)\s*\]\]/g;
    let m;
    while ((m = wikiRegex.exec(content)) !== null) {
        const parts = m[1].split('|');
        const url = parts[0].trim();
        const poster = parts[2] ? parts[2].trim() : null;
        
        if (url) node.media.add(url);
        if (poster) node.media.add(poster);
    }

    // Standard Markdown: ![alt](url)
    const stdRegex = /!\[.*?\]\((.*?)\)/g;
    while ((m = stdRegex.exec(content)) !== null) {
        const url = m[1].split(' ')[0].trim(); // handle title after space
        if (url) node.media.add(url);
    }

    return node;
};

const renderTree = (node, prefix = '', isLast = true, outputLines = []) => {
    const connector = isLast ? '└── ' : '├── ';
    const childPrefix = prefix + (isLast ? '    ' : '│   ');
    
    const mediaCount = node.media.size;
    const mediaLabel = mediaCount > 0 ? ` [📂 ${mediaCount}]` : '';
    const titleLabel = node.title_en ? `(${node.title_en})` : '';

    outputLines.push(`${prefix}${connector}**${node.id}** ${titleLabel}${mediaLabel}`);

    // List Media
    if (node.media.size > 0) {
        Array.from(node.media).forEach((url, i, arr) => {
            const isLastMedia = i === arr.length - 1 && (!node.children || node.children.length === 0);
            const mConnector = isLastMedia ? '└─' : '├─';
            // Clean URL for display
            const cleanUrl = url.length > 50 ? url.substring(0, 47) + '...' : url;
            outputLines.push(`${childPrefix}  ${mConnector} 🖼️ \`${cleanUrl}\``);
        });
    }

    // Render Children
    if (node.children && node.children.length > 0) {
        node.children.forEach((child, index) => {
            renderTree(child, childPrefix, index === node.children.length - 1, outputLines);
        });
    }

    return outputLines;
};

// --- MAIN ---

const run = () => {
    console.log('--- ANALYZING CONTENT STRUCTURE ---');

    if (!fs.existsSync(CONTENT_SRC_DIR)) {
        console.error('Content directory not found!');
        process.exit(1);
    }

    const files = fs.readdirSync(CONTENT_SRC_DIR).filter(f => f.endsWith('.md'));
    const nodeMap = new Map();
    const roots = [];
    const orphans = [];

    // 1. Parse all files
    files.forEach(f => {
        const content = fs.readFileSync(path.join(CONTENT_SRC_DIR, f), 'utf-8');
        const node = parseNode(f, content);
        nodeMap.set(node.id, node);
    });

    // 2. Build Hierarchy
    nodeMap.forEach(node => {
        if (!node.parent || node.parent === 'root' || !nodeMap.has(node.parent)) {
            // Treat 'home' as root usually, or nodes without valid parents
            if (node.id === 'home' || !node.parent) {
                roots.push(node);
            } else {
                orphans.push(node);
            }
        } else {
            const parent = nodeMap.get(node.parent);
            parent.children.push(node);
        }
    });

    // 3. Generate Output
    const lines = [];
    lines.push(`# Project Content Tree`);
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push(`\nTotal Nodes: ${nodeMap.size}`);
    lines.push(`\n## 🌳 Site Hierarchy\n`);

    // Prioritize 'home' as the main root
    const homeNode = roots.find(n => n.id === 'home');
    const otherRoots = roots.filter(n => n.id !== 'home');

    if (homeNode) {
        renderTree(homeNode, '', otherRoots.length === 0, lines);
    }

    otherRoots.forEach((node, i) => {
        renderTree(node, '', i === otherRoots.length - 1, lines);
    });

    if (orphans.length > 0) {
        lines.push(`\n## ⚠️ Orphans (Broken Parent Links)\n`);
        orphans.forEach(node => {
            lines.push(`- **${node.id}** (Parent: ${node.parent} [Missing])`);
        });
    }

    lines.push(`\n## 📊 Media Manifest\n`);
    lines.push(`| Node ID | Media Count | Files |`);
    lines.push(`|---------|-------------|-------|`);
    
    nodeMap.forEach(node => {
        if (node.media.size > 0) {
            const fileList = Array.from(node.media).map(m => `\`${m}\``).join('<br/>');
            lines.push(`| ${node.id} | ${node.media.size} | ${fileList} |`);
        }
    });

    fs.writeFileSync(OUTPUT_FILE, lines.join('\n'));
    console.log(`✅ Analysis complete. Tree written to: ${OUTPUT_FILE}`);
};

run();
