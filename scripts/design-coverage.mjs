import { readdir, readFile } from 'node:fs/promises';
import { basename } from 'node:path';

// Structural coverage only. Visual acceptance still requires the real pages.
const registry = await readFile('src/lib/design-coverage.ts', 'utf8');
const components = (await readdir('src/components')).filter((name) => name.endsWith('.astro'));
const missing = components.filter((name) => !registry.includes(`'${basename(name, '.astro')}'`));
const specimen = await readFile('src/views/DesignSystem.astro', 'utf8');
const targets = [...registry.matchAll(/specimen: '#([^']+)'/g)].map((match) => match[1]);
const absentTargets = targets.filter((id) => !specimen.includes(`id="${id}"`));
const styleLiterals = [];
for (const file of (await readdir('src/styles')).filter(
  (name) => name.endsWith('.css') && name !== 'tokens.css',
)) {
  const css = (await readFile(`src/styles/${file}`, 'utf8')).replace(/\/\*[\s\S]*?\*\//g, (comment) =>
    comment.replace(/[^\n]/g, ' '),
  );
  for (const [index, line] of css.split('\n').entries()) {
    if (line.trim().startsWith('@media')) continue;
    if (/\d+(?:\.\d+)?px\b|#[\da-f]{3,8}\b|\brgba?\(|\bhsla?\(|font-family:(?!\s*var\()[^;]+;/i.test(line)) {
      styleLiterals.push({ file, line: index + 1, declaration: line.trim() });
    }
  }
}
const inputs = [];
for (const directory of ['src/components', 'src/views', 'src/layouts']) {
  for (const file of await readdir(directory)) {
    if (!file.endsWith('.astro')) continue;
    const source = await readFile(`${directory}/${file}`, 'utf8');
    inputs.push({
      file: `${directory}/${file}`,
      components: [
        ...new Set(
          [...source.matchAll(/import\s+\w+\s+from\s+['"][^'"]*\/([^/'"]+)\.astro['"]/g)].map((m) => m[1]),
        ),
      ],
    });
  }
}
let site;
const base = process.argv[process.argv.indexOf('--site') + 1];
if (process.argv.includes('--site')) {
  const index = await (await fetch(new URL('/sitemap-index.xml', base))).text();
  const sitemapPath = new URL(index.match(/<loc>([^<]+)<\/loc>/)[1]).pathname;
  const sitemap = await (await fetch(new URL(sitemapPath, base))).text();
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const pages = [];
  for (const path of paths) {
    const response = await fetch(new URL(path, base));
    const html = await response.text();
    pages.push({
      path,
      status: response.status,
      tokensLinked: html.includes('/_astro/') && html.includes('site-header'),
      summaries: [...html.matchAll(/<summary[\s>]/g)].length,
      disclosureMarks: [...html.matchAll(/data-disclosure-mark/g)].length,
      classes: [
        ...new Set([...html.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean)),
      ],
    });
  }
  site = {
    pages: pages.length,
    failures: pages.filter((p) => p.status !== 200 || !p.tokensLinked),
    nativeElements: [
      'details/summary',
      'input/select/textarea',
      'dialog',
      'button/a',
      'lists',
      'timeline',
      'blockquote',
      'figure/figcaption',
    ],
    inventory: pages,
  };
}
console.log(
  JSON.stringify(
    {
      components: components.length,
      templates: inputs.length,
      missing,
      absentTargets,
      styleLiterals,
      consumers: inputs,
      site,
    },
    null,
    2,
  ),
);
if (missing.length || absentTargets.length || styleLiterals.length || site?.failures.length)
  process.exitCode = 1;
