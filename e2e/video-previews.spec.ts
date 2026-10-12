import { test, expect, type Locator } from '@playwright/test';

async function centre(item: Locator) {
  await item.evaluate((node) => {
    const box = node.getBoundingClientRect();
    window.scrollBy(0, box.top + box.height / 2 - innerHeight / 2);
  });
}

test('first-frame previews use hover on desktop and choose one central video on touch', async ({
  page,
  isMobile,
}) => {
  await page.goto('/design-system/');
  const samples = page.locator('.video-preview-specimens [data-video-preview]');
  const first = samples.nth(0);
  const second = samples.nth(1);
  await expect(samples.locator('source[src]')).toHaveCount(0);
  await centre(first);
  if (!isMobile) {
    await expect(first.locator('video')).not.toHaveClass(/is-playing/);
    await expect(samples.locator('source[src]')).toHaveCount(0);
    await first.hover();
  }
  await expect(first).toHaveClass(/is-playing/);
  await expect
    .poll(() => first.locator('video').evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(0);
  await expect(second).not.toHaveClass(/is-playing/);
  if (isMobile) await centre(second);
  else {
    await page.mouse.move(0, 0);
    await second.focus();
  }
  await expect(second).toHaveClass(/is-playing/);
  await expect(first).not.toHaveClass(/is-playing/);
  await expect
    .poll(() => first.locator('video').evaluate((v: HTMLVideoElement) => v.paused && v.currentTime > 0))
    .toBeTruthy();
  await expect(first).toHaveClass(/has-frame/);
  await expect(first.locator('video')).toHaveCSS('opacity', '1');
  const pausedAt = await first.locator('video').evaluate((v: HTMLVideoElement) => v.currentTime);
  if (isMobile) await centre(first);
  else {
    await second.evaluate((node) => (node as HTMLElement).blur());
    await first.hover();
  }
  await expect(first).toHaveClass(/is-playing/);
  await expect
    .poll(() => first.locator('video').evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(pausedAt + 0.08);
  await expect(samples.locator('video.is-playing')).toHaveCount(1);
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo(0, 0);
  });
  await expect(second).not.toHaveClass(/is-playing/);
  await expect(second.locator('img')).toHaveAttribute('src', '/video/hero/cultural-code-poster.webp');
});

test('reduced motion and Save-Data keep a still without requesting a video', async ({ page, isMobile }) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('.mp4')) requests.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/design-system/');
  let first = page.locator('.video-preview-specimens [data-video-preview]').first();
  await centre(first);
  if (!isMobile) await first.hover();
  await expect(first).not.toHaveClass(/is-playing/);
  await expect(first.locator('source[src]')).toHaveCount(0);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true, addEventListener() {} },
    });
  });
  await page.reload();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  first = page.locator('.video-preview-specimens [data-video-preview]').first();
  await centre(first);
  if (!isMobile) await first.hover();
  await expect(first.locator('source[src]')).toHaveCount(0);
  expect(requests).toEqual([]);
});

test('a late play result cannot revive a preview after it leaves the active area', async ({
  page,
  isMobile,
}) => {
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      const video = this;
      return new Promise<void>((resolve, reject) => {
        play.call(video).then(() => {
          (window as any).__releasePreview = resolve;
        }, reject);
      });
    };
  });
  await page.goto('/design-system/');
  const first = page.locator('.video-preview-specimens [data-video-preview]').first();
  await centre(first);
  if (!isMobile) await first.hover();
  await expect.poll(() => page.evaluate(() => typeof (window as any).__releasePreview)).toBe('function');
  await page.mouse.move(0, 0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(first).not.toHaveClass(/is-playing/);
  // Wait for the scroll observer to deactivate, then resolve the actual browser play().
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  await page.evaluate(() => (window as any).__releasePreview());
  await expect.poll(() => first.locator('video').evaluate((v: HTMLVideoElement) => v.paused)).toBeTruthy();
  await expect(first).not.toHaveClass(/is-playing/);
});

test('hidden page and pagehide stop movement; returning restores the active context', async ({
  page,
  isMobile,
}) => {
  await page.goto('/design-system/');
  const first = page.locator('.video-preview-specimens [data-video-preview]').first();
  await centre(first);
  if (!isMobile) await first.hover();
  await expect(first).toHaveClass(/is-playing/);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(first).not.toHaveClass(/is-playing/);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(first).toHaveClass(/is-playing/);
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  await expect(first).not.toHaveClass(/is-playing/);
  await page.evaluate(() => window.dispatchEvent(new Event('pageshow')));
  await expect(first).toHaveClass(/is-playing/);
});
