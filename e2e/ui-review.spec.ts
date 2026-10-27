import { test, expect } from '@playwright/test';

test('contact action keeps its statement hierarchy, target size and profile inheritance', async ({
  page,
}) => {
  for (const lang of ['ru', 'en']) {
    await page.goto(`/${lang}/contact/`);
    for (const width of [360, 797, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const theme of ['light', 'dark']) {
        await page.evaluate((value) => (document.documentElement.dataset.theme = value), theme);
        const email = page.locator('main a[href="mailto:hi@odadream.art"]');
        const result = await email.evaluate((node) => {
          const style = getComputedStyle(node);
          return {
            size: style.fontSize,
            height: node.getBoundingClientRect().height,
            target: parseFloat(style.getPropertyValue('--tap-target')),
            overflow: document.documentElement.scrollWidth > innerWidth,
          };
        });
        // Resolve the semantic role through a real element, including clamp/calc profile inputs.
        const expected = await email.evaluate((node) => {
          const probe = document.createElement('span');
          probe.style.fontSize = 'var(--type-statement)';
          node.append(probe);
          const size = getComputedStyle(probe).fontSize;
          probe.remove();
          return size;
        });
        expect(result.size).toBe(expected);
        expect(result.height).toBeGreaterThanOrEqual(result.target);
        expect(result.overflow).toBe(false);
      }
    }
    const before = await page
      .locator('.contact-address')
      .evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
    await page.evaluate(() => document.documentElement.style.setProperty('--type-scale', '1.2'));
    const after = await page
      .locator('.contact-address')
      .evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
    expect(after).toBeGreaterThan(before);
    await page.evaluate(() => document.documentElement.style.removeProperty('--type-scale'));
  }
});

test('header surfaces exclude each other and release keyboard focus to the material', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/ru/works/mindshow/');
  const menu = page.locator('.menu-toggle');
  const nav = page.locator('#site-nav');
  const contents = page.locator('.reading-contents');
  const build = page.locator('[data-editorial-build]');
  const media = page.locator('#work-first-look [data-lightbox]').first();
  await menu.press('ArrowDown');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(nav.locator('a:visible').first()).toBeFocused();
  await media.focus();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');

  await contents.locator('summary').press('ArrowDown');
  await expect(contents).toHaveAttribute('open', '');
  await expect(contents.locator('.reading-contents-panel a').first()).toBeFocused();
  await media.focus();
  await expect(contents).not.toHaveAttribute('open', '');

  await build.locator('summary').click();
  await expect(build).toHaveAttribute('open', '');
  await menu.press('ArrowDown');
  await expect(build).not.toHaveAttribute('open', '');
  await contents.locator('summary').press('ArrowDown');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await build.locator('summary').click();
  await expect(contents).not.toHaveAttribute('open', '');
  await media.focus();
  await expect(build).not.toHaveAttribute('open', '');
});

test('viewer offers additional context rather than reloading the page that opened it', async ({ page }) => {
  await page.goto('/ru/cases/tsiolkovsky-festival-2026/');
  await page.locator('#case-gallery [data-lightbox]').first().click();
  await expect(page.locator('#lightbox [data-viewer-details]')).toBeHidden();
  await page.locator('.lightbox-close').click();
  await page.goto('/ru/works/mindshow/');
  const contextual = page.locator('[data-media-gallery] [data-details-href]').first();
  const destination = await contextual.getAttribute('data-details-href');
  expect(destination).toMatch(/^\/ru\/cases\//);
  await contextual.click();
  await expect(page.locator('#lightbox [data-viewer-details] a')).toHaveAttribute('href', destination!);
  await page.locator('.lightbox-close').click();
  await page.goto('/ru/recognition/');
  await page.locator('.recognition-card [data-lightbox]').first().click();
  await expect(page.locator('#lightbox [data-viewer-details] a')).toHaveAttribute(
    'href',
    /\/ru\/recognition\/#recognition-/,
  );
});
