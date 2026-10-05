import { test, expect } from '@playwright/test';

test('work card fields keep their rows and use available width', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [390, 601, 1440]) {
    await page.setViewportSize({ width, height: 932 });
    for (const path of ['/ru/', '/ru/works/', '/en/works/', '/design-system/']) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const cards = page.locator('.work-card');
      const geometry = await cards.evaluateAll((nodes) =>
        nodes.map((card) => {
          const link = card.querySelector('.work-card__link')!;
          const media = link.querySelector('.work-card__media')!.getBoundingClientRect();
          const meta = link.querySelector('.work-card__meta')!.getBoundingClientRect();
          const title = link.querySelector('h3')!.getBoundingClientRect();
          const description = link.querySelector('p')!.getBoundingClientRect();
          return {
            id: (card as HTMLElement).dataset.workId,
            childCount: link.children.length,
            type: link.querySelector('.work-card__category')!.textContent!.trim(),
            gaps: [meta.top - media.bottom, title.top - meta.bottom, description.top - title.bottom],
            overflow: card.scrollWidth - card.clientWidth,
          };
        }),
      );
      for (const card of geometry) {
        expect(card.childCount, card.id).toBe(4);
        expect(card.type, card.id).not.toBe('');
        for (const gap of card.gaps) expect(gap, card.id).toBeGreaterThanOrEqual(-1);
        expect(card.overflow, card.id).toBeLessThanOrEqual(1);
      }
      if (width === 601 && path === '/ru/works/') {
        const interactive = page.locator('[data-work-id="emomandala"] .work-card__category');
        const dimensions = await interactive.evaluate((element) => ({
          height: element.getBoundingClientRect().height,
          line: parseFloat(getComputedStyle(element).lineHeight),
        }));
        expect(dimensions.height).toBeLessThanOrEqual(dimensions.line + 1);
        await expect(page.locator('[data-work-id="rings"] time')).toHaveAttribute('datetime', '2020');
      }
    }
  }
});
