import { test, expect } from '@playwright/test';

test('realized works and R&D stay distinct across the site', async ({ page }) => {
  for (const lang of ['ru', 'en']) {
    await page.goto(`/${lang}/`);
    await expect(page.locator('#selected-works .work-card')).toHaveCount(6);
    await expect(page.locator('#selected-works .work-card:not([data-work-stage="realized"])')).toHaveCount(0);
    await expect(page.locator('.feature-slide[data-slide-id="kovylina"]')).toHaveCount(0);
    await expect(page.locator('.feature-slide[data-slide-id="cultural-code"]')).toHaveCount(0);
    await page.goto(`/${lang}/works/`);
    await expect(page.locator('.works-catalogue').first().locator('.work-card')).toHaveCount(13);
    const research = page.locator('#research-works');
    await expect(research.locator('.work-card')).toHaveCount(10);
    await expect(research.locator('[data-work-id="sync"]')).toHaveAttribute('data-work-stage', 'concept');
    await expect(research.locator('[data-work-id="ancestors"]')).toHaveAttribute(
      'data-work-stage',
      'prototype',
    );
    await page.goto(`/${lang}/works/neurobattle/`);
    await expect(page.locator('h1')).toHaveText(lang === 'ru' ? 'Парадокс Успеха' : 'Paradox of Success');
    await expect(page.locator('.work-aside .record-stamp')).toContainText('Neurobattle');
    await page.goto(`/${lang}/works/emomandala/`);
    await expect(page.locator('h1')).toHaveText(lang === 'ru' ? 'Эмомандала' : 'Emomandala');
    await expect(page.locator('main')).toContainText(lang === 'ru' ? 'Ончейн-сайт' : 'On-chain site');
    await page.goto(`/${lang}/works/sync-circle/`);
    const parent = page.locator('main a[href="/' + lang + '/works/neurosynchronization/"]');
    await expect(parent).toBeVisible();
    await parent.click();
    await expect(page.locator('h1')).toHaveText(
      lang === 'ru' ? 'Нейросинхронизация' : 'Neurosynchronization',
    );
    await expect(page.locator('main a[href="/' + lang + '/works/sync-circle/"]')).toBeVisible();
  }
});
