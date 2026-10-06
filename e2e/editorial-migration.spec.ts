import { test, expect } from '@playwright/test';

test('method, format parameters and cooperation form a connected bilingual structure', async ({ page }) => {
  for (const lang of ['ru', 'en']) {
    await page.goto(`/${lang}/technology/`);
    await expect(page.locator('#method-overview')).toBeVisible();
    await expect(page.locator('#signal-process .method-steps p')).toHaveCount(4);
    await expect(page.locator('#participation .list-row')).toHaveCount(3);
    await expect(page.locator('#method-boundaries .facts li')).toHaveCount(4);
    await expect(page.locator('#visual-language video')).toHaveCount(1);
    await page.goto(`/${lang}/formats/`);
    await expect(page.locator('#mindshow-installation')).toContainText('7 ± 2');
    await expect(page.locator('#neurobattle-game')).toContainText('90');
    await expect(page.locator('#talk-workshop .facts li')).toHaveCount(4);
    await page.goto(`/${lang}/cooperation/`);
    await expect(page.locator('#cooperation-scenarios article')).toHaveCount(4);
    await expect(page.locator('#cooperation-modes .list-row')).toHaveCount(3);
    await expect(page.locator('#production-overview .record-stamp')).toHaveCount(1);
    await expect(page.locator('#project-brief .facts li')).toHaveCount(5);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('merged old educational entrance opens the exact scenario and method hero has a real destination', async ({
  page,
}) => {
  await page.goto('/?id=hub-education&lang=ru');
  await expect(page).toHaveURL(/\/ru\/cooperation\/#for-education$/);
  await expect(page.locator('#for-education')).toBeVisible();
  await page.goto('/ru/');
  await expect(page.locator('.nm-caption-link a[href="/ru/technology/"]')).toHaveCount(2);
});
