import { test, expect } from '@playwright/test';

test('additional works expose complete pages and separate real objects from design proposals', async ({
  page,
}) => {
  test.setTimeout(60_000);
  for (const lang of ['en', 'ru']) {
    for (const slug of [
      'other-people',
      'darshan-moment',
      'fourth-dimension',
      'mom-and-baby',
      'happiness',
      'funnel',
      'lighthouse',
      'beyond',
      'neuro-honor-board',
      'cultural-neuro-code',
      'neuromandala',
    ]) {
      const response = await page.goto(`/${lang}/works/${slug}/`);
      expect(response!.status()).toBe(200);
      const minimumStoryParts = 3;
      expect(await page.locator('.work-main .editorial-sections article').count()).toBeGreaterThanOrEqual(
        minimumStoryParts,
      );
      if (slug === 'neuro-honor-board')
        await expect(page.locator('#work-credits .credit-grid .list-row').first()).toBeVisible();
      else await expect(page.locator('#work-credits')).toHaveCount(0);
      await expect(page.locator(`.reading-parent[href="/${lang}/works/"]`)).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.goto(`/${lang}/education/`);
    for (const id of ['brain-hack', 'journey']) {
      await expect(page.locator(`[data-programme-id="${id}"] img`)).toHaveCount(0);
      await expect(page.locator(`[data-programme-id="${id}"]`)).toContainText(
        lang === 'ru' ? 'Проект программы' : 'Proposed programme',
      );
    }
    await page.goto(`/${lang}/works/neuromandala/`);
    await page.locator(`main a[href="/${lang}/technology/"]`).click();
    await expect(page.locator('#method-overview')).toContainText('MultiSync');
    await page.locator(`main a[href="/${lang}/works/neuromandala/"]`).click();
    await expect(page.locator('h1')).toHaveText(lang === 'ru' ? 'Нейромандала' : 'Neuromandala');
  }
});
