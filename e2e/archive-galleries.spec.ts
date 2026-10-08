import { expect, test } from '@playwright/test';

test('archival materials appear in work, event and educational galleries with shared navigation', async ({
  page,
}) => {
  for (const lang of ['ru', 'en']) {
    for (const [path, gallery] of [
      ['works/mom-and-baby/', '#work-gallery'],
      ['works/project-schrodinger/', '#work-gallery'],
      ['cases/tsiolkovsky-laboratory-2025/', '#case-gallery'],
      ['education/', '#education-media'],
    ]) {
      await page.goto(`/${lang}/${path}`);
      const buttons = page.locator(`${gallery} [data-lightbox]`);
      const count = await buttons.count();
      expect(count).toBeGreaterThan(1);
      await buttons.first().click();
      await expect(page.locator('.lightbox-position')).toHaveText(`1 / ${count}`);
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('.lightbox-position')).toHaveText(`2 / ${count}`);
      await page.keyboard.press('Escape');
      await expect(buttons.first()).toBeFocused();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});
