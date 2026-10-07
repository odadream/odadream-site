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
      'theatre-of-my-name',
      'cultural-neuro-code',
      'neuromandala',
      'brain-hack',
      'journey-to-yourself',
    ]) {
      const response = await page.goto(`/${lang}/works/${slug}/`);
      expect(response!.status()).toBe(200);
      await expect(page.locator('#work-story .editorial-sections article')).toHaveCount(
        slug === 'theatre-of-my-name' ? 4 : ['brain-hack', 'journey-to-yourself'].includes(slug) ? 2 : 3,
      );
      await expect(page.locator('#work-credits .list-row').first()).toBeVisible();
      await expect(page.locator('#site-nav [data-route="works"]')).toHaveAttribute('aria-current', 'page');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.goto(`/${lang}/works/`);
    for (const id of ['brain-hack', 'journey']) {
      await expect(page.locator(`[data-work-id="${id}"] img`)).toHaveCount(0);
      await expect(page.locator(`[data-work-id="${id}"] .work-card__media-note`)).not.toHaveText('');
    }
    await page.goto(`/${lang}/works/neuromandala/`);
    await page.locator(`main a[href="/${lang}/technology/"]`).click();
    await expect(page.locator('#method-overview')).toContainText('MultiSync');
    await page.locator(`main a[href="/${lang}/works/neuromandala/"]`).click();
    await expect(page.locator('h1')).toHaveText(lang === 'ru' ? 'Нейромандала' : 'Neuromandala');
  }
});
