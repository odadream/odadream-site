import { test, expect } from '@playwright/test';

test('external materials use shared wrapping links without loading provider players', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'The complete width matrix is checked once.');
  const providerRequests: string[] = [];
  page.on('request', (request) => {
    if (/https:\/\/(?:[^/]+\.)?(?:dzen\.ru|youtube\.com|vk\.com|ntv\.ru|tcxp\.ru)\//.test(request.url()))
      providerRequests.push(request.url());
  });
  for (const width of [390, 601, 797, 1440, 1920]) {
    await page.setViewportSize({ width, height: 932 });
    for (const lang of ['ru', 'en']) {
      await page.goto(`/${lang}/works/theatre-of-my-name/`);
      for (const theme of ['light', 'dark']) {
        await page.evaluate(async (theme) => {
          document.documentElement.dataset.theme = theme;
          await document.fonts.ready;
        }, theme);
        await expect(page.locator('#work-story-external-materials .source-links a')).toHaveCount(4);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
      await page.goto(`/${lang}/education/`);
      await expect(page.locator('.source-links a')).toHaveCount(4);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  await expect(page.locator('iframe')).toHaveCount(0);
  expect(providerRequests).toEqual([]);
});

test('selection records retain final outcome and do not fabricate scans or awards', async ({ page }) => {
  await page.goto('/ru/recognition/');
  await expect(page.locator('#recognition-cyens-reserve-2026')).toContainText(
    'не вошли в программу фестиваля',
  );
  await expect(page.locator('#recognition-culttech-school-grant-2026')).toContainText(
    '100% стоимости School Phase',
  );
  for (const id of ['cyens-reserve-2026', 'culttech-school-grant-2026'])
    await expect(page.locator(`#recognition-${id} img`)).toHaveCount(0);
});

test('recovered meditation event exposes the primary report and explicit date limitations', async ({
  page,
}) => {
  for (const lang of ['ru', 'en']) {
    await page.goto(`/${lang}/cases/`);
    const row = page.locator('#case-meditation-day-2026');
    await expect(row).toContainText(
      lang === 'ru' ? 'день публикации отчёта студии' : 'publication date of the studio’s report',
    );
    await expect(row.locator('a[href="https://t.me/odadream/760"]')).toBeVisible();
  }
});
