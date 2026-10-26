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
  test.setTimeout(120_000);
  let startupOutput = '';
  server = spawn(
    process.execPath,
    ['scripts/astro-cli.mjs', 'preview', '--host', '127.0.0.1', '--port', '5180'],
    { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  const recordStartup = (chunk: Buffer) => {
    startupOutput = (startupOutput + chunk.toString()).slice(-2000);
  };
  server.stdout?.on('data', recordStartup);
  server.stderr?.on('data', recordStartup);
  await expect
    .poll(
      async () => {
        try {
          if (server.exitCode !== null) throw Error(`Preview exited: ${startupOutput}`);
          return (await request.get(`${base}/ru/`, { timeout: 2000 })).status();
        } catch {
          if (server.exitCode !== null) throw Error(`Preview exited: ${startupOutput}`);
          return 0;
        }
      },
      { timeout: 60_000, message: 'Fresh PUBLIC preview must start before artifact checks' },
    )
    .toBe(200);
});
test.afterAll(() => {
  server?.kill();
});

test('submitted sitemap address serves the current V2 index and robots points to it', async ({ request }) => {
  const alias = await request.get(base + '/sitemap.xml');
  const index = await request.get(base + '/sitemap-index.xml');
  expect(alias.status()).toBe(200);
  expect(index.status()).toBe(200);
  expect(await alias.text()).toBe(await index.text());
  expect(await alias.text()).toContain('https://odadream.art/sitemap-0.xml');
  const robots = await request.get(base + '/robots.txt');
  expect(await robots.text()).toContain('Sitemap: https://odadream.art/sitemap.xml');
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

test('deferred work routes are absent from HTML and sitemap; obsolete query links return home in their language', async ({
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

test('unknown page addresses warn and return home; missing binary assets remain 404', async ({
  page,
  request,
}) => {
  for (const lang of ['en', 'ru']) {
    const response = await page.goto(`${base}/${lang}/former-page-that-no-longer-exists/`);
    expect(response?.status()).toBe(404);
    await expect(page.locator('[data-legacy-notice]')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('h1')).toHaveText(lang === 'ru' ? 'Сайт обновился' : 'The site has changed');
    await expect(page.locator('.legacy-home-link')).toHaveAttribute('href', `/${lang}/`);
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex,follow');
    await expect(page).toHaveURL(new RegExp(`/${lang}/$`), { timeout: 8000 });
  }
  for (const path of [
    '/images/removed-image.webp',
    '/videos/removed-video.mp4',
    '/documents/removed-file.pdf',
  ]) {
    expect((await request.get(base + path)).status()).toBe(404);
  }
});

test('private dossier originals and the excluded budget page are absent from the public artifact', async ({
  page,
  request,
}) => {
  await page.goto(`${base}/ru/works/other-people/`);
  const dossier = page.locator('#document-other-people-en');
  await expect(dossier.locator('img')).toHaveCount(4);
  await expect(dossier.locator('a[href$=".pdf"]')).toHaveCount(0);
  const first = await dossier.locator('img').first().getAttribute('src');
  expect((await request.get(base + first!.replace('page-001', 'page-005'))).status()).toBe(404);
  for (const path of [
    '/documents/other-people-art-science-society.pdf',
    '/documents/dashran-tech-spec-nur.pdf',
    '/video/archive/source/blended-spin.m4v',
  ])
    expect((await request.get(base + path)).status()).toBe(404);
  for (const image of await dossier.locator('img').all())
    expect((await request.get(base + (await image.getAttribute('src')))).status()).toBe(200);
});
