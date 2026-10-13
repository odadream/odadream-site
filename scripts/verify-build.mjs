import { readFile, stat, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadSiteModule } from './site-data.mjs';
import { validatePageCodes } from './page-code-check.mjs';

const root = resolve(process.env.ODA_BUILD_DIR || 'dist');
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
const { pages } = await loadSiteModule('src/lib/routes.ts');
const compatibilityPaths = ['/en/formats/', '/ru/formats/'];
const expectedPaths = new Set([...pages.map((page) => page.path), ...compatibilityPaths]);
const htmlByPath = new Map();
for (const path of expectedPaths) if (!pagePaths.includes(path)) fail(`Missing localized page ${path}`);
for (const path of pagePaths) if (!expectedPaths.has(path)) fail(`Unexpected localized page ${path}`);
for (const path of pagePaths) {
  const lang = path.startsWith('/ru/') ? 'ru' : 'en';
  const html = await readFile(resolve(root, path.slice(1), 'index.html'), 'utf8');
  htmlByPath.set(path, html);
  if (!compatibilityPaths.includes(path)) validatePageCodes(html, path);
  for (const token of [
    `<html lang="${lang}"`,
    '<title>',
    `rel="canonical" href="https://odadream.art${path}"`,
    'hreflang="en"',
    'hreflang="ru"',
    'property="og:title"',
    'name="description"',
  ])
    if (compatibilityPaths.includes(path) && token.startsWith('hreflang=')) continue;
    else if (!html.includes(token)) fail(`Missing ${token} in ${path}`);
  if (html.includes('id="root"')) fail(`SPA root in ${path}`);
  for (const match of html.matchAll(/(?:src|poster)="(\/[^"?]+)"/g)) {
    await stat(resolve(root, match[1].slice(1))).catch(() =>
      fail(`Missing local asset ${match[1]} in ${path}`),
    );
  }
}
const { catalogue } = await loadSiteModule('src/data/catalogue.ts');
if (
  await stat(resolve(root, 'design-system/index.html')).then(
    () => true,
    () => false,
  )
)
  fail('Editorial design system must not be included in a public build');
if (
  await stat(resolve(root, 'editorial/index.html')).then(
    () => true,
    () => false,
  )
)
  fail('Editorial register must not be published');
for (const file of [
  'index.html',
  '404.html',
  'legacy/unavailable/index.html',
  'robots.txt',
  'CNAME',
  'sitemap-index.xml',
  'sitemap.xml',
])
  await stat(resolve(root, file)).catch(() => fail(`Missing ${file}`));
if (
  (await readFile(resolve(root, 'sitemap.xml'), 'utf8')) !==
  (await readFile(resolve(root, 'sitemap-index.xml'), 'utf8'))
)
  fail('Submitted sitemap address must describe the current V2 index');
const rootHtml = await readFile(resolve(root, 'index.html'), 'utf8');
if (!rootHtml.includes('/legacy/unavailable/?lang=') || !rootHtml.includes('https://odadream.art/en/'))
  fail('Root obsolete-address notice or canonical absent');
if (
  await stat(resolve(root, 'legacy-map.json')).then(
    () => true,
    () => false,
  )
)
  fail('Runtime legacy map must not be published');
const unresolved = await readFile(resolve(root, 'legacy/unavailable/index.html'), 'utf8');
if (!unresolved.includes('noindex,follow')) fail('Legacy unavailable must be noindex');
const sitemap = await readFile(resolve(root, 'sitemap-0.xml'), 'utf8');
const lastmod = JSON.parse(await readFile('src/data/lastmod.json', 'utf8'));
if (
  sitemap.includes('/legacy/') ||
  sitemap.includes('/formats/') ||
  sitemap.includes('/design-system/') ||
  sitemap.includes('<loc>https://odadream.art/</loc>')
)
  fail('Noncanonical route in sitemap');
for (const path of pagePaths) {
  if (compatibilityPaths.includes(path)) {
    const html = await readFile(resolve(root, path.slice(1), 'index.html'), 'utf8');
    if (!html.includes('noindex,follow')) fail(`Compatibility entrance must be noindex: ${path}`);
    continue;
  }
  if (!sitemap.includes(`https://odadream.art${path}`)) fail(`Page absent from sitemap: ${path}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod[path] ?? '')) fail(`Missing editorial lastmod: ${path}`);
  if (!sitemap.includes(`<loc>https://odadream.art${path}</loc><lastmod>${lastmod[path]}`))
    fail(`Incorrect sitemap lastmod: ${path}`);
}
console.log(`Verified ${pagePaths.length} static localized pages, root bridge, 404 and sitemap.`);

// Verify the physical output, including copied files unreferenced by HTML.
const { publicFiles } = await import('./publication-integration.mjs');
for (const path of await publicFiles(resolve('public'))) {
  const exists = await stat(resolve(root, path.slice(1))).then(
    () => true,
    () => false,
  );
  if (exists !== catalogue.assetPaths.has(path)) fail(`Public asset scope mismatch: ${path}`);
}
for (const path of await publicFiles(root)) {
  if (!path.endsWith('.html') && !path.endsWith('.json') && !path.endsWith('.js')) continue;
  const output = await readFile(resolve(root, path.slice(1)), 'utf8');
  for (const marker of ['D:/YandexDisk/', 'D:\\YandexDisk', 'C:/Users/', 'trusted_internal'])
    if (output.includes(marker)) fail(`Internal locator in public output ${path}`);
  if (
    [
      'data-dev-note',
      'data-editorial-toolbar',
      'data-dev-crop',
      'oda.media-composition.v1',
      '/__editorial/',
      '/editorial/',
    ].some((marker) => output.includes(marker))
  )
    fail('Local editorial tools included in public output ' + path);
  if (output.includes('data-editorial-preview')) fail(`Editorial preview included in public output ${path}`);
}
console.log(`Verified public asset allowlist and absence of internal locators.`);

// Check the complete emitted link graph, including same-page anchors and lazy media.
let internalLinks = 0;
let resourceReferences = 0;
for (const [path, html] of htmlByPath) {
  for (const match of html.matchAll(/\b(href|src|poster|data-src|data-poster)="([^"\s]+)"/g)) {
    const href = match[2].replaceAll('&amp;', '&');
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const target = new URL(href, `https://odadream.art${path}`);
    if (target.origin !== 'https://odadream.art') continue;
    const document = htmlByPath.get(target.pathname);
    if (document !== undefined) {
      if (target.hash && !document.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`))
        fail(`Missing anchor: ${path} -> ${href}`);
      internalLinks++;
    } else {
      const metadata = await stat(resolve(root, target.pathname.slice(1))).catch(() => undefined);
      if (!metadata?.isFile()) fail(`Missing internal destination: ${path} -> ${href}`);
      resourceReferences++;
    }
  }
}
console.log(`Verified ${internalLinks} internal links and ${resourceReferences} resource references.`);
