import { test, expect, type Page } from '@playwright/test';
import * as data from '../src/data/site';
import { publicationPlan } from '../src/data/publication-plan';
import { createPublicationScope } from '../src/lib/publication-scope';
import { buildHeroLibrary } from '../src/lib/hero-library';
const expectedMediaIds = buildHeroLibrary(createPublicationScope(data, publicationPlan)).map(
  (row: { mediaId: string }) => row.mediaId,
);
const active = (page: Page) => page.locator('[data-carousel] [data-slide]:not([hidden])');
async function activate(page: Page, isMobile: boolean) {
  const preview = active(page).locator('[data-video-preview]');
  if (isMobile)
    await preview.evaluate((node) => {
      const box = node.getBoundingClientRect();
      scrollBy(0, box.top + box.height / 2 - innerHeight / 2);
    });
  else await page.locator('[data-carousel]').hover({ position: { x: 30, y: 30 } });
  await expect(preview).toHaveClass(/is-playing/);
}
test('fresh random starts cover the public library and preserve real target/stage labels', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    Math.random = () => (location.search.includes('last') ? 0.999999 : 0);
  });
  await page.goto('/ru/?last');
  await expect(page.locator('[data-carousel]')).toHaveAttribute('data-carousel-ready', 'true');
  const first = await active(page).getAttribute('data-media-id');
  await expect(page.locator('[data-slide]')).toHaveCount(expectedMediaIds.length);
  expect(
    await page
      .locator('[data-slide]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-media-id')).sort()),
  ).toEqual([...expectedMediaIds].sort());
  await expect(page.locator('[data-slide] source[src]')).toHaveCount(0);
  expect(
    await page
      .locator('[data-slide] video')
      .evaluateAll((videos) => videos.every((video) => !(video as HTMLVideoElement).loop)),
  ).toBe(true);
  await page.goto('/ru/?first');
  await expect(page.locator('[data-carousel]')).toHaveAttribute('data-carousel-ready', 'true');
  expect(await active(page).getAttribute('data-media-id')).not.toBe(first);
  const media = new Set<string>();
  for (let i = 0; i < expectedMediaIds.length; i++) {
    media.add((await active(page).getAttribute('data-media-id'))!);
    await expect(active(page).locator('.nm-caption-link a')).toHaveAttribute(
      'href',
      /\/ru\/(works|technology)\//,
    );
    await active(page).locator('[data-carousel-next]').click();
  }
  expect(media.size).toBe(expectedMediaIds.length);
  await expect(page.locator('[data-media-id="lighthouse-blended-spin"] [data-hero-stage]')).toHaveAttribute(
    'data-hero-stage',
    'prototype',
  );
  await expect(page.locator('.nm-heading .eyebrow')).toContainText('ГЛАВНАЯ');
  await expect(page.locator('#selected-works [data-work-id="mindshow"] .work-card__media-note')).toHaveCount(
    0,
  );
  await page.goto('/ru/works/');
  await expect(page.locator('[data-work-id="mindshow"] .work-card__media-note')).toHaveCount(0);
});
test('only an active ended video advances; hidden/offscreen video stays paused and resumes its position', async ({
  page,
  isMobile,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0.999999;
  });
  await page.goto('/en/');
  await expect(page.locator('[data-carousel]')).toHaveAttribute('data-carousel-ready', 'true');
  await expect(page.locator('.nm-heading .eyebrow')).toContainText('HOME');
  await activate(page, isMobile);
  const firstId = await active(page).getAttribute('data-slide-id');
  const first = page.locator('[data-slide-id="' + firstId + '"]');
  await expect
    .poll(() => first.locator('video').evaluate((video: HTMLVideoElement) => video.currentTime))
    .toBeGreaterThan(0.1);
  await active(page).locator('[data-carousel-next]').click();
  await expect(first.locator('video')).toHaveJSProperty('paused', true);
  const pausedAt = await first.locator('video').evaluate((video: HTMLVideoElement) => video.currentTime);
  await active(page).locator('[data-carousel-prev]').click();
  await expect(active(page)).toHaveAttribute('data-slide-id', firstId!);
  await activate(page, isMobile);
  await expect
    .poll(() => first.locator('video').evaluate((video: HTMLVideoElement) => video.currentTime))
    .toBeGreaterThan(pausedAt + 0.1);
  await first.locator('video').evaluate((video: HTMLVideoElement) => {
    video.currentTime = video.duration - 0.12;
  });
  await expect(active(page)).not.toHaveAttribute('data-slide-id', firstId!);
  await expect(active(page).locator('[data-video-preview]')).toHaveClass(/is-playing/);
  const nextId = await active(page).getAttribute('data-slide-id');
  await page.mouse.move(0, 0);
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    scrollTo(0, document.body.scrollHeight);
  });
  await expect(active(page).locator('video')).toHaveJSProperty('paused', true);
  await active(page)
    .locator('video')
    .evaluate((video) => video.dispatchEvent(new Event('ended')));
  await expect(active(page)).toHaveAttribute('data-slide-id', nextId!);
});

test('every hero caption remains separate from the introduction with larger type on short screens', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Explicit widths include the mobile layout.');
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const lang of ['ru', 'en']) {
    await page.goto('/' + lang + '/');
    await page.evaluate(() => document.fonts.ready);
    for (const width of [360, 797, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.evaluate(async () => {
        document.documentElement.style.setProperty('--type-scale', '1.125');
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
      });
      for (let index = 0; index < 7; index++) {
        const gap = await page.evaluate(
          () =>
            document.querySelector('[data-slide]:not([hidden]) .nm-work-caption')!.getBoundingClientRect()
              .top - document.querySelector('.nm-heading')!.getBoundingClientRect().bottom,
        );
        expect(gap).toBeGreaterThanOrEqual(16);
        await active(page).locator('[data-carousel-next]').click();
      }
    }
  }
});
