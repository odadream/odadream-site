import { test, expect } from '@playwright/test';
import { spawn, execFileSync, type ChildProcess } from 'node:child_process';
// Execute the trusted data loader in plain Node, outside Playwright's import transformer.
const packet = JSON.parse(
  execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
  import { loadSiteModule } from './scripts/site-data.mjs';
  const source = await loadSiteModule();
  const { catalogue } = await loadSiteModule('src/data/catalogue.ts');
  console.log(JSON.stringify({
    source: { works: source.works.map(({id, legacyId, slug}) => ({id, legacyId, slug})), recognitions: source.recognitions.map(({previewSrc}) => ({previewSrc})) },
    catalogue: { works: catalogue.works.map(({id, stage, featuredOnHome}) => ({id, stage, featuredOnHome})), minddb: !!catalogue.minddbSnapshot, assetPaths: [...catalogue.assetPaths] }
  }));
`,
    ],
    { windowsHide: true, encoding: 'utf8' },
  ),
);

test.skip(
  ({ isMobile }) => isMobile,
  'Public artifact checks run once; editorial layout has its own mobile matrix.',
);
const base = 'http://127.0.0.1:5180';
let server: ChildProcess;
test.beforeAll(async ({ request }) => {
  server = spawn(
    process.execPath,
    ['node_modules/astro/astro.js', 'preview', '--host', '127.0.0.1', '--port', '5180'],
    { windowsHide: true, stdio: 'ignore' },
  );
  await expect
    .poll(
      async () => {
        try {
          return (await request.get(`${base}/ru/`)).status();
        } catch {
          return 0;
        }
      },
      { timeout: 30_000 },
    )
    .toBe(200);
});
test.afterAll(() => {
  server?.kill();
});

test('public artifact excludes editorial-only HTML and physical document files', async ({
  page,
  request,
}) => {
  const { source, catalogue } = packet;
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${base}/ru/`);
  await expect(page.locator('[data-editorial-preview]')).toHaveCount(0);
  await expect(page.locator('.work-card')).toHaveCount(
    catalogue.works.filter(
      (work: { featuredOnHome: boolean; stage: string }) => work.featuredOnHome && work.stage === 'realized',
    ).length,
  );
  await expect(page.locator('.nm-data-panel')).toHaveCount(catalogue.minddb ? 1 : 0);
  expect((await request.get(`${base}/design-system/`)).status()).toBe(404);
  for (const row of source.recognitions) {
    if (row.previewSrc && !catalogue.assetPaths.includes(row.previewSrc))
      expect((await request.get(base + row.previewSrc)).status()).toBe(404);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  );
  expect(errors).toEqual([]);
});

test('deferred work routes are absent from HTML and sitemap; query links preserve ID and language', async ({
  page,
  request,
}) => {
  const { source, catalogue } = packet;
  const sitemap = await (await request.get(`${base}/sitemap-0.xml`)).text();
  const deferred = source.works.filter(
    (row: { id: string }) => !catalogue.works.some((work: { id: string }) => work.id === row.id),
  );
  for (const work of deferred) {
    for (const lang of ['en', 'ru']) {
      const path = `/${lang}/works/${work.slug}/`;
      expect((await request.get(base + path)).status()).toBe(404);
      expect(sitemap).not.toContain(path);
    }
  }
  await page.goto(`${base}/?id=unknown-record&lang=ru`);
  await expect(page.locator('[data-legacy-notice]')).toBeVisible();
  await expect(page.locator('.legacy-home-link')).toHaveAttribute('href', '/ru/');
  await expect(page).toHaveURL(/\/ru\/$/, { timeout: 8000 });
  expect(sitemap).not.toContain('/formats/');
  expect((await request.get(base + '/legacy-map.json')).status()).toBe(404);
});
