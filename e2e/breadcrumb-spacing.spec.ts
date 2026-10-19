import { expect, test } from '@playwright/test';

test('compact breadcrumb icon keeps natural spacing and a separate full touch target', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Explicit responsive matrix runs once.');
  for (const lang of ['ru', 'en'])
    for (const width of [320, 582, 1280]) {
      await page.setViewportSize({ width, height: 884 });
      await page.goto(`/${lang}/cases/tsiolkovsky-festival-2026/`);
      const parent = page.locator('.reading-parent');
      const layout = await parent.evaluate((link) => {
        const box = link.getBoundingClientRect();
        const icon = link.querySelector('.page-code')!.getBoundingClientRect();
        const hit = getComputedStyle(link, '::after');
        const current = link.nextElementSibling!;
        const separator = getComputedStyle(current, '::before');
        return {
          width: box.width,
          iconWidth: icon.width,
          height: box.height,
          hitWidth: box.width - parseFloat(hit.left) - parseFloat(hit.right),
          margin: parseFloat(separator.marginInlineEnd),
          overflow: document.documentElement.scrollWidth > innerWidth,
          padding: box.width - icon.width,
        };
      });
      expect(layout.margin).toBe(0);
      expect(layout.height).toBeGreaterThanOrEqual(44);
      expect(layout.hitWidth).toBeGreaterThanOrEqual(44);
      expect(layout.overflow).toBe(false);
      if (width < 700) expect(layout.padding).toBeLessThan(1);
      const target = await parent.evaluate((link) => {
        const r = link.getBoundingClientRect();
        return { x: innerWidth < 700 ? r.left - 8 : r.left + 2, y: r.top + r.height / 2 };
      });
      await page.mouse.click(target.x, target.y);
      await expect(page).toHaveURL(new RegExp(`/${lang}/cases/$`));
    }
});
