import { expect, test } from '@playwright/test';

test('active chapter has one continuous rule under its complete icon, number and label', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Explicit viewport and theme matrix runs once.');
  test.setTimeout(60_000);
  const paths = [
    '/ru/cases/tsiolkovsky-festival-2026/',
    '/en/cases/tsiolkovsky-festival-2026/',
    ...(process.env.ODA_E2E_PUBLIC === 'true' ? [] : ['/design-system/']),
  ];
  for (const path of paths) {
    for (const width of [320, 582, 1280]) {
      await page.setViewportSize({ width, height: 884 });
      await page.goto(path);
      const contents = page.locator('.reading-contents');
      const first = contents.locator('.reading-outline a').first();
      await contents.locator('summary').click();
      await first.click();
      await expect(first).toHaveAttribute('aria-current', 'location');
      await contents.locator('summary').click();
      for (const theme of ['light', 'dark']) {
        await page.evaluate((value) => {
          document.documentElement.dataset.theme = value;
        }, theme);
        const geometry = await first.evaluate((link) => {
          const label = link.querySelector<HTMLElement>('.page-outline__label')!;
          const code = label.querySelector('.page-code')!.getBoundingClientRect();
          const text = label.lastElementChild!.getBoundingClientRect();
          const box = label.getBoundingClientRect();
          const style = getComputedStyle(label.querySelector('.page-outline__baseline')!, '::after');
          return {
            style: style.borderBottomStyle,
            thickness: parseFloat(style.borderBottomWidth),
            color: style.borderBottomColor,
            ink: getComputedStyle(link).color,
            baseline: label.querySelector('.page-outline__baseline')!.getBoundingClientRect().height,
            offset: style.transform,
            coversGroup:
              box.left <= code.left &&
              box.right >= text.right &&
              box.bottom >= Math.max(code.bottom, text.bottom),
            tapHeight: link.getBoundingClientRect().height,
            overflow: document.documentElement.scrollWidth > innerWidth,
          };
        });
        expect(geometry.style).toBe('solid');
        expect(geometry.thickness).toBeGreaterThan(0);
        expect(geometry.color).toBe(geometry.ink);
        expect(geometry.baseline).toBe(0);
        expect(geometry.offset).not.toBe('none');
        expect(geometry.coversGroup).toBe(true);
        expect(geometry.tapHeight).toBeGreaterThanOrEqual(44);
        expect(geometry.overflow).toBe(false);
        await page.evaluate(() => document.documentElement.style.setProperty('--link-rule-width', '3px'));
        expect(
          await first
            .locator('.page-outline__baseline')
            .evaluate((node) => getComputedStyle(node, '::after').borderBottomWidth),
        ).toBe('3px');
        await page.evaluate(() => document.documentElement.style.removeProperty('--link-rule-width'));
      }
    }
  }
});

test('design system exposes the production outline beside ordinary underline', async ({ page, isMobile }) => {
  test.skip(isMobile || process.env.ODA_E2E_PUBLIC === 'true', 'DEV specimen');
  await page.goto('/design-system/#system-outline-active');
  const specimen = page.locator('#system-outline-active');
  await expect(specimen.locator('.editorial-link')).toHaveCSS('text-decoration-line', 'underline');
  await expect(specimen.locator('.reading-outline .page-outline__baseline')).toHaveCount(2);
  await expect(specimen.locator('a[aria-current="location"]')).toHaveCount(1);
});
