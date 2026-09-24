import { readFile, stat, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { validatePageCodes } from './page-code-check.mjs';

const root = resolve('dist');
const fail = (message) => {
  throw new Error(message);
};
const pagePaths = [];
async function visit(directory, prefix) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) await visit(resolve(directory, entry.name), `${prefix}${entry.name}/`);
    else if (entry.name === 'index.html') pagePaths.push(prefix);
  }
}
for (const lang of ['en', 'ru']) await visit(resolve(root, lang), `/${lang}/`);
if (pagePaths.length !== 38) fail(`Expected 38 localized pages, got ${pagePaths.length}`);
for (const path of pagePaths) {
  const lang = path.startsWith('/ru/') ? 'ru' : 'en';
  const html = await readFile(resolve(root, path.slice(1), 'index.html'), 'utf8');
  validatePageCodes(html, path);
  for (const token of [
    `<html lang="${lang}"`,
    '<title>',
    `rel="canonical" href="https://odadream.art${path}"`,
    'hreflang="en"',
    'hreflang="ru"',
    'property="og:title"',
    'name="description"',
  ])
    if (!html.includes(token)) fail(`Missing ${token} in ${path}`);
  if (html.includes('id="root"')) fail(`SPA root in ${path}`);
  for (const match of html.matchAll(/(?:src|poster)="(\/[^"?]+)"/g)) {
    await stat(resolve(root, match[1].slice(1))).catch(() =>
      fail(`Missing local asset ${match[1]} in ${path}`),
    );
  }
}
const designSystem = await readFile(resolve(root, 'design-system/index.html'), 'utf8');
validatePageCodes(designSystem, '/design-system/');
for (const file of [
  'index.html',
  '404.html',
  'legacy/unavailable/index.html',
  'robots.txt',
  'CNAME',
  'sitemap-index.xml',
])
  await stat(resolve(root, file)).catch(() => fail(`Missing ${file}`));
const rootHtml = await readFile(resolve(root, 'index.html'), 'utf8');
if (!rootHtml.includes('/legacy-map.json') || !rootHtml.includes('https://odadream.art/en/'))
  fail('Root legacy bridge or canonical absent');
const legacy = JSON.parse(await readFile('src/data/legacy-map.json', 'utf8'));
if (rootHtml.includes('"ancestors"')) fail('Root bridge must not inline the legacy ID catalogue');
const legacyRoutes = JSON.parse(await readFile(resolve(root, 'legacy-map.json'), 'utf8'));
if (Object.keys(legacyRoutes).length !== legacy.length) fail('Legacy redirect index is incomplete');
for (const row of legacy) {
  if (JSON.stringify(legacyRoutes[row.id]) !== JSON.stringify([row.targetEn, row.targetRu]))
    fail(`Incorrect legacy redirect index entry: ${row.id}`);
  if (row.disposition === 'not-transferred') continue;
  for (const target of [row.targetEn, row.targetRu]) {
    const url = new URL(target, 'https://odadream.art');
    const html = await readFile(resolve(root, url.pathname.slice(1), 'index.html'), 'utf8').catch(() =>
      fail(`Legacy target missing: ${row.id} → ${target}`),
    );
    if (url.hash && !html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`))
      fail(`Legacy anchor missing: ${row.id} → ${target}`);
  }
}
const unresolved = await readFile(resolve(root, 'legacy/unavailable/index.html'), 'utf8');
if (!unresolved.includes('noindex,follow')) fail('Legacy unavailable must be noindex');
const sitemap = await readFile(resolve(root, 'sitemap-0.xml'), 'utf8');
const lastmod = JSON.parse(await readFile('src/data/lastmod.json', 'utf8'));
if (
  sitemap.includes('/legacy/') ||
  sitemap.includes('/design-system/') ||
  sitemap.includes('<loc>https://odadream.art/</loc>')
)
  fail('Noncanonical route in sitemap');
for (const path of pagePaths) {
  if (!sitemap.includes(`https://odadream.art${path}`)) fail(`Page absent from sitemap: ${path}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod[path] ?? '')) fail(`Missing editorial lastmod: ${path}`);
  if (!sitemap.includes(`<loc>https://odadream.art${path}</loc><lastmod>${lastmod[path]}`))
    fail(`Incorrect sitemap lastmod: ${path}`);
}
console.log(`Verified ${pagePaths.length} static localized pages, root bridge, 404 and sitemap.`);
