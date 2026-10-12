import { test, expect } from '@playwright/test';
for (const lang of ['ru', 'en']) {
  test('homepage event and recognition overviews: ' + lang, async ({ page }) => {
    await page.goto('/' + lang + '/');
    const rows = page.locator('#timeline .case-row--overview');
    await expect(rows).toHaveCount(12);
    await expect(rows.locator('.case-row__location').first()).toHaveCSS('font-size', '11px');
    const events = await rows.evaluateAll((rows) =>
      rows.map((row) => ({
        id: row.getAttribute('data-case-id'),
        status: row.getAttribute('data-participation-status'),
        year: row.querySelector('.case-row__metadata')?.textContent,
        title: row.querySelector('h3')?.textContent,
      })),
    );
    expect(events.every((row) => row.status === 'held')).toBeTruthy();
    for (let year = 2019; year <= 2026; year++)
      expect(events.some((row) => row.year?.includes(String(year)))).toBeTruthy();
    expect(events.find((row) => row.id === 'tsiolkovsky-2026')?.title).toBe(
      lang === 'ru' ? 'Фестиваль Циолковского' : 'Tsiolkovsky Festival',
    );
    const cards = page.locator('#recognition .recognition-card--overview');
    await expect(cards).toHaveCount(7);
    await expect(cards.first()).toHaveAttribute('id', 'recognition-skolkovo-arttech-2026');
    await expect(cards.locator('.small-note')).toHaveCount(0);
    await expect(cards.locator('.recognition-card__claim')).toHaveCount(7);
    await expect(cards.locator('a')).toHaveCount(7);
    const workDetails = page.locator('.record-stamp__more').filter({
      has: page.locator('summary', { hasText: lang === 'ru' ? 'Состав по стадиям' : 'Stage breakdown' }),
    });
    await workDetails.locator('summary').click();
    await expect(workDetails.locator('dt')).toHaveCount(4);
    await expect(workDetails.locator('dd').last()).toHaveText('0');
    const breakdown = page.locator('#timeline .record-stamp__more');
    await breakdown.locator('summary').click();
    await expect(breakdown.locator('dt')).toHaveCount(12);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}
