import { expect, test } from '@playwright/test';

test('natural tiles, protected documents and large sequences keep their proportions in both themes', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Explicit viewport matrix runs once.');
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [390, 601, 797, 1440, 1920]) {
    await page.setViewportSize({ width, height: 932 });
    await page.goto('/design-system/');
    for (const theme of ['light', 'dark']) {
      await page.evaluate((value) => {
        document.documentElement.dataset.theme = value;
      }, theme);
      const gallery = page.locator('#system-gallery-tiles');
      await gallery.scrollIntoViewIfNeeded();
      await gallery.locator('img').evaluateAll(async (nodes) => {
        await Promise.all(nodes.map((node) => (node as HTMLImageElement).decode().catch(() => {})));
      });
      const failures = await page.evaluate(() => {
        const failures: string[] = [];
        if (document.documentElement.scrollWidth > innerWidth) failures.push('overflow');
        document.querySelectorAll<HTMLElement>('[data-media-gallery] figure').forEach((figure) => {
          const image = figure.querySelector<HTMLImageElement>('img')!;
          const box = image.getBoundingClientRect();
          if (
            figure.dataset.fit === 'natural' &&
            image.naturalWidth &&
            Math.abs(box.width / box.height - image.naturalWidth / image.naturalHeight) > 0.015
          )
            failures.push(figure.dataset.mediaId!);
          if (
            ['document', 'poster', 'diagram'].includes(figure.dataset.representation!) &&
            figure.dataset.fit !== 'natural'
          )
            failures.push('cropped document');
        });
        return failures;
      });
      expect(failures, `${width} ${theme}`).toEqual([]);
      await expect(page.locator('#system-gallery-crop figure').first()).toHaveAttribute('data-fit', 'crop');
      await expect(page.locator('#system-gallery-sequence')).toHaveAttribute('data-mode', 'sequence');
    }
  }
});

test('gallery navigation stays within its selection, preserves attribution and returns focus', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/design-system/');
  const gallery = page.locator('#system-gallery-tiles');
  const buttons = gallery.locator('[data-gallery-item]');
  await buttons.first().click();
  await expect(page.locator('.lightbox-position')).toHaveText('1 / 7');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('.lightbox-position')).toHaveText('7 / 7');
  await page.locator('[data-viewer-previous]').click();
  await expect(page.locator('.lightbox-caption')).toContainText('Ольга');
  await page.keyboard.press('Escape');
  await expect(buttons.first()).toBeFocused();
  await page.goto('/ru/works/project-schrodinger/');
  const workButtons = page.locator('#work-gallery [data-lightbox]');
  const workCount = await workButtons.count();
  await workButtons.first().click();
  await expect(page.locator('.lightbox-position')).toHaveText(`1 / ${workCount}`);
  await expect(page.locator('[data-viewer-next]')).toBeVisible();
  await expect(page.locator('.lightbox-caption')).toContainText('Арабовы');
  await page.locator('[data-viewer-zoom]').click();
  await expect(page.locator('[data-viewer-zoom]')).toHaveAttribute('aria-pressed', 'true');
  const image = page.locator('#lightbox img');
  expect(
    await image.evaluate(
      (img: HTMLImageElement) => Math.abs(img.getBoundingClientRect().width - img.naturalWidth) < 1,
    ),
  ).toBe(true);
  expect(
    await page.locator('.lightbox-stage').evaluate((node) => node.scrollHeight > node.clientHeight),
  ).toBe(true);
  await page.locator('[data-viewer-zoom]').click();
  await expect(page.locator('#lightbox')).not.toHaveAttribute('data-zoomed');
});

test('full video uses explicit playback, stops previews and releases its source on close', async ({
  page,
}) => {
  await page.goto('/design-system/');
  const button = page.locator('#system-gallery-tiles [data-kind="video"]');
  await button.click();
  const player = page.locator('#lightbox video');
  await expect(player).toBeVisible();
  expect(await player.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
  expect(
    await page
      .locator('video[data-preview]')
      .evaluateAll((rows: HTMLVideoElement[]) => rows.every((row) => row.paused)),
  ).toBe(true);
  await expect(player).toHaveAttribute('data-media-id', 'neuromandala-terra');
  await page.keyboard.press('Escape');
  await expect(player).not.toHaveAttribute('src');
  expect(await player.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
});

test('an unavailable image still offers navigation and close', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/design-system/');
  await page
    .locator('#system-gallery-tiles [data-gallery-item]')
    .first()
    .evaluate((node) => {
      (node as HTMLElement).dataset.src = '/missing-gallery-image.webp';
    });
  await page.locator('#system-gallery-tiles [data-gallery-item]').first().click();
  await expect(page.locator('.lightbox-status')).toContainText('недоступно');
  await page.locator('[data-viewer-next]').click();
  await expect(page.locator('.lightbox-status')).toHaveText('');
  await expect(page.locator('#lightbox img')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#lightbox')).not.toHaveAttribute('open');
});
