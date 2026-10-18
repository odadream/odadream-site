import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
for (const lang of ['ru', 'en']) {
  test('homepage event and recognition overviews: ' + lang, async ({ page }) => {
    await page.goto('/' + lang + '/');
    const rows = page.locator('#timeline .case-row--overview');
    await expect(rows.first()).toBeVisible();
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    await expect(rows.locator('a')).toHaveCount(count);
    await expect(rows.locator('h3 a')).toHaveCount(count);
    const titleStyles = await rows.first().evaluate((row) => {
      const title = getComputedStyle(row.querySelector('h3')!);
      const link = getComputedStyle(row.querySelector('h3 a')!);
      return {
        title: [title.fontSize, title.fontFamily, title.fontWeight, title.lineHeight],
        link: [link.fontSize, link.fontFamily, link.fontWeight, link.lineHeight],
      };
    });
    expect(titleStyles.link).toEqual(titleStyles.title);
    await expect(rows.locator('.case-row__location').first()).toHaveCSS('font-size', '11px');
    const events = await rows.evaluateAll((rows) =>
      rows.map((row) => ({
        id: row.getAttribute('data-case-id'),
        status: row.getAttribute('data-participation-status'),
        year: row.querySelector('.case-row__metadata')?.textContent,
        title: row.querySelector('h3')?.textContent?.trim(),
      })),
    );
    expect(events.every((row) => row.status === 'held')).toBeTruthy();
    expect(new Set(events.map((row) => row.id)).size).toBe(count);
    const years = events.map((row) => Number(row.year?.trim()));
    expect(years).toEqual([...years].sort((a, b) => b - a));
    const firstLink = rows.first().locator('h3 a');
    await expect(firstLink).toHaveAttribute('href', '/' + lang + '/cases/tsiolkovsky-festival-2026/');
    await expect(rows.locator('.link-row')).toHaveCount(0);
    await expect(rows.filter({ hasText: lang === 'ru' ? 'Подробнее' : 'Explore' })).toHaveCount(0);
    expect(events.find((row) => row.id === 'tsiolkovsky-2026')?.title).toBe(
      lang === 'ru' ? 'Фестиваль Циолковского' : 'Tsiolkovsky Festival',
    );
    const wall = page.locator('#home-recognition-wall');
    await expect(wall.locator('figure')).toHaveCount(18);
    await expect(wall.locator('[data-lightbox]')).toHaveCount(16);
    await expect(wall.locator('a[href="/' + lang + '/recognition/"]')).toHaveCount(1);
    await expect(page.locator('#recognition .recognition-card--overview')).toHaveCount(0);
    const workDetails = page.locator('.record-stamp__more').filter({
      has: page.locator('summary', { hasText: lang === 'ru' ? 'Состав по стадиям' : 'Stage breakdown' }),
    });
    await workDetails.locator('summary').click();
    await expect(workDetails.locator('dt')).toHaveCount(4);
    await expect(workDetails.locator('dd').last()).toHaveText('0');
    const breakdown = page.locator('#timeline .record-stamp__more');
    await breakdown.locator('summary').click();
    await expect(breakdown.locator('dt')).toHaveCount(12);
    await expect(breakdown.locator('.small-note')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    if (lang === 'ru') {
      await mkdir('.local-server/prepublication-feedback', { recursive: true });
      await page.locator('#timeline').screenshot({
        path: '.local-server/prepublication-feedback/events-' + test.info().project.name + '.png',
      });
    }
  });
}

test('breadcrumbs align text baselines while links retain a full tap target', async ({ page }) => {
  for (const lang of ['ru', 'en']) {
    await page.goto('/' + lang + '/works/interference-of-realities/');
    for (const width of [390, 850, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => document.fonts.ready);
      const baseline = await page.locator('.breadcrumbs > *').evaluateAll((nodes) =>
        nodes.map((node) => {
          const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            if (!walker.currentNode.textContent?.trim()) continue;
            const range = document.createRange();
            range.selectNodeContents(walker.currentNode);
            return range.getClientRects()[0].bottom;
          }
          throw Error('Missing breadcrumb text');
        }),
      );
      expect(Math.max(...baseline) - Math.min(...baseline)).toBeLessThanOrEqual(1);
      expect(
        await page
          .locator('.breadcrumbs a')
          .evaluateAll((links) => links.every((link) => link.getBoundingClientRect().height >= 44)),
      ).toBeTruthy();
    }
  }
  await page.goto('/ru/works/interference-of-realities/');
  await mkdir('.local-server/prepublication-feedback', { recursive: true });
  await page.setViewportSize({ width: test.info().project.name === 'mobile' ? 390 : 1280, height: 900 });
  await page.screenshot({
    path: '.local-server/prepublication-feedback/breadcrumbs-' + test.info().project.name + '.png',
  });
});

test('compact headings and record actions keep natural line height and usable hit areas', async ({
  page,
}) => {
  for (const lang of ['ru', 'en']) {
    await page.goto('/' + lang + '/');
    await page.evaluate(() => document.fonts.ready);
    const titles = await page.locator('#timeline h3').evaluateAll((nodes) =>
      nodes.map((heading) => {
        const content = heading.querySelector('.callout-link-content')!;
        return {
          heading: heading.getBoundingClientRect().height,
          text: content.getBoundingClientRect().height,
          gap:
            heading.nextElementSibling!.getBoundingClientRect().top - heading.getBoundingClientRect().bottom,
        };
      }),
    );
    for (const title of titles) expect(Math.abs(title.heading - title.text)).toBeLessThanOrEqual(1);
    expect(
      Math.max(...titles.map((title) => title.gap)) - Math.min(...titles.map((title) => title.gap)),
    ).toBeLessThanOrEqual(1);
    await page.locator('.footer-document > summary').click();
    const copy = page.locator('[data-copy-page-link]');
    await copy.scrollIntoViewIfNeeded();
    const field = await copy.evaluate((button) => {
      const rect = button.getBoundingClientRect();
      const area = getComputedStyle(button, '::before');
      const centre = rect.top + rect.height / 2;
      return {
        line: parseFloat(getComputedStyle(button).lineHeight),
        height: rect.height,
        area: parseFloat(area.height),
        hits: [-21, 21].map(
          (offset) => document.elementFromPoint(rect.left + rect.width / 2, centre + offset) === button,
        ),
      };
    });
    expect(Math.abs(field.height - field.line)).toBeLessThanOrEqual(1);
    expect(field.area).toBeGreaterThanOrEqual(44);
    expect(field.hits).toEqual([true, true]);
    const values = await page
      .locator('.record-stamp--colophon dd')
      .evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().height));
    expect(Math.max(...values) - Math.min(...values)).toBeLessThanOrEqual(1);
    if (lang === 'ru')
      await page.locator('.site-colophon').screenshot({
        path: '.local-server/prepublication-feedback/colophon-' + test.info().project.name + '.png',
      });
  }
});
