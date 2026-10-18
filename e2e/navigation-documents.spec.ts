import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
const decisions = JSON.parse(readFileSync('docs/media-decisions.json', 'utf8'));

test('all overview sections are reachable and current in both languages, including a scrollable short-screen menu', async ({
  page,
}) => {
  for (const width of [390, 601, 797, 1440, 1600, 1601, 1920]) {
    await page.setViewportSize({ width, height: width === 601 ? 320 : 932 });
    for (const lang of ['ru', 'en']) {
      for (const section of ['recognition', 'technology']) {
        await page.goto(`/${lang}/${section}/`);
        const button = page.locator('.menu-toggle');
        if (await button.isVisible()) await button.click();
        await expect(page.locator('#site-nav a:not([data-route="design"])')).toHaveCount(7);
        await expect(page.locator('#site-nav [aria-current="page"]')).toHaveCount(0);
        await expect(page.locator(`#site-nav [data-route="${section}"]`)).toHaveCount(0);
        await expect(page.locator('.reading-page-title[aria-current="page"]')).toBeVisible();
        for (const route of [
          'works',
          'education',
          'cooperation',
          'studio',
          'cases',
          'recognition',
          'contact',
          'technology',
        ].filter((route) => route !== section)) {
          const primary = page.locator(`.primary-nav [data-route="${route}"]`);
          const overflow = page.locator(`#site-nav [data-route="${route}"]`);
          expect((await primary.isVisible()) || (await overflow.isVisible()), route).toBe(true);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
        expect(
          await page.evaluate(() => {
            const container = document.querySelector('.header-inner')!.getBoundingClientRect();
            return [...document.querySelectorAll('.header-inner > *')].every((node) => {
              if (
                getComputedStyle(node).display === 'none' ||
                (node.classList.contains('site-nav') && getComputedStyle(node).position === 'absolute')
              )
                return true;
              const rect = node.getBoundingClientRect();
              return rect.left >= container.left - 1 && rect.right <= container.right + 1;
            });
          }),
        ).toBeTruthy();
        if (await button.isVisible()) {
          await page.keyboard.press('Escape');
          await expect(button).toBeFocused();
          await expect(button).toHaveAttribute('aria-expanded', 'false');
        }
      }
    }
  }
  await page.goto('/design-system/');
  await expect(page.locator('#site-nav [data-route="design"]')).toHaveCount(0);
  await expect(page.locator('.reading-page-title')).toContainText('Дизайн-система');
});

test('rings documents use whole image pages and retain original PDFs and precise historical anchors', async ({
  page,
  request,
}) => {
  for (const lang of ['ru', 'en']) {
    await page.goto(`/${lang}/works/oda-rings/`);
    await expect(page.locator('article[id^="document-"]')).toHaveCount(2);
    await expect(page.locator('#document-oda-rings-banner')).toContainText(
      lang === 'ru' ? '40,4 МБ' : '40.4 MB',
    );
    await expect(page.locator('link[rel="preload"][href$=".pdf"]')).toHaveCount(0);
    const drawing = page.locator('#document-oda-rings-drawings');
    await expect(drawing.locator('img')).toHaveAttribute('src', /\/images\/prepared\/.+\.webp$/);
    await expect(drawing.locator('figure')).toHaveAttribute('data-fit', 'natural');
    await drawing.locator('[data-lightbox]').click();
    await expect(page.locator('#lightbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await page.goto(`/${lang}/works/oda-rings/#document-oda-rings-drawings`);
    await expect(page).toHaveURL(
      (url) => url.pathname + url.hash === `/${lang}/works/oda-rings/#document-oda-rings-drawings`,
    );
  }
  for (const [path, decision] of Object.entries(decisions) as [
    string,
    { workDocumentId?: string; sha256: string },
  ][]) {
    if (!decision.workDocumentId) continue;
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
    expect(
      createHash('sha256')
        .update(await response.body())
        .digest('hex'),
    ).toBe(decision.sha256);
  }
});
