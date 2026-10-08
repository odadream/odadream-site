import { expect, test } from '@playwright/test';

test('unloaded document pages reserve their intrinsic proportions without moving following content', async ({
  page,
}) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/images/prepared/**/page-*.webp', async (route) => {
    await held;
    await route.continue();
  });
  await page.goto('/ru/cooperation/', { waitUntil: 'domcontentloaded' });
  const image = page.locator('#document-technical-overview-ru img').first();
  await image.scrollIntoViewIfNeeded();
  const before = await image.boundingBox();
  expect(before!.height).toBeGreaterThan(100);
  expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBe(0);
  release();
  await image.evaluate((element: HTMLImageElement) => element.decode());
  const after = await image.boundingBox();
  expect(Math.abs(before!.height - after!.height)).toBeLessThan(1);
});

test('multi-page documents keep order and proportions across languages, themes and viewport widths', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Explicit viewport matrix runs once.');
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [390, 601, 797, 1440, 1920]) {
    await page.setViewportSize({ width, height: 932 });
    for (const lang of ['ru', 'en']) {
      await page.goto(`/${lang}/cooperation/#production-overview`);
      const row = page.locator(`#document-technical-overview-${lang}`);
      const gallery = row.locator('[data-media-gallery]');
      await expect(gallery.locator('figure')).toHaveCount(2);
      await gallery.scrollIntoViewIfNeeded();
      await gallery.locator('img').evaluateAll(async (nodes) => {
        await Promise.all(nodes.map((node) => (node as HTMLImageElement).decode()));
      });
      for (const theme of ['light', 'dark']) {
        await page.evaluate((value) => {
          document.documentElement.dataset.theme = value;
        }, theme);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        for (const figure of await gallery.locator('figure').all()) {
          await expect(figure).toHaveAttribute('data-representation', 'document');
          await expect(figure).toHaveAttribute('data-fit', 'natural');
          const delta = await figure.locator('img').evaluate((image: HTMLImageElement) => {
            const box = image.getBoundingClientRect();
            return Math.abs(box.width / box.height - image.naturalWidth / image.naturalHeight);
          });
          expect(delta, `${width} ${lang} ${theme}`).toBeLessThan(0.015);
        }
        if (lang === 'ru' && [390, 1440].includes(width))
          await row.screenshot({ path: `.local-server/media-review/document-${width}-${theme}.png` });
      }
      await gallery.locator('[data-lightbox]').first().click();
      await expect(page.locator('.lightbox-position')).toHaveText('1 / 2');
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('.lightbox-position')).toHaveText('2 / 2');
      await page.locator('[data-viewer-zoom]').click();
      await expect(page.locator('[data-viewer-zoom]')).toHaveAttribute('aria-pressed', 'true');
      await page.keyboard.press('Escape');
      await expect(gallery.locator('[data-lightbox]').first()).toBeFocused();
    }
  }
});
