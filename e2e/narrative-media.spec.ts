import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';

test('festival gallery describes individual frames while viewer keeps event context', async ({ page }) => {
  for (const [lang, descriptions] of [
    ['ru', ['Подключение нейроинтерфейсов', 'Зрительница с микрофоном', 'Исполнители и участники на сцене']],
    [
      'en',
      [
        'Fitting neurointerfaces',
        'Audience member with a microphone',
        'Performers and participants on stage',
      ],
    ],
  ] as const) {
    await page.goto(`/${lang}/cases/tsiolkovsky-festival-2026/`);
    const gallery = page.locator('#case-gallery');
    await expect(gallery.locator('.media-microcaption')).toHaveText([...descriptions]);
    await expect(gallery.locator('.media-microcaption a')).toHaveCount(0);
    await gallery.locator('[data-lightbox]').first().click();
    await expect(page.locator('.lightbox-caption')).toContainText(descriptions[0]);
    await expect(page.locator('.lightbox-caption')).toContainText('2026');
    await expect(page.locator('.lightbox-caption')).toContainText('ID: archive-interference');
    await page.keyboard.press('Escape');
  }
});

const workPaths: string[] = JSON.parse(
  execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
  import { loadSiteModule } from './scripts/site-data.mjs';
  const data = await loadSiteModule();
  const {createPages} = await loadSiteModule('src/lib/routes.ts');
  console.log(JSON.stringify(createPages(data).filter(p=>p.kind==='work').map(p=>p.path)));
`,
    ],
    { windowsHide: true, encoding: 'utf8' },
  ),
);

test('every work uses the shared visual narrative without duplicating its cover', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Catalogue structure is viewport-independent; geometry has a separate matrix.');
  test.setTimeout(120_000);
  await page.route('**/*', (route) =>
    ['image', 'media'].includes(route.request().resourceType()) ? route.abort() : route.continue(),
  );
  for (const path of workPaths) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const failures = await page.locator('.work-main').evaluate((main) => {
      const errors: string[] = [];
      const first = main.querySelector('#work-first-look');
      const question = main.querySelector('#work-question');
      if (first && question && !(first.compareDocumentPosition(question) & Node.DOCUMENT_POSITION_FOLLOWING))
        errors.push('first gallery below question');
      const figures = [
        ...main.querySelectorAll(':scope > .media-figure, .media-gallery[data-mode="tiles"] .media-figure'),
      ];
      const ids = figures.map((figure) => figure.getAttribute('data-media-id'));
      if (new Set(ids).size !== ids.length) errors.push('repeated cover or gallery media');
      const tiles = [...main.querySelectorAll('.media-gallery__tile')];
      if (tiles.some((tile) => !tile.querySelector('figcaption.media-microcaption')))
        errors.push('missing microcaption');
      if (main.querySelector('#work-project-site') && tiles.length > 4)
        errors.push('project gateway expanded into duplicate archive');
      if (!main.querySelector('#work-availability')) errors.push('missing availability');
      const middle = main.querySelector('#work-gallery');
      if (
        middle &&
        (!middle.parentElement?.previousElementSibling ||
          !middle.parentElement?.nextElementSibling?.matches('.editorial-sections'))
      )
        errors.push('unseparated gallery');
      return errors;
    });
    expect(failures, path).toEqual([]);
  }
});
test('narrative selections precede detail, stay tiled and keep viewer metadata', async ({ page }) => {
  for (const path of ['/ru/works/mindshow/', '/en/works/mindshow/', '/ru/cases/tsiolkovsky-festival-2026/']) {
    await page.goto(path);
    const gallery = page.locator('[data-compact]').first();
    await expect(gallery).toBeVisible();
    await expect(gallery.locator('.media-microcaption')).toHaveCount(
      await gallery.locator('.media-figure').count(),
    );
    await expect(gallery.locator(`.media-microcaption a[href="${path}"]`)).toHaveCount(0);
    const ids = await page
      .locator('.work-main > .media-figure, .work-main [data-compact] .media-figure')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-media-id')));
    expect(new Set(ids).size).toBe(ids.length);
    for (const width of [390, 797, 1380]) {
      await page.setViewportSize({ width, height: 884 });
      const frame = (await gallery.locator('..').boundingBox())!;
      const count = await gallery.locator('.media-figure').count();
      const columns = frame.width <= 340 ? 1 : frame.width >= 900 ? 4 : frame.width >= 600 ? 3 : 2;
      await expect(gallery).toHaveCSS('column-count', String(Math.min(count, columns)));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await gallery.locator('[data-lightbox]').first().click();
    await expect(page.locator('#lightbox')).toBeVisible();
    await expect(page.locator('.lightbox-caption')).not.toBeEmpty();
    await page.keyboard.press('Escape');
  }
  await page.goto('/ru/works/mindshow/');
  await expect(page.locator('#work-credits')).toHaveCount(0);
  await expect(page.locator('.work-main [data-media-id="archive-portal-2024-mindshow-portal"]')).toHaveCount(
    0,
  );
  await page.goto('/ru/works/interference-of-realities/');
  await expect(page.locator('#work-credits .credit-grid')).toBeVisible();
});
