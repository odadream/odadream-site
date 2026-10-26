import { expect, test } from '@playwright/test';

test('festival case documents a dated presentation and separates festival, work and project destinations', async ({
  page,
}) => {
  for (const lang of ['ru', 'en']) {
    await page.goto(`/${lang}/cases/tsiolkovsky-festival-2026/`);
    const story = page.locator('#case-story');
    await expect(page.locator('.work-main > figure')).toHaveAttribute(
      'data-media-id',
      'archive-interference-interference-2026-poster',
    );
    await expect(page.locator('.work-main > figure')).toHaveAttribute('data-fit', 'natural');
    await expect(page.locator('#case-gallery figure')).toHaveCount(3);
    await expect(page.locator('#case-gallery video')).toHaveCount(0);
    await expect(page.locator('.reading-page-title .page-code')).toHaveCount(0);
    await expect(page.locator('.reading-parent')).toHaveAttribute('href', `/${lang}/cases/`);
    await expect(page.locator('.reading-parent')).toHaveAccessibleName(lang === 'ru' ? 'Кейсы' : 'Cases');
    await expect(story).toContainText('19:00');
    await expect(story).toContainText(lang === 'ru' ? '16–23 мая 2026' : '16–23 May 2026');
    await expect(story).toContainText(lang === 'ru' ? 'Горизонты' : 'Horizons');
    await expect(story.locator('a[href="https://t-fest.online/"]')).toHaveCount(1);
    await expect(story.locator('a[href="https://interference.odadream.art/"]')).toHaveCount(1);
    await expect(page.locator('.work-aside a[href$="/works/interference-of-realities/"]')).toHaveCount(1);
    await expect(story).not.toContainText(lang === 'ru' ? 'пять сцен' : 'five scenes');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('dedicated performance site owns the detailed story while the studio card keeps a clear handoff', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Explicit responsive matrix runs once.');
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const lang of ['ru', 'en'])
    for (const width of [320, 740, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${lang}/works/interference-of-realities/`);
      for (const theme of ['light', 'dark']) {
        await page.evaluate((value) => {
          document.documentElement.dataset.theme = value;
        }, theme);
        const link = page.locator('#work-project-site a');
        await expect(link).toHaveAttribute('href', 'https://interference.odadream.art/');
        await expect(link).toHaveAttribute('data-link-destination', 'external');
        await expect(link).toContainText('interference.odadream.art');
        await expect(page.locator('.work-main > figure')).toHaveAttribute(
          'data-media-id',
          'archive-interference-interference-2026-02',
        );
        await expect(page.locator('#work-gallery, #work-story')).toHaveCount(0);
        await expect(page.locator('#work-credits .credit-grid .list-row')).toHaveCount(7);
        await expect(page.locator('#work-context')).toContainText('ODA.dream');
        await expect(page.locator('#work-availability a.button')).toHaveAttribute(
          'href',
          `/${lang}/contact/`,
        );
        await link.focus();
        await expect(link).toBeFocused();
        const layout = await page.evaluate(() => {
          const link = document.querySelector('#work-project-site')!.getBoundingClientRect();
          const image = document.querySelector('.work-main > figure')!.getBoundingClientRect();
          return {
            ordered: link.bottom <= image.top,
            overflow: document.documentElement.scrollWidth > innerWidth,
            brokenAnchors: [...document.querySelectorAll<HTMLAnchorElement>('.work-aside a[href^="#"]')]
              .filter((a) => !document.getElementById(a.hash.slice(1)))
              .map((a) => a.hash),
          };
        });
        expect(layout, `${lang} ${width} ${theme}`).toEqual({
          ordered: true,
          overflow: false,
          brokenAnchors: [],
        });
      }
    }
});
