
import { LotusNode } from '../types';

interface FrontmatterData {
    attributes: Record<string, any>;
    body: string;
}

/**
 * Simple YAML Frontmatter parser.
 * Handles:
 * - Strings (key: value)
 * - Arrays (tags: [a, b, c])
 * - Booleans (visible: true)
 * - Numbers (order: 1)
 */
export const parseFrontmatter = (text: string): FrontmatterData => {
    // Robustness: Trim start of string to handle files with leading newlines
    const cleanText = text.trimStart();
    
    // Regex now handles potential trailing spaces after '---'
    // iOS Safari compatibility: avoid [\s\S]*? which can cause issues in older versions
    const match = cleanText.match(/^---\s*\r?\n((?:.|\r?\n)*?)\r?\n---\s*\r?\n((?:.|\r?\n)*)$/);
    
    if (!match) {
        return { attributes: {}, body: text };
    }

    const frontmatterBlock = match[1];
    const body = match[2].trim();
    // SECURITY: Use Object.create(null) to avoid prototype pollution via "__proto__"
    const attributes: Record<string, any> = Object.create(null);

    frontmatterBlock.split(/\r?\n/).forEach(line => {
        if (!line.trim() || line.trim().startsWith('#')) return;

        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return;

        const key = line.slice(0, colonIndex).trim();
        
        // SECURITY: Explicitly block dangerous keys
        if (['__proto__', 'constructor', 'prototype'].includes(key)) {
            console.warn(`[Security] Blocked unsafe frontmatter key: ${key}`);
            return;
        }

        let value = line.slice(colonIndex + 1).trim();

        // Handle Arrays [a, b] or ['a', "b"]
        if (value.startsWith('[') && value.endsWith(']')) {
            attributes[key] = value
                .slice(1, -1)
                .split(',')
                .map(item => item.trim().replace(/^['"]|['"]$/g, '')) // Remove surrounding quotes
                .filter(i => i);
            return;
        }

        // Handle Booleans
        if (value === 'true') {
            attributes[key] = true;
            return;
        }
        if (value === 'false') {
            attributes[key] = false;
            return;
        }

        // Handle Numbers
        if (!isNaN(Number(value)) && value !== '') {
            attributes[key] = Number(value);
            return;
        }

        // Handle Strings (remove quotes if present)
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        attributes[key] = value;
    });

    return { attributes, body };
};

/**
 * Converts parsed file data into a partial LotusNode structure.
 */
export const fileToNode = (rawContent: string, filename: string): Partial<LotusNode> | null => {
    const { attributes, body } = parseFrontmatter(rawContent);

    if (!attributes.id) {
        console.warn(`File ${filename} is missing 'id' in frontmatter or failed to parse.`);
        return null;
    }

    return {
        id: attributes.id,
        parentId: attributes.parent,
        title: {
            en: attributes.title_en || attributes.id,
            ru: attributes.title_ru || attributes.id
        },
        shortTitle: {
            en: attributes.short_en || attributes.title_en,
            ru: attributes.short_ru || attributes.title_ru
        },
        description: {
            en: body.split('---RU---')[0]?.trim() || body,
            ru: body.split('---RU---')[1]?.trim() || body 
        },
        type: attributes.type || 'content',
        tags: attributes.tags || [],
        imageUrl: attributes.image,
        mediaUrl: attributes.media || attributes.image,
        externalLink: attributes.external_link,
        visible: attributes.visible !== false,
        status: attributes.status,
        lastModified: attributes.date,
        order: attributes.order,
    };
};
