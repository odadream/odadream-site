import { test, expect } from '@playwright/test';
test('shared orientation, chapter targets and compact colophon survive both languages and type profiles', async ({
  page,
}) => {
  test.setTimeout(120_000);
  for (const lang of ['ru', 'en']) {
    for (const path of ['', 'cooperation/', 'works/emomandala/', 'education/']) {
      await page.goto('/' + lang + '/' + path);
      const links = page.locator('.reading-outline a');
      await page.locator('.footer-document summary').click();
      expect(await links.count()).toBeGreaterThan(0);
      const chapters = await page
        .locator('main [data-page-chapter]')
        .evaluateAll((nodes) =>
          nodes.map((node) => JSON.parse(decodeURIComponent(node.getAttribute('data-page-chapter')!))),
        );
      expect(await links.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')))).toEqual(
        chapters.map((chapter) => '#' + chapter.id),
      );
      expect(new Set(chapters.map((chapter) => chapter.id)).size).toBe(chapters.length);
      for (const width of [360, 601, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        for (const scale of ['1', '1.125']) {
          await page.evaluate(
            (scale) => document.documentElement.style.setProperty('--type-scale', scale),
            scale,
          );
          for (const theme of ['light', 'dark']) {
            await page.evaluate((theme) => (document.documentElement.dataset.theme = theme), theme);
            const geometry = await page.evaluate(() => {
              const labels = [...document.querySelectorAll('.record-stamp--colophon dt')];
              const copy = document.querySelector('[data-copy-page-link]')!;
              const dd = copy.closest('dd')!;
              return {
                overflow: document.documentElement.scrollWidth > innerWidth,
                labelsFit: labels.every((node) => node.scrollWidth <= node.clientWidth),
                copyOffset: copy.getBoundingClientRect().top - dd.getBoundingClientRect().top,
                copyHeight: copy.getBoundingClientRect().height,
                copyLine: parseFloat(getComputedStyle(copy).lineHeight),
                copyTarget: parseFloat(getComputedStyle(copy, '::before').height),
              };
            });
            expect(geometry.overflow).toBe(false);
            expect(geometry.labelsFit).toBe(true);
            expect(geometry.copyOffset).toBeCloseTo(0, 0);
            expect(geometry.copyHeight).toBeCloseTo(geometry.copyLine, 0);
            expect(geometry.copyTarget).toBeGreaterThanOrEqual(44);
          }
        }
        await expect(page.locator('.reading-navigation')).toBeVisible();
        await expect(page.locator('.reading-breadcrumbs [aria-current="page"]')).toHaveCount(path ? 1 : 0);
      }
      await expect(page.locator('.footer-copyright')).toContainText('2019–' + new Date().getFullYear());
      await expect(page.locator('.footer-links [data-contact-channel="vk"]')).toHaveCount(
        lang === 'ru' ? 1 : 0,
      );
      if (lang === 'ru')
        await expect(page.locator('.footer-links [data-contact-channel="vk"]')).toHaveAttribute(
          'href',
          'https://vk.ru/odadream',
        );
      await page.setViewportSize({ width: 390, height: 900 });
      await page.locator('.footer-links a[href="#top"]').click();
      await expect(page).toHaveURL(/#top$/);
      await page.waitForLoadState('domcontentloaded');
      await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(2);
      await page.locator('.reading-contents summary').click();
      await links.first().click();
      await expect(page).toHaveURL(new RegExp('#' + chapters[0].id + '$'));
      await page.locator('.footer-links a[href="#top"]').click();
      await expect(page).toHaveURL(/#top$/);
      await page.waitForLoadState('domcontentloaded');
      await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(2);
    }
  }
});
