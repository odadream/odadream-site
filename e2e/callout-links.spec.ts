import { test, expect } from '@playwright/test';

test('a long destination name wraps inside narrow passport fields', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto('/en/cases/oktava-2021/');
  await page.evaluate(() => document.fonts.ready);
  const link = page.locator('.work-aside a[href="/en/works/neurosynchronization/"]');
  await expect(link).toBeVisible();
  expect(await link.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('callout shelves follow text rows, spacing and theme changes', async ({ page }) => {
  await page.goto('/design-system/');
  await page.evaluate(() => document.fonts.ready);
  const link = page.getByRole('link', {
    name: 'Документация премьерного показа и исследования восприятия зрителей',
  });
  for (const width of [360, 797, 1529]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ['dark', 'light']) {
      await page.evaluate((value) => {
        document.documentElement.dataset.theme = value;
      }, theme);
      await expect(link).toHaveClass(/is-drawn/);
      await expect
        .poll(() =>
          link.evaluate((element) => {
            const content = element.querySelector('.callout-link-content')!;
            const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
            const range = document.createRange();
            const rows = new Set<number>();
            while (walker.nextNode()) {
              range.selectNodeContents(walker.currentNode);
              for (const rect of range.getClientRects()) if (rect.width) rows.add(Math.round(rect.bottom));
            }
            const path = element.querySelector('.callout-link-drawing path')!.getAttribute('d')!;
            return (path.match(/M/g)?.length ?? 0) === rows.size;
          }),
        )
        .toBe(true);
      const result = await link.evaluate((element) => {
        const marker = element.querySelector('.callout-link-marker')!.getBoundingClientRect();
        const tail = element.querySelector('.callout-link-tail')!.firstChild!;
        const range = document.createRange();
        range.setStart(tail, tail.textContent!.length - 1);
        range.setEnd(tail, tail.textContent!.length);
        const space = range.getBoundingClientRect();
        return {
          gap: marker.left - space.right,
          space: space.width,
          overflow: element.scrollWidth - element.clientWidth,
          decoration: getComputedStyle(element).textDecorationLine,
        };
      });
      expect(Math.abs(result.gap)).toBeLessThan(0.1);
      expect(result.space).toBeGreaterThan(2);
      expect(result.overflow).toBeLessThanOrEqual(1);
      expect(result.decoration).toBe('none');
    }
  }
  await link.focus();
  await expect(link).toBeFocused();
  await expect(link).not.toHaveCSS('outline-style', 'none');
});
