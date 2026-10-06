import { readFile, writeFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve, join, sep, extname } from 'node:path';
import { chromium } from '@playwright/test';
import lighthouse, { desktopConfig } from 'lighthouse';

const pointer = JSON.parse(await readFile('.local-server/candidate-rehearsal.json', 'utf8'));
const privateRoot = resolve('.local-server');
const dist = resolve(pointer.dist);
if (!pointer.fixture || !dist.startsWith(privateRoot + sep))
  throw Error('Candidate is not a private rehearsal');
const summary = pointer.summary;
const htmlByPath = new Map();
for (const page of summary.pages)
  htmlByPath.set(page.path, await readFile(join(dist, page.path.slice(1), 'index.html'), 'utf8'));
let links = 0;
for (const [pagePath, html] of htmlByPath) {
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"\s]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (!href.startsWith('/')) continue;
    const target = new URL(href, 'https://odadream.art');
    if (target.pathname === '/design-system/') throw Error('Design stand in candidate');
    const document = htmlByPath.get(target.pathname);
    if (document) {
      if (target.hash && !document.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`))
        throw Error(`Missing anchor ${pagePath} -> ${href}`);
    } else if (!summary.assets.includes(target.pathname))
      throw Error(`Unknown internal destination ${pagePath} -> ${href}`);
    links++;
  }
}
for (const path of summary.assets) await stat(join(dist, path.slice(1)));
const types = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    let path = resolve(dist, '.' + decodeURIComponent(url.pathname));
    if (path !== dist && !path.startsWith(dist + sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (url.pathname.endsWith('/')) path = join(path, 'index.html');
    const metadata = await stat(path);
    if (!metadata.isFile()) throw Error('Not a file');
    res.writeHead(200, {
      'Content-Type': types[extname(path)] ?? 'application/octet-stream',
      'Content-Length': metadata.size,
    });
    res.end(req.method === 'HEAD' ? undefined : await readFile(path));
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((resolvePromise) => server.listen(0, '127.0.0.1', resolvePromise));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
const geometry = [];
const performance = [];
let environment;
try {
  for (const path of summary.assets) {
    const response = await fetch(base + path, { method: 'HEAD' });
    if (response.status !== 200) throw Error(`Candidate resource HTTP ${response.status}: ${path}`);
  }
  browser = await chromium.launch();
  const page = await browser.newPage();
  for (const width of [390, 601, 797, 1440, 1920]) {
    await page.setViewportSize({ width, height: 932 });
    for (const theme of ['dark', 'light'])
      for (const path of [
        '/ru/',
        '/en/',
        '/ru/works/oda-rings/',
        '/en/cases/dano-2025/',
        '/ru/studio/',
        '/en/formats/',
      ]) {
        await page.goto(base + path, { waitUntil: 'domcontentloaded' });
        await page.evaluate(async (theme) => {
          document.documentElement.dataset.theme = theme;
          await document.fonts.ready;
        }, theme);
        if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
          throw Error(`Candidate overflow ${width}/${theme}/${path}`);
        geometry.push({ width, theme, path });
      }
  }
  await browser.close();
  browser = undefined;
  const debugReservation = createServer();
  await new Promise((done) => debugReservation.listen(0, '127.0.0.1', done));
  const debugPort = debugReservation.address().port;
  await new Promise((done) => debugReservation.close(done));
  browser = await chromium.launch({ args: [`--remote-debugging-port=${debugPort}`] });
  await browser.newPage();
  environment = {
    node: process.version,
    platform: process.platform,
    chromium: browser.version(),
    server: 'Loopback HTTP, no compression or cache headers; not the target hosting configuration',
    runsPerScenario: 3,
  };
  for (const [mode, config, path] of [
    ['mobile', undefined, '/ru/'],
    ['desktop', desktopConfig, '/ru/'],
    ['mobile', undefined, '/ru/works/oda-rings/'],
  ]) {
    const runs = [];
    for (let run = 1; run <= 3; run++) {
      const result = await lighthouse(
        base + path,
        {
          port: debugPort,
          logLevel: 'silent',
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        },
        config,
      );
      if (result.lhr.runtimeError) throw Error(result.lhr.runtimeError.message);
      environment.lighthouse = result.lhr.lighthouseVersion;
      const metrics = result.lhr.audits;
      runs.push({
        scores: Object.fromEntries(
          Object.entries(result.lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)]),
        ),
        fcpMs: Math.round(metrics['first-contentful-paint'].numericValue),
        lcpMs: Math.round(metrics['largest-contentful-paint'].numericValue),
        cls: metrics['cumulative-layout-shift'].numericValue,
        tbtMs: Math.round(metrics['total-blocking-time'].numericValue),
        failedAudits: Object.entries(metrics)
          .filter(([, audit]) => audit.score !== null && audit.score < 1)
          .map(([id, audit]) => ({ id, title: audit.title, score: audit.score })),
      });
      await writeFile(
        join(
          pointer.directory,
          `lighthouse-${mode}-${path.includes('works') ? 'rings' : 'home'}-${run}.json`,
        ),
        result.report,
      );
    }
    const median = (values) => values.sort((a, b) => a - b)[1];
    performance.push({
      mode,
      path,
      runs,
      scores: Object.fromEntries(
        Object.keys(runs[0].scores).map((key) => [key, median(runs.map((row) => row.scores[key]))]),
      ),
      ...Object.fromEntries(
        ['fcpMs', 'lcpMs', 'cls', 'tbtMs'].map((key) => [key, median(runs.map((row) => row[key]))]),
      ),
    });
    console.log(
      JSON.stringify({
        mode,
        path,
        scores: performance.at(-1).scores,
        lcpMs: performance.at(-1).lcpMs,
        runs: 3,
      }),
    );
  }
} finally {
  await browser?.close();
  await new Promise((resolvePromise) => server.close(resolvePromise));
}
const inventoryPath = 'docs/migration/INVENTORY-2026-10-05.json';
const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'));
inventory.currentCandidateVerification = {
  asOf: '2026-10-06',
  fixture: true,
  scope:
    'Selected packet with synthetic approval statuses in an isolated private copy; rights are unchanged. Not a release artifact.',
  localizedPages: summary.pages.length,
  works: summary.works,
  cases: summary.cases,
  workDocuments: summary.documents,
  recognitions: summary.recognitions,
  minddb: summary.minddb,
  internalLinksChecked: links,
  geometryScenarios: geometry.length,
  resourcesWithHttp200: summary.assets.length,
  environment,
  performance,
  limitation:
    'Lighthouse laboratory measurements of this candidate fixture, not field INP, editorial approval, real analytics delivery or permission to deploy.',
};
await writeFile(inventoryPath, JSON.stringify(inventory, null, 2) + '\n');
console.log(
  `Candidate QA: ${summary.pages.length} localized pages, ${links} internal links, ${geometry.length} geometry scenarios verified. Reports stay private.`,
);
